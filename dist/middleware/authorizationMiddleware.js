"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorMiddleware = (roles) => (req, res, next) => {
    if (!roles.includes(req.role)) {
        return res.status(401).json({ message: "Unauthorized Access!" });
    }
    next();
};
exports.default = authorMiddleware;
