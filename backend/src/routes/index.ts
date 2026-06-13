import { Router } from "express";
import { authRouter } from "./auth-routes.js";
import { reportRouter, reportsRouter } from "./report-routes.js";
import { scanRouter } from "./scan-routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/scan", scanRouter);
apiRouter.use("/report", reportRouter);
apiRouter.use("/reports", reportsRouter);
