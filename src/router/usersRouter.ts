import express from 'express'
const userrouter = express.Router()
import authenMiddleware from '../middleware/authenticationMiddleware'
import authorMiddleware from '../middleware/authorizationMiddleware'
import { registerUser, loginUser, getAllUser, getAllCust, updateUser, logoutUser, resetPasswordRequest, resetPassword, userProfile, getOneUser, registerUserByAdmin } from '../controller/usersController';

// Register Account (Reminder: default is cust)
userrouter.post('/register', registerUser);

// Register Account by Admin (Can register staff)
userrouter.post('/admin/register', authenMiddleware, authorMiddleware(['admin']), registerUserByAdmin);

// Login Account
userrouter.post('/login', loginUser);

// Logout & Cookies clear
userrouter.post('/logout', logoutUser);

// reset password request
userrouter.post('/resetpassword/request', resetPasswordRequest)

// reset password
userrouter.post('/resetpassword', resetPassword)

// Get All Cust Data (Cust) ===> Staff & Admin Only!
userrouter.get('/cust', authenMiddleware, authorMiddleware(['staff','admin']), getAllCust);

// get one user by id (staff and admin can see specific user's data by id, normal user can only see their own)
userrouter.get('/profile/:id', authenMiddleware, authorMiddleware(['cust','staff','admin']), getOneUser);

// user Profile (specific user can automatically sees their own profile)
userrouter.get('/profile', authenMiddleware, authorMiddleware(['cust','staff','admin']), userProfile);

// Patch/Update name & address by id
userrouter.patch('/update/:id', authenMiddleware, authorMiddleware(['cust','staff','admin']), updateUser);

// Get All User data (Cust, Staff, Admin) ===> Admin Only!
userrouter.get('/', authenMiddleware, authorMiddleware(['admin']), getAllUser);


export default userrouter