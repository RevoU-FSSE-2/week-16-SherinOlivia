import { Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import JWT_TOKEN from "../config/jwtConfig";
import { errorHandling } from "../controller/errorHandling";


const authenMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authen = req.cookies.access_token;

    if (!authen) {
        return res.status(400).json({ error: "Unauthorized Access!!" });
    }

    try {
        const decodedToken: any = jwt.verify(authen, JWT_TOKEN as Secret);
        console.log(decodedToken, `==== User's Decoded Data`);
        req.user = decodedToken;
        req.role = decodedToken.role;
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Can't Authenticate!! Internal Error!"));
    }
};

export default authenMiddleware;
