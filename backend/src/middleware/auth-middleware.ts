import type { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories/user-repository.js";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyAccessToken(token);
  const user = await userRepository.findById(payload.sub);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  req.user = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };

  next();
}

