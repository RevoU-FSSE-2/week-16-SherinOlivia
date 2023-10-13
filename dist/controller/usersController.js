"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.resetPasswordRequest = exports.updateUser = exports.getAllCust = exports.getAllUser = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../config/jwtConfig"));
const node_cache_1 = __importDefault(require("node-cache"));
const failedLoginAttemptsCache = new node_cache_1.default({ stdTTL: 600 });
const resetPasswordCache = new node_cache_1.default({ stdTTL: 300 });
// const passwordResetEmail = (email: any, resetKey: string) => {
//     console.log(`Subject: Password reset request`);
//     console.log(`To: ${email}`);
//     console.log(`Body: hit me, http://localhost:3000/reset?key=${resetKey}`);
// }
// Register Account (Reminder: default is cust, admin can register staff)
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const hashedPass = yield bcrypt_1.default.hash(password, 10);
        const [existingUser] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]);
        if (req.role === "admin") {
            console.log(req.role, "<=== test check role");
            if (existingUser.length === 0) {
                const [newUser] = yield dbConnection_1.DB.promise().query(`INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`, [username, email, hashedPass, role]);
                const getNewUser = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                res.status(200).json((0, errorHandling_1.errorHandling)(getNewUser[0], null));
            }
            else {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "Username already exist...!!"));
                return;
            }
        }
        else {
            if (existingUser.length === 0) {
                const [newUser] = yield dbConnection_1.DB.promise().query(`INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`, [username, email, hashedPass, 'cust']);
                const getNewUser = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                res.status(200).json((0, errorHandling_1.errorHandling)(getNewUser[0], null));
            }
            else {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "Username already exist...!!"));
                return;
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Register User Failed..!! Internal Error!"));
    }
});
exports.registerUser = registerUser;
// Login Account
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield dbConnection_1.DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]);
        const failedAttempts = failedLoginAttemptsCache.get(email);
        const user = existingUser[0][0];
        console.log(user, "password:", user.password);
        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json((0, errorHandling_1.errorHandling)('Too many failed login attempts', null));
        }
        // password check
        const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
        if (passwordCheck) {
            // access token & refresh token
            const accessToken = jsonwebtoken_1.default.sign({ username: user.username, id: user.id, role: user.role }, jwtConfig_1.default, { expiresIn: "24h" });
            const refreshToken = jsonwebtoken_1.default.sign({ username: user.username, id: user.id, role: user.role }, jwtConfig_1.default, { expiresIn: "7d" });
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
            res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${user.username} Successfully logged in as ${user.role}`,
                data: accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration
            }, null));
        }
        else {
            const newFailedAttempts = (failedAttempts || 0) + 1;
            failedLoginAttemptsCache.set(email, newFailedAttempts);
            res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Password is incorrect'));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Cannot Connect!! Internal Error!'));
    }
});
exports.loginUser = loginUser;
// logout
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json();
});
exports.logoutUser = logoutUser;
// request reset password
const resetPasswordRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existingUser = yield dbConnection_1.DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]);
        const user = existingUser[0][0];
        if (!user) {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "User not found"));
            return;
        }
        const resetKey = Math.random().toString(36).substring(2, 15);
        resetPasswordCache.set(resetKey, email);
        // passwordResetEmail(email, resetKey); // Send reset email
        res.status(200).json((0, errorHandling_1.errorHandling)(`"Password reset Request sent to ${email} with ${resetKey}"`, null));
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Password reset request failed"));
    }
});
exports.resetPasswordRequest = resetPasswordRequest;
//  reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const resetKey = req.query.resetKey;
        const email = resetPasswordCache.get(resetKey);
        if (!email) {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "Invalid token"));
            return;
        }
        const user = yield dbConnection_1.DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]);
        if (!user) {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "User not found"));
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield dbConnection_1.DB.promise().query("UPDATE railway.users SET password = ? WHERE email = ?", [hashedPassword, email]);
        resetPasswordCache.del(resetKey); // If successful, remove the key from the cache
        res.status(200).json((0, errorHandling_1.errorHandling)("Password reset success", null));
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Password reset failed"));
    }
});
exports.resetPassword = resetPassword;
// Get All User data (Cust, Staff, Admin) ===> Admin Only!
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUser = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users');
        if (!allUser) {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "User Data Unavailable..."));
        }
        else {
            res.status(200).json((0, errorHandling_1.errorHandling)(allUser[0], null));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Retrieval Failed...!!"));
    }
});
exports.getAllUser = getAllUser;
// get all cust data (cust) ===> Staff & Admin only!
const getAllCust = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users WHERE role = ?', ["cust"]);
        res.status(200).json((0, errorHandling_1.errorHandling)(usersData[0], null));
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Retrieval Failed...!!"));
    }
});
exports.getAllCust = getAllCust;
// Patch/Update name & address
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, id } = req.user;
        const checkId = req.params.id;
        const { name, address } = req.body;
        if ((role !== "staff" && role !== "admin") && id == checkId) {
            yield dbConnection_1.DB.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`, [name, address, id]);
            const updatedData = yield dbConnection_1.DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`, [checkId]);
            res.status(200).json((0, errorHandling_1.errorHandling)({
                message: "User Data Updated Successfully",
                data: updatedData[0]
            }, null));
        }
        else if (role == "staff" || role == "admin") {
            yield dbConnection_1.DB.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`, [name, address, checkId]);
            const updatedData = yield dbConnection_1.DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`, [checkId]);
            res.status(200).json((0, errorHandling_1.errorHandling)({
                message: "User Data Updated Successfully",
                data: updatedData[0]
            }, null));
        }
        else {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "Unauthorized Update...!! Update Failed!!"));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Update Failed...!!"));
    }
});
exports.updateUser = updateUser;
