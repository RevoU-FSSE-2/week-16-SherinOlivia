"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userrouter = express_1.default.Router();
const usersController_1 = require("../controller/usersController");
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
// Register Account (Reminder: default is cust, admin can register staff)
userrouter.post('/register', usersController_1.registerUser);
// Login Account
userrouter.post('/login', usersController_1.loginUser);
// Get All Cust Data (Cust) ===> Staff & Admin Only!
userrouter.get('/cust', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['staff', 'admin']), usersController_1.getAllCust);
// Patch/Update name & address by id
userrouter.patch('/update/:id', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['cust', 'staff', 'admin']), usersController_1.updateUser);
// Get All User data (Cust, Staff, Admin) ===> Admin Only!
userrouter.get('/', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['admin']), usersController_1.getAllUser);
exports.default = userrouter;
