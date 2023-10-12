import { Request, Response } from 'express';
import { DBLocal } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import JWT_TOKEN from '../config/jwtConfig'
import { RowDataPacket } from 'mysql2';

// Create new Product
const createNewProduct = async (req: Request, res: Response) => {
    try {
        const { name, qty, price } = req.body
        const [existingProduct] = await DBLocal.promise().query(`SELECT * FROM week16.products WHERE name = ?`, [name]) as RowDataPacket[];
        if (existingProduct.length === 0) {
            await DBLocal.promise().query(
            `INSERT INTO week16.products (name, qty, price) VALUES (?, ?, ?)`,
            [name, qty, price]);

            const [newProduct] = await DBLocal.promise().query(`SELECT * FROM week16.products WHERE name = ?`, [name]) as RowDataPacket[];
            res.status(200).json(errorHandling(newProduct, null));
        } else {
            res.status(400).json(errorHandling(null, "Product already exist...!!"));
            return
        }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "Can't create new product...!! Internal Error!"));
    }
}

// Update Product Qty & Price

 const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const { qty, price } = req.body
        const [existingProduct] = await DBLocal.promise().query(`SELECT * FROM week16.products WHERE id = ?`, [id]) as RowDataPacket[];
        
        if (existingProduct.length === 0) {
            res.status(400).json(errorHandling(null, "Product doesn't exist...!!"));
            return

        } else {
            await DBLocal.promise().query(
            `UPDATE week16.products SET qty = ?, price = ? WHERE id = ?`,
            [qty, price, id]);
            const updatedProduct = await DBLocal.promise().query(`SELECT * FROM week16.products WHERE id = ?`, [id]) as RowDataPacket[];
            res.status(200).json(errorHandling(updatedProduct[0][0], null));
        }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "Can't Update Product...!! Internal Error!"));
    }
 }

//  get all Product Data

 const getAllProduct = async (req: Request, res: Response) => {
    try {
        const getAllProduct = await DBLocal.promise().query(`SELECT * FROM week16.products`) as RowDataPacket[];
        
        if (getAllProduct.length === 0) {
            res.status(400).json(errorHandling(null, "Product doesn't exist...!!"));
            return

        } else {
            res.status(200).json(errorHandling(getAllProduct[0], null));
        }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "Can't Get All Product Data...!! Internal Error!"));
    }
 }

// get product by id

const getOneProductId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [getOneProduct] = await DBLocal.promise().query(`SELECT * FROM week16.products WHERE id = ?`, [id]) as RowDataPacket[];
        if (getOneProduct.length === 0) {
            res.status(400).json(errorHandling(null, "Product doesn't exist...!!"));
            return
        } else {
            res.status(200).json(errorHandling(getOneProduct[0], null));
        }
    } catch (error) {
        console.error(error)
        res.status(500).json(errorHandling(null, "Can't Get Product Data...!! Internal Error!"));
    }
}

export {createNewProduct, updateProduct, getAllProduct, getOneProductId }

