"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dbConfig_1 = require("./dbConfig");
require("dotenv/config");
// railway
exports.DB = mysql2_1.default.createConnection({
    host: dbConfig_1.DBConfig.HOST,
    user: dbConfig_1.DBConfig.USER,
    password: dbConfig_1.DBConfig.PASSWORD,
    database: dbConfig_1.DBConfig.DATABASE,
    port: +dbConfig_1.DBConfig.PORT
});
// local
// export const DBLocal = mysql.createConnection({
//     host: DBConfigLocal.HOST,
//     user: DBConfigLocal.USER,
//     password: DBConfigLocal.PASSWORD,
//     database: DBConfigLocal.DATABASE,
// })
