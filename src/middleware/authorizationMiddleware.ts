import { Response, NextFunction } from "express";

const authorMiddleware= (roles: string[]) => (req: any, res: Response, next: NextFunction) => {

    if (!roles.includes(req.role)) {
        return res.status(401).json({ message: "Unauthorized Access!" })
      }
      next()
}

export default authorMiddleware