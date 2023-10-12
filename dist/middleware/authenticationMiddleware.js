"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../config/jwtConfig"));
const authenMiddleware = (req, res, next) => {
    const authen = req.headers.authorization;
    if (!authen) {
        res.status(400).json({ error: "Unauthorized Access!!" });
    }
    else {
        const secretToken = authen.split(' ')[1];
        try {
            const decodedToken = jsonwebtoken_1.default.verify(secretToken, jwtConfig_1.default);
            console.log(decodedToken, `==== User's Decoded Data`);
            req.user = decodedToken;
            req.role = decodedToken.role;
            next();
        }
        catch (error) {
            res.status(400).json({ error: error });
        }
    }
};
exports.default = authenMiddleware;
