import { Router } from "express";
import { authController } from "../controllers/auth-controller.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/auth-validator.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), authController.register);
authRouter.post("/login", validateBody(loginSchema), authController.login);

