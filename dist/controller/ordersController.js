"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderHistory = exports.deleteOrder = exports.getAllCustOrders = exports.getAllOrders = exports.updateOrder = exports.createNewOrder = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
// create new order
const createNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, id } = req.user;
        const { product_name, order_qty } = req.body;
        if (role == "staff" || role == "admin") {
            const { custId, product_name, order_qty } = req.body;
            const [newOrder] = yield dbConnection_1.DBLocal.promise().query(`INSERT INTO week16.orders (custId, product_name, order_qty, total, status, order_datetime, isDeleted)
            VALUES (?, ?, ?, (SELECT price FROM week16.products WHERE name = ?) * ?, ?, ?, ?)`, [custId, product_name, order_qty, product_name, order_qty, 'pending', new Date(), '0']);
            const [createdOrder] = yield dbConnection_1.DBLocal.promise().query(`SELECT * FROM week16.orders WHERE id = ?`, [newOrder.insertId]);
            res.status(200).json((0, errorHandling_1.errorHandling)(createdOrder[0], null));
        }
        else {
            const [newOrder] = yield dbConnection_1.DBLocal.promise().query(`INSERT INTO week16.orders (custId, product_name, order_qty, total, status, order_datetime, isDeleted)
            VALUES (?, ?, ?, (SELECT price FROM week16.products WHERE name = ?) * ?, ?, ?, ?)`, [id, product_name, order_qty, product_name, order_qty, 'pending', new Date(), '0']);
            const [createdOrder] = yield dbConnection_1.DBLocal.promise().query(`SELECT * FROM week16.orders WHERE id = ?`, [newOrder.insertId]);
            res.status(200).json((0, errorHandling_1.errorHandling)(createdOrder[0], null));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Order Request Failed..!! Internal Error!"));
    }
});
exports.createNewOrder = createNewOrder;
// update order status (from pending to completed or cancelled)
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.orderId;
    const { status } = req.body;
    try {
        const getOrder = yield dbConnection_1.DBLocal.promise().query(`SELECT * FROM week16.orders WHERE id = ? AND isDeleted = ?`, [id, '0']);
        if (getOrder[0].length > 0) {
            if (getOrder[0][0].status === "cancelled") {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "Order already cancelled...! Please make new Order!"));
                return;
            }
            else {
                yield dbConnection_1.DBLocal.promise().query(`UPDATE week16.orders SET status = ? WHERE id = ?`, [status, id]);
                const updatedOrder = yield dbConnection_1.DBLocal.promise().query(`SELECT * FROM week16.orders WHERE id = ?`, [id]);
                res.status(200).json((0, errorHandling_1.errorHandling)(updatedOrder[0][0], null));
            }
        }
        else {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "Order doesn't exist...!!"));
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Order Status Update Failed..!! Internal Error!"));
    }
});
exports.updateOrder = updateOrder;
// get all orders (cust can only see their own)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, id } = req.user;
        if (role === "cust") {
            const getOrders = yield dbConnection_1.DBLocal.promise().query(`
                SELECT o.id, o.status, o.custId, u.name, u.address, o.product_name, o.order_qty, o.total, o.order_datetime FROM  week16.orders as o LEFT JOIN week16.users as u ON o.custId = u.id
                WHERE o.CustId = ? AND o.isDeleted = ?`, [id, '0']);
            if (getOrders[0].length > 0) {
                res.status(200).json((0, errorHandling_1.errorHandling)({
                    message: "Order data retrieved Successfully",
                    data: getOrders[0]
                }, null));
            }
            else {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "Order doesn't exist...!!"));
            }
        }
        else if (role == "staff" || role == "admin") {
            const getOrders = yield dbConnection_1.DBLocal.promise().query(`
            SELECT o.id, o.status, o.custId, u.name, u.address, o.product_name, o.order_qty, o.total, o.order_datetime FROM  week16.orders as o LEFT JOIN week16.users as u ON o.custId = u.id WHERE o.isDeleted = ?`, ['0']);
            if (getOrders[0].length > 0) {
                res.status(200).json((0, errorHandling_1.errorHandling)({
                    message: "Order data retrieved Successfully",
                    data: getOrders[0]
                }, null));
            }
            else {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "Order doesn't exist...!!"));
            }
        }
        else {
            res.status(400).json((0, errorHandling_1.errorHandling)(null, "Unauthorized Access...!! Contact Staff!"));
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Failed to retreive order data..!! Internal Error!"));
    }
});
exports.getAllOrders = getAllOrders;
// get orders by cust id ===> staff & admin only!!
const getAllCustOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.custId;
        const getCustOrders = yield dbConnection_1.DBLocal.promise().query(`
        SELECT o.id, o.status, o.custId, u.name, u.address, o.product_name, o.order_qty, o.total, o.order_datetime FROM week16.orders as o LEFT JOIN week16.users as u ON o.custId = u.id
        WHERE o.CustId = ? AND isDeleted = ?`, [userId, '0']);
        res.status(200).json((0, errorHandling_1.errorHandling)({
            message: "Cust orders retrieved Successfully",
            data: getCustOrders[0]
        }, null));
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Failed to retreive cust orders..!! Internal Error!"));
    }
});
exports.getAllCustOrders = getAllCustOrders;
// soft delete order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const { id, role } = req.user;
        const checkOrder = yield dbConnection_1.DBLocal.promise().query(`
        SELECT o.id, o.status, o.custId, u.name, u.address, o.product_name, o.order_qty, o.total, o.order_datetime FROM week16.orders as o LEFT JOIN week16.users as u ON o.custId = u.id
        WHERE o.id = ?`, [orderId]);
        if (role == "cust") {
            if (checkOrder[0].length > 0 && checkOrder[0][0].custId == id) {
                yield dbConnection_1.DBLocal.promise().query(`UPDATE week16.orders SET isDeleted = ? WHERE week16.orders.id = ? AND week16.orders.custId = ?`, ['1', orderId, id]);
                res.status(200).json((0, errorHandling_1.errorHandling)("Order data Successfully deleted", null));
            }
            else {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "No Order Found..!!"));
                return;
            }
        }
        else {
            if (checkOrder[0].length > 0) {
                yield dbConnection_1.DBLocal.promise().query(`UPDATE week16.orders SET isDeleted = ? WHERE week16.orders.id = ? AND week16.orders.custId = ?`, ['1', orderId, id]);
                res.status(200).json((0, errorHandling_1.errorHandling)("Order data Successfully deleted", null));
            }
            else {
                res.status(400).json((0, errorHandling_1.errorHandling)(null, "No Order Found..!!"));
                return;
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Failed to remove order..!! Internal Error!"));
    }
});
exports.deleteOrder = deleteOrder;
// get order history ==> admin
const getOrderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [orderHistory] = yield dbConnection_1.DBLocal.promise().query(`
        SELECT o.id, o.status, o.custId, u.name, u.address, o.product_name, 
        o.order_qty, o.total, o.order_datetime FROM week16.orders as o 
        LEFT JOIN week16.users as u ON o.custId = u.id`);
        res.status(200).json((0, errorHandling_1.errorHandling)(orderHistory, null));
    }
    catch (error) {
        console.error(error);
        res.status(500).json((0, errorHandling_1.errorHandling)(null, "Failed to retreive orders history...!! Internal Error!"));
    }
});
exports.getOrderHistory = getOrderHistory;
