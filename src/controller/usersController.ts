import { Request, Response } from 'express';
import { DBLocal } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import JWT_TOKEN from '../config/jwtConfig'
import { RowDataPacket } from 'mysql2';

// Register Account (Reminder: default is cust, admin can register staff)
const registerUser = async (req: any, res: Response) => {
    try {
        const { username, password, role } =  req.body;
        const hashedPass = await bcrypt.hash(password, 10)
        const [existingUser] = await DBLocal.promise().query(`SELECT * FROM railway.users WHERE username = ?`, [username]) as RowDataPacket[];
        if (req.role = "admin") {
            console.log(req.role, "<=== test check role")
            if (existingUser.length === 0) {
                const [newUser] = await DBLocal.promise().query(
                `INSERT INTO railway.users (username, password, role) VALUES (?, ?, ?)`,
                [username, hashedPass, role]) as RowDataPacket[];
    
                const getNewUser = await DBLocal.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                res.status(400).json(errorHandling(null, "Username already exist...!!"));
                return
            }
        } else {
            if (existingUser.length === 0) {
                const [newUser] = await DBLocal.promise().query(
                `INSERT INTO railway.users (username, password, role) VALUES (?, ?, ?)`,
                [username, hashedPass, 'cust']) as RowDataPacket[];
    
                const getNewUser = await DBLocal.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
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
        const { username, password } = req.body
        const existingUser = await DBLocal.promise().query("SELECT * FROM railway.users WHERE username = ?", [username]) as RowDataPacket[];
        const user = existingUser[0][0]
        console.log(user, "password:", user.password)
        
        const passwordCheck = await bcrypt.compare(password, user.password) 

        if (passwordCheck) {
            // access token & refresh token
            const accessToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN as Secret, { expiresIn: "24h" });

            const refreshToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN as Secret, { expiresIn: "7d" });

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
            res.status(400).json(errorHandling('Password is incorrect', null))
          }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling('Cannot Connect!! Internal Error!', null));
    }
}

exports.logout_session = async (req: Request, res: Response) => {
    res.clearCookie('accesToken');
    res.clearCookie('refreshToken');
    res.json();
  };
  
// Get All User data (Cust, Staff, Admin) ===> Admin Only!
const getAllUser = async (req: Request, res: Response) => {
    try {
        const allUser = await DBLocal.promise().query('SELECT * FROM railway.users')

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
        const usersData = await DBLocal.promise().query('SELECT * FROM railway.users WHERE role = ?',["cust"]) as RowDataPacket[]
    
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
            await DBLocal.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`,
                [name, address, id]);

            const updatedData = await DBLocal.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`,[checkId]);


            res.status(200).json(errorHandling({
                message: "User Data Updated Successfully",
                data: updatedData[0]}, null));
        } else if (role == "staff" || role == "admin") {
            await DBLocal.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`,
                [name, address, checkId])

            const updatedData = await DBLocal.promise().query(`
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


export { registerUser, loginUser, getAllUser, getAllCust, updateUser }

