"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userrouter = express_1.default.Router();
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const usersController_1 = require("../controller/usersController");
// Register Account (Reminder: default is cust)
userrouter.post('/register', usersController_1.registerUser);
// Register Account by Admin (Can register staff)
userrouter.post('/admin/register', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['admin']), usersController_1.registerUserByAdmin);
// Login Account
userrouter.post('/login', usersController_1.loginUser);
// Request Refresh Token
userrouter.post('/refresh', authenticationMiddleware_1.default, usersController_1.refreshTokenRequest);
// Logout & Cookies clear
userrouter.post('/logout', usersController_1.logoutUser);
// reset password request
userrouter.post('/resetpassword/request', usersController_1.resetPasswordRequest);
// reset password
userrouter.post('/resetpassword', usersController_1.resetPassword);
// Get All Cust Data (Cust) ===> Staff & Admin Only!
userrouter.get('/cust', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['staff', 'admin']), usersController_1.getAllCust);
// get one user by id (staff and admin can see specific user's data by id, normal user can only see their own)
userrouter.get('/profile/:id', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['cust', 'staff', 'admin']), usersController_1.getOneUser);
// user Profile (specific user can automatically sees their own profile)
userrouter.get('/profile', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['cust', 'staff', 'admin']), usersController_1.userProfile);
// Patch/Update name & address by id
userrouter.patch('/update/:id', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['cust', 'staff', 'admin']), usersController_1.updateUser);
// Get All User data (Cust, Staff, Admin) ===> Admin Only!
userrouter.get('/', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['admin']), usersController_1.getAllUser);
exports.default = userrouter;
