import express, { Application } from "express";

const expressMiddleware = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
}

export default expressMiddleware;