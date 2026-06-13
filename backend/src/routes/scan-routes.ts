import { Router } from "express";
import multer from "multer";
import { scanController } from "../controllers/scan-controller.js";
import { requireAuth } from "../middleware/auth-middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const scanRouter = Router();

scanRouter.use(requireAuth);
scanRouter.post("/upload", upload.single("file"), scanController.upload);
scanRouter.get("/history", scanController.getHistory);
scanRouter.get("/recent", scanController.getRecent);
scanRouter.get("/:id", scanController.getById);

