import express, { Request, Response } from 'express';
import authenMiddleware from '../middleware/authenticationMiddleware';
import orderrouter from './ordersRouter';
import productrouter from './productsRouter';
import userrouter from './usersRouter';


const router = express.Router();

// main app/page route
router.get("/", function (req: Request, res: Response) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Sherin Olivia's Milestone Project 2 (Week 11)!"
    })
})

// Router:
router.use('/api/orders', authenMiddleware, orderrouter)
router.use('/api/products', productrouter)
router.use('/api/users', userrouter)

export default router;