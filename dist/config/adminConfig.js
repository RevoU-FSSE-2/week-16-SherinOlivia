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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConnection_1 = require("./dbConnection");
require("dotenv/config");
const insertAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [adminCheck] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE role = 'admin'`);
        if (Object.keys(adminCheck).length === 0) {
            const adminUsername = process.env.ADMIN_USERNAME;
            const adminPass = process.env.ADMIN_PASS;
            const hashedPass = yield bcrypt_1.default.hash(adminPass, 10);
            yield dbConnection_1.DB.promise().query(`INSERT INTO railway.users (username, password, role) VALUES ('${adminUsername}', '${hashedPass}', 'admin')`);
            console.log("Admin Account successfully created! Welcome!");
        }
        else {
            console.log("Reminder: Admin already exists");
            return;
        }
    }
    catch (error) {
        console.error("Errorr!! Can't input Admin data");
    }
});
exports.default = insertAdmin;
