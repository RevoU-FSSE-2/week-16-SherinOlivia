import { Request, Response, NextFunction } from 'express';
import { errorHandling } from '../controller/errorHandling';

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const errorResponse = errorHandling(null, err);
  
    res.status(err.status || 500).json(errorResponse);
  };
  
  export default errorHandlerMiddleware;