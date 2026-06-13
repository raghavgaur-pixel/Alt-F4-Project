import { Router } from "express";
import { reportController } from "../controllers/report-controller.js";
import { requireAuth } from "../middleware/auth-middleware.js";
import { validateBody } from "../middleware/validate.js";
import { reportSchema } from "../validators/report-validator.js";

export const reportRouter = Router();
export const reportsRouter = Router();

reportRouter.post("/", requireAuth, validateBody(reportSchema), reportController.create);
reportsRouter.get("/", reportController.list);
