import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { DB } from './dbConnection';
import 'dotenv/config'

const insertAdmin = async (req?: Request, res?: Response) => {
    try {
        const [adminCheck] = await DB.promise().query(`SELECT * FROM railway.users WHERE role = 'admin'`);
        
        if (Object.keys(adminCheck).length === 0) {
            const adminUsername = process.env.ADMIN_USERNAME;
            const adminPass = process.env.ADMIN_PASS;
            const hashedPass = await bcrypt.hash(adminPass!, 10);
            
        await DB.promise().query(`INSERT INTO railway.users (username, password, role) VALUES ('${adminUsername}', '${hashedPass}', 'admin')`)
        console.log("Admin Account successfully created! Welcome!");    
    } else {
        console.log("Reminder: Admin already exists");
        return
    }
    } catch (error) {
        console.error("Errorr!! Can't input Admin data");
    }
}


export default insertAdmin;

