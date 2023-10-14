import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import JWT_TOKEN from '../config/jwtConfig';
import { RowDataPacket } from 'mysql2';
import NodeCache from 'node-cache';

const failedLoginAttemptsCache = new NodeCache({ stdTTL: 600 });
const resetPasswordCache = new NodeCache({ stdTTL: 300 });

// const passwordResetEmail = (email: any, resetKey: string) => {
//     console.log(`Subject: Password reset request`);
//     console.log(`To: ${email}`);
//     console.log(`Body: hit me, http://localhost:3000/reset?key=${resetKey}`);
// }

// Register Account (default is cust)
const registerUser = async (req: any, res: Response) => {
    try {
        const { username, email, password, role } =  req.body;
        const hashedPass = await bcrypt.hash(password, 10)
        const [existingUser] = await DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]) as RowDataPacket[];
        
            if (existingUser.length === 0) {
                const [newUser] = await DB.promise().query(
                `INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [username, email, hashedPass, 'cust']) as RowDataPacket[];
    
                const getNewUser = await DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                return res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                return res.status(400).json(errorHandling(null, "Username already exist...!!"));
            }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Register User Failed..!! Internal Error!"));
    }
}

// Register user by admin (can create staff)
const registerUserByAdmin = async (req: any, res: Response) => {
    try {
        const { username, email, password, role } =  req.body;
        const hashedPass = await bcrypt.hash(password, 10)
        const [existingUser] = await DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]) as RowDataPacket[];
        
        if (req.role === "admin") {
            console.log(req.role, "<=== test check role")
            if (existingUser.length === 0) {
                const [newUser] = await DB.promise().query(
                `INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [username, email, hashedPass, role]) as RowDataPacket[];
    
                const getNewUser = await DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                return res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                return res.status(400).json(errorHandling(null, "Username already exist...!!"));
            }
        } 
        return res.status(401).json(errorHandling(null, "Unauthorized Access...!"));
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Register User Failed..!! Internal Error!"));
    }
}


// Login Account

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        
        const failedAttempts = failedLoginAttemptsCache.get<number>(email);
        const user = existingUser[0][0];
        console.log(user, "password:", user.password);
        
        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json(errorHandling('Too many failed login attempts', null));
        }

        // Password check
        const passwordCheck = await bcrypt.compare(password, user.password);

        if (passwordCheck) {
            // Check if the user already has a refresh token
            let refreshToken = req.cookies.refresh_token;
            if (!refreshToken) {
                // Generate a new refresh token if one doesn't exist
                refreshToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN as Secret, { expiresIn: "7d" });
            }

            // Access token
            const accessToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN as Secret, { expiresIn: "24h" });
            
            // Reset limit login
            failedLoginAttemptsCache.del(email);

            // Expiration time for tokens
            const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            // Cookies
            res.cookie("access_token", accessToken, {
                expires: accessTokenExpiration,
                httpOnly: true,
            });

            res.cookie("refresh_token", refreshToken, {
                expires: refreshTokenExpiration,
                httpOnly: true,
            });

            return res.status(200).json(errorHandling({
                message: `${user.username} Successfully logged in as ${user.role}`,
                data: accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration
            }, null));
        } else {
            const newFailedAttempts = (failedAttempts || 0) + 1;
            failedLoginAttemptsCache.set(email, newFailedAttempts);
            return res.status(400).json(errorHandling(null, 'Password is incorrect'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Cannot Connect!! Internal Error!'));
    }
}

const refreshTokenRequest = async (req: any, res: Response) => {
    try {
        const refreshToken = req.cookies.refresh_token; // Get the refresh token from the client
        if (!refreshToken) {
            return res.status(401).json(errorHandling(null, 'Refresh token not provided'));
        }

        // Verify the refresh token
        const decodedToken: any = jwt.verify(refreshToken, JWT_TOKEN as Secret);

        // Generate a new access token
        const accessToken = jwt.sign(
            {
                username: decodedToken.username,
                id: decodedToken.id,
                role: decodedToken.role
            },
            JWT_TOKEN as Secret,
            { expiresIn: '24h' }
        );

        // Set the new access token in the response cookies
        const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        res.cookie('access_token', accessToken, {
            expires: accessTokenExpiration,
            httpOnly: true
        });

        res.status(200).json(errorHandling({
            message: 'Access token refreshed',
            data: accessToken,
            accessTokenExpiration
        }, null));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Refresh token is invalid or has expired'));
    }
}

// logout
const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json();
  };
  
// request reset password
const resetPasswordRequest = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const existingUser = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        const user = existingUser[0][0]
        if (!user) {
            return res.status(400).json(errorHandling(null, "User not found"));
        }

        const resetKey = Math.random().toString(36).substring(2, 15);
        resetPasswordCache.set(resetKey, email);
        // passwordResetEmail(email, resetKey); // Send reset email
        return res.status(200).json(errorHandling(`"Password reset Request sent to ${email} with ${resetKey}"`, null ));

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, "Password reset request failed"));
    }
 }

//  reset password
 const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const resetKey = req.query.resetKey as string;
        const email = resetPasswordCache.get(resetKey);

        if (!email) {
            return res.status(400).json(errorHandling(null, "Invalid token"));
        }

        const user = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        if (!user) {
            return res.status(400).json(errorHandling(null, "User not found"));
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await DB.promise().query("UPDATE railway.users SET password = ? WHERE email = ?", [hashedPassword, email]);

        resetPasswordCache.del(resetKey); // If successful, remove the key from the cache
        return res.status(200).json(errorHandling("Password reset success", null));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, "Password reset failed"));
    }
};

// Get All User data (Cust, Staff, Admin) ===> Admin Only!
const getAllUser = async (req: Request, res: Response) => {
    try {
        const allUser = await DB.promise().query('SELECT * FROM railway.users')

        if (!allUser) {
            return res.status(400).json(errorHandling(null, "User Data Unavailable..."));
        } else {
            return res.status(200).json(errorHandling(allUser[0], null));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// get all cust data (cust) ===> Staff & Admin only!
const getAllCust = async (req: Request, res: Response) => {
    try {
        const usersData = await DB.promise().query('SELECT * FROM railway.users WHERE role = ?',["cust"]) as RowDataPacket[]
    
        return res.status(200).json(errorHandling(usersData[0], null));
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}


// get user by ID aka profile ===> automatically shows specific user their profile (including staff & admin)
const userProfile =async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (user) { 
            const userId = user.id
            const userData = await DB.promise().query('SELECT * FROM railway.users WHERE id = ?',[userId]) as RowDataPacket[]
            return res.status(200).json(errorHandling(userData[0], null));
        }

        return res.status(400).json(errorHandling(null, "User Data Not Found..."));
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// get user by ID =>>> staff & admin can check specific users, user can only see their own
const getOneUser = async (req: Request, res: Response) => {
    try {
        const { role, id } = (req as any).user;
        const checkId = req.params.id

        if (role == "staff" || role == "admin") {
            const userData = await DB.promise().query('SELECT * FROM railway.users WHERE id = ?',[checkId]) as RowDataPacket[]
            return res.status(200).json(errorHandling(userData[0], null));
        } else if ((role !== "staff" && role !== "admin") && id == checkId) {
            const userData = await DB.promise().query('SELECT * FROM railway.users WHERE id = ?',[id]) as RowDataPacket[]
            return res.status(200).json(errorHandling(userData[0], null));
        } else {
            return res.status(400).json(errorHandling(null, "User Data Not Found..."));
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// Patch/Update name & address

const updateUser = async (req: Request, res: Response) => {
    try {
        const { role, id } = (req as any).user;

        const checkId = req.params.id
        const { name, address } = req.body

        if ((role !== "staff" && role !== "admin") && id == checkId) {
            await DB.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`,
                [name, address, id]);

            const updatedData = await DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`,[checkId]);


            res.status(200).json(errorHandling({
                message: "User Data Updated Successfully",
                data: updatedData[0]}, null));
        } else if (role == "staff" || role == "admin") {
            await DB.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`,
                [name, address, checkId])

            const updatedData = await DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`,[checkId]);

            return res.status(200).json(errorHandling({
                message: "User Data Updated Successfully",
                data: updatedData[0]}, null));
        } else {
            return res.status(400).json(errorHandling(null, "Unauthorized Update...!! Update Failed!!"));
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Update Failed...!!"));
    }
}


export { registerUser, registerUserByAdmin, loginUser, refreshTokenRequest, logoutUser, getAllUser, getAllCust, userProfile, getOneUser, updateUser, resetPasswordRequest, resetPassword}



