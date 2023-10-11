import { Application } from "express";
import helmet from "helmet";

const helmetMiddleware = (app: Application) => {
  app.use(helmet());
  app.use(
    helmet({
      xFrameOptions: { action: "deny" },
      crossOriginEmbedderPolicy: true,
    })
  );
};

export default helmetMiddleware;