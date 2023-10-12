"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookieMiddleware_1 = __importDefault(require("./cookieMiddleware"));
const expressMiddleware_1 = __importDefault(require("./expressMiddleware"));
const helmetMiddleware_1 = __importDefault(require("./helmetMiddleware"));
const requestMiddleware_1 = __importDefault(require("./requestMiddleware"));
const morganMiddleware_1 = __importDefault(require("./morganMiddleware"));
// import corsMiddleware from "./corsMiddleware";
const appMiddleware = (app) => {
    (0, morganMiddleware_1.default)(app);
    app.use(requestMiddleware_1.default);
    (0, helmetMiddleware_1.default)(app);
    (0, expressMiddleware_1.default)(app);
    (0, cookieMiddleware_1.default)(app);
    // corsMiddleware(app);
};
exports.default = appMiddleware;
