import type { Request, Response } from "express";
import { authService } from "../services/auth-service.js";
import { sendSuccess } from "../utils/http.js";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 201);
  },
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  }
};

