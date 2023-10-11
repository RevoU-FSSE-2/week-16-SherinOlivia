import { Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import JWT_TOKEN from "../config/jwtConfig";


const authenMiddleware = (req:any, res: Response, next: NextFunction) => {
    const authen = req.headers.authorization

    if (!authen) {
        res.status(400).json({error : "Unauthorized Access!!"})
    } else {
        const secretToken = authen.split(' ')[1]

        try {
            const decodedToken:any = jwt.verify(secretToken, JWT_TOKEN as Secret)
            console.log(decodedToken, `==== User's Decoded Data`)
            req.user = decodedToken
            req.role = decodedToken.role
            next()
        }catch (error) {
            res.status(400).json({error: error})
        }
    } 
}

export default authenMiddleware