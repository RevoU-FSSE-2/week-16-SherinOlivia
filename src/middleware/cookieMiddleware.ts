import cookieParser from "cookie-parser";
import { Application } from "express";

const cookieMiddleware = (app: Application) => {
  app.use(cookieParser());
};

export default cookieMiddleware;