import express from 'express'
const userrouter = express.Router()
import { registerUser, loginUser, getAllUser, getAllCust, updateUser, logoutUser } from '../controller/usersController';
import authenMiddleware from '../middleware/authenticationMiddleware'
import authorMiddleware from '../middleware/authorizationMiddleware'

// Register Account (Reminder: default is cust, admin can register staff)
userrouter.post('/register', registerUser);

// Login Account
userrouter.post('/login', loginUser);

// Logout & Cookies clear
userrouter.post('/logout', logoutUser);

// Get All Cust Data (Cust) ===> Staff & Admin Only!
userrouter.get('/cust', authenMiddleware, authorMiddleware(['staff','admin']), getAllCust);

// Patch/Update name & address by id
userrouter.patch('/update/:id', authenMiddleware, authorMiddleware(['cust','staff','admin']), updateUser);

// Get All User data (Cust, Staff, Admin) ===> Admin Only!
userrouter.get('/', authenMiddleware, authorMiddleware(['admin']), getAllUser);


export default userrouter