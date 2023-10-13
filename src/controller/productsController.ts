import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import { RowDataPacket } from 'mysql2';

// Create new Product
const createNewProduct = async (req: Request, res: Response) => {
    try {
        const { name, qty, price } = req.body
        const [existingProduct] = await DB.promise().query(`SELECT * FROM railway.products WHERE name = ?`, [name]) as RowDataPacket[];
        if (existingProduct.length === 0) {
            await DB.promise().query(
            `INSERT INTO railway.products (name, qty, price) VALUES (?, ?, ?)`,
            [name, qty, price]);

            const [newProduct] = await DB.promise().query(`SELECT * FROM railway.products WHERE name = ?`, [name]) as RowDataPacket[];
            return res.status(200).json(errorHandling(newProduct, null));
        } else {
            return res.status(400).json(errorHandling(null, "Product already exist...!!"));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Can't create new product...!! Internal Error!"));
    }
}

// Update Product Qty & Price

 const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const { qty, price } = req.body
        const [existingProduct] = await DB.promise().query(`SELECT * FROM railway.products WHERE id = ?`, [id]) as RowDataPacket[];
        
        if (existingProduct.length === 0) {
            return res.status(400).json(errorHandling(null, "Product doesn't exist...!!"));

        } else {
            await DB.promise().query(
            `UPDATE railway.products SET qty = ?, price = ? WHERE id = ?`,
            [qty, price, id]);
            const updatedProduct = await DB.promise().query(`SELECT * FROM railway.products WHERE id = ?`, [id]) as RowDataPacket[];
            return res.status(200).json(errorHandling(updatedProduct[0][0], null));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Can't Update Product...!! Internal Error!"));
    }
 }

//  get all Product Data

 const getAllProduct = async (req: Request, res: Response) => {
    try {
        const getAllProduct = await DB.promise().query(`SELECT * FROM railway.products`) as RowDataPacket[];
        
        if (getAllProduct.length === 0) {
            return res.status(400).json(errorHandling(null, "Product doesn't exist...!!"));

        } else {
            return res.status(200).json(errorHandling(getAllProduct[0], null));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Can't Get All Product Data...!! Internal Error!"));
    }
 }

// get product by id

const getOneProductId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [getOneProduct] = await DB.promise().query(`SELECT * FROM railway.products WHERE id = ?`, [id]) as RowDataPacket[];
        if (getOneProduct.length === 0) {
            return res.status(400).json(errorHandling(null, "Product doesn't exist...!!"));
        } else {
            return res.status(200).json(errorHandling(getOneProduct[0], null));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Can't Get Product Data...!! Internal Error!"));
    }
}

export {createNewProduct, updateProduct, getAllProduct, getOneProductId }

