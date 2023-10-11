import { Application } from "express";
import cookieMiddleware from "./cookieMiddleware";
import expressMiddleware from "./expressMiddleware";
import helmetMiddleware from "./helmetMiddleware";
import requestIdMiddleware from "./requestMiddleware";
import morganMiddleware from "./morganMiddleware";
import corsMiddleware from "./corsMiddleware";

const appMiddleware = (app: Application) => {
    morganMiddleware(app)
    app.use(requestIdMiddleware)
    helmetMiddleware(app)
    expressMiddleware(app)
    cookieMiddleware(app)
    corsMiddleware(app);
}

export default appMiddleware