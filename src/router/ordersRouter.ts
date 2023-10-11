import express from 'express'
const orderrouter = express.Router()
import { createNewOrder, updateOrder, getAllOrders, getAllCustOrders, deleteOrder, getOrderHistory } from '../controller/ordersController';
import authorMiddleware from '../middleware/authorizationMiddleware'

// Create new Order
orderrouter.post('/new', createNewOrder);

// Update Order status by order id (Completed / Cancelled) ===> Staff & Admin Only!
orderrouter.patch('/update/:orderId', authorMiddleware(['staff','admin']), updateOrder);

// soft delete order by order id
orderrouter.delete('/delete/:orderId', deleteOrder);

// Get All Order History ===> Admin Only!
orderrouter.get('/history', authorMiddleware(['admin']), getOrderHistory);

// Get All Order Data by cust id ===> Staff & Admin Only!
orderrouter.get('/:custId', authorMiddleware(['staff','admin']), getAllCustOrders);

// Get Orders Data (users can only see their own)
orderrouter.get('/', getAllOrders);

export default orderrouter