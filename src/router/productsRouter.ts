import express from 'express'
const productrouter = express.Router()
import {createNewProduct, updateProduct, getAllProduct, getOneProductId } from '../controller/productsController';
import authenMiddleware from '../middleware/authenticationMiddleware'
import authorMiddleware from '../middleware/authorizationMiddleware'

// Create / Add new Product ===> Staff & Admin Only!
productrouter.post('/new',authenMiddleware, authorMiddleware(['staff','admin']), createNewProduct);

// Update Product Qty / Price ===> Staff & Admin Only!
productrouter.patch('/update/:id',authenMiddleware, authorMiddleware(['staff','admin']), updateProduct);

// Get One Product Data by id
productrouter.get('/:id', getOneProductId);

// Get All Product Data ===> Open to everyone
productrouter.get('/', getAllProduct);

export default productrouter