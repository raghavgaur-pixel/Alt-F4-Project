import type { Request, Response } from "express";
import { reportService } from "../services/report-service.js";
import { sendSuccess } from "../utils/http.js";

export const reportController = {
  async create(req: Request, res: Response) {
    const result = await reportService.createReport(req.body);
    sendSuccess(res, result, 201);
  },
  async list(_req: Request, res: Response) {
    const result = await reportService.getCommunityReports();
    sendSuccess(res, result);
  }
};

