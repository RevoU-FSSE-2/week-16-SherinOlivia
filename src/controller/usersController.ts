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

// Register Account (Reminder: default is cust, admin can register staff)
const registerUser = async (req: any, res: Response) => {
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
                res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                res.status(400).json(errorHandling(null, "Username already exist...!!"));
                return
            }
        } else {
            if (existingUser.length === 0) {
                const [newUser] = await DB.promise().query(
                `INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [username, email, hashedPass, 'cust']) as RowDataPacket[];
    
                const getNewUser = await DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                res.status(400).json(errorHandling(null, "Username already exist...!!"));
                return
            }
        }

    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "Register User Failed..!! Internal Error!"));
    }
}

// Login Account

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const existingUser = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        
        const failedAttempts = failedLoginAttemptsCache.get<number>(email);
        const user = existingUser[0][0]
        console.log(user, "password:", user.password)
        
        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json(errorHandling('Too many failed login attempts', null));
        }

        // password check
        const passwordCheck = await bcrypt.compare(password, user.password) 

        if (passwordCheck) {
            // access token & refresh token
            const accessToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN as Secret, { expiresIn: "24h" });

            const refreshToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN as Secret, { expiresIn: "7d" });
            
            // reset limit login
            failedLoginAttemptsCache.del(email);

            // expiration time for tokens
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

            res.status(200).json(errorHandling({
                message: `${user.username} Successfully logged in as ${user.role}`,
                data: accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration}, null))
        } else {

            const newFailedAttempts = (failedAttempts || 0) + 1;
            failedLoginAttemptsCache.set(email, newFailedAttempts);
            res.status(400).json(errorHandling(null, 'Password is incorrect'))
          }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, 'Cannot Connect!! Internal Error!'));
    }
}

// logout
const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('accesToken');
    res.clearCookie('refreshToken');
    res.json();
  };
  
// request reset password
const resetPasswordRequest = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const existingUser = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        const user = existingUser[0][0]
        if (!user) {
            res.status(400).json(errorHandling(null, "User not found"));
            return;
        }

        const resetKey = Math.random().toString(36).substring(2, 15);
        resetPasswordCache.set(resetKey, email);
        // passwordResetEmail(email, resetKey); // Send reset email
        res.status(200).json(errorHandling(`"Password reset Request sent to ${email}"`, null ));

    } catch (error) {
        console.error(error);
        res.status(500).json(errorHandling(null, "Password reset request failed"));
    }
 }

//  reset password
 const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const resetKey = req.query.resetKey as string;
        const email = resetPasswordCache.get(resetKey);

        if (!email) {
            res.status(400).json(errorHandling(null, "Invalid token"));
            return;
        }

        const user = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        if (!user) {
            res.status(400).json(errorHandling(null, "User not found"));
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await DB.promise().query("UPDATE railway.users SET password = ? WHERE email = ?", [hashedPassword, email]);

        resetPasswordCache.del(resetKey); // If successful, remove the key from the cache
        res.status(200).json(errorHandling("Password reset success", null));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorHandling(null, "Password reset failed"));
    }
};




// Get All User data (Cust, Staff, Admin) ===> Admin Only!
const getAllUser = async (req: Request, res: Response) => {
    try {
        const allUser = await DB.promise().query('SELECT * FROM railway.users')

        if (!allUser) {
            res.status(400).json(errorHandling(null, "User Data Unavailable..."));
        } else {
            res.status(200).json(errorHandling(allUser[0], null));
        }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// get all cust data (cust) ===> Staff & Admin only!
const getAllCust = async (req: Request, res: Response) => {
    try {
        const usersData = await DB.promise().query('SELECT * FROM railway.users WHERE role = ?',["cust"]) as RowDataPacket[]
    
        res.status(200).json(errorHandling(usersData[0], null));
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
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

            res.status(200).json(errorHandling({
                message: "User Data Updated Successfully",
                data: updatedData[0]}, null));
        } else {
            res.status(400).json(errorHandling(null, "Unauthorized Update...!! Update Failed!!"));
        }

    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "User Data Update Failed...!!"));
    }
}


export { registerUser, loginUser, logoutUser, getAllUser, getAllCust, updateUser, resetPasswordRequest, resetPassword}



