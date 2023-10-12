"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const ordersRouter_1 = __importDefault(require("./ordersRouter"));
const productsRouter_1 = __importDefault(require("./productsRouter"));
const usersRouter_1 = __importDefault(require("./usersRouter"));
const router = express_1.default.Router();
// main app/page route
router.get("/", function (req, res) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Sherin Olivia's Milestone Project 2 (Week 11)!"
    });
});
// Router:
router.use('/api/orders', authenticationMiddleware_1.default, ordersRouter_1.default);
router.use('/api/products', productsRouter_1.default);
router.use('/api/users', usersRouter_1.default);
exports.default = router;
