"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBLocal = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dbConfig_1 = require("./dbConfig");
require("dotenv/config");
// railway
// export const DB = mysql.createConnection({
//     host: DBConfig.HOST,
//     user: DBConfig.USER,
//     password: DBConfig.PASSWORD,
//     database: DBConfig.DATABASE,
//     port: +DBConfig.PORT!
// })
// local
exports.DBLocal = mysql2_1.default.createConnection({
    host: dbConfig_1.DBConfigLocal.HOST,
    user: dbConfig_1.DBConfigLocal.USER,
    password: dbConfig_1.DBConfigLocal.PASSWORD,
    database: dbConfig_1.DBConfigLocal.DATABASE,
});
