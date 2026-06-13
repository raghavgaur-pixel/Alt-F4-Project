import type { Request, Response } from "express";
import { scanRepository } from "../repositories/scan-repository.js";
import { scanService } from "../services/scan-service.js";
import { sendSuccess } from "../utils/http.js";

export const scanController = {
  async upload(req: Request, res: Response) {
    const result = await scanService.analyzeUpload(req.user!.id, req.file);
    sendSuccess(res, result, 201);
  },
  async getById(req: Request, res: Response) {
    const result = await scanService.getScanById(req.params.id, req.user!.id);
    sendSuccess(res, result);
  },
  async getHistory(req: Request, res: Response) {
    const result = await scanService.getHistory(req.user!.id);
    sendSuccess(res, result);
  },
  async getRecent(req: Request, res: Response) {
    const result = await scanRepository.findRecentForUser(req.user!.id);
    sendSuccess(res, result);
  }
};
