"use strict";
// railway
// export const DBConfig = {
//     URL: process.env.SQL_URL,
//     HOST: process.env.SQL_HOST,
//     USER: process.env.SQL_USERNAME,
//     PASSWORD: process.env.SQL_PASSWORD,
//     DATABASE: process.env.SQL_DATABASE,
//     PORT: process.env.SQL_PORT
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfigLocal = void 0;
// local
exports.DBConfigLocal = {
    HOST: process.env.SQL_HOSTLOCAL,
    USER: process.env.SQL_USERNAMELOCAL,
    PASSWORD: process.env.SQL_PASSWORDLOCAL,
    DATABASE: process.env.SQL_DATABASELOCAL,
};
