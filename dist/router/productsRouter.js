"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productrouter = express_1.default.Router();
const productsController_1 = require("../controller/productsController");
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
// Create / Add new Product ===> Staff & Admin Only!
productrouter.post('/new', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['staff', 'admin']), productsController_1.createNewProduct);
// Update Product Qty / Price ===> Staff & Admin Only!
productrouter.patch('/update/:id', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['staff', 'admin']), productsController_1.updateProduct);
// Get One Product Data by id
productrouter.get('/:id', productsController_1.getOneProductId);
// Get All Product Data ===> Open to everyone
productrouter.get('/', productsController_1.getAllProduct);
exports.default = productrouter;
