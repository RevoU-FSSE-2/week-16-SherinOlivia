import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const requestIdMiddleware = (req: any , res: Response, next: NextFunction) => {

  if (req.headers['x-request-id']) {
    res.setHeader('x-request-id', req.headers['x-request-id']);
    req.request_id = req.headers['x-request-id'] as string;
  } else {
    const uuid = uuidv4();
    res.setHeader('x-request-id', uuid);
    req.request_id = uuid;
  }
  next();
};

export default requestIdMiddleware;
