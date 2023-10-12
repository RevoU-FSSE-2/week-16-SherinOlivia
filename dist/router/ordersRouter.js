"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderrouter = express_1.default.Router();
const ordersController_1 = require("../controller/ordersController");
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
// Create new Order
orderrouter.post('/new', ordersController_1.createNewOrder);
// Update Order status by order id (Completed / Cancelled) ===> Staff & Admin Only!
orderrouter.patch('/update/:orderId', (0, authorizationMiddleware_1.default)(['staff', 'admin']), ordersController_1.updateOrder);
// soft delete order by order id
orderrouter.delete('/delete/:orderId', ordersController_1.deleteOrder);
// Get All Order History ===> Admin Only!
orderrouter.get('/history', (0, authorizationMiddleware_1.default)(['admin']), ordersController_1.getOrderHistory);
// Get All Order Data by cust id ===> Staff & Admin Only!
orderrouter.get('/:custId', (0, authorizationMiddleware_1.default)(['staff', 'admin']), ordersController_1.getAllCustOrders);
// Get Orders Data (users can only see their own)
orderrouter.get('/', ordersController_1.getAllOrders);
exports.default = orderrouter;
