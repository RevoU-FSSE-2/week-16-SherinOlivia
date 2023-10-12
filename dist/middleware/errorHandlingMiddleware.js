"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandling_1 = require("../controller/errorHandling");
const errorHandlerMiddleware = (err, req, res, next) => {
    const errorResponse = (0, errorHandling_1.errorHandling)(null, err);
    res.status(err.status || 500).json(errorResponse);
};
exports.default = errorHandlerMiddleware;
