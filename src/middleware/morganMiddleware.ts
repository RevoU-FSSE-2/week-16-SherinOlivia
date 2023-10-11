import { Application } from "express";
import morgan from "morgan";

const morganMiddleware = (app: Application) => {
  app.use(morgan("dev"));
};

export default morganMiddleware;