import { reportRepository } from "../repositories/report-repository.js";
import { scanRepository } from "../repositories/scan-repository.js";
import type { ReportInput } from "../validators/report-validator.js";
import { AppError } from "../utils/app-error.js";

export const reportService = {
  async createReport(payload: ReportInput) {
    const scan = await scanRepository.findById(payload.scanId);

    if (!scan) {
      throw new AppError("Scan not found", 404);
    }

    return reportRepository.create(payload);
  },

  async getCommunityReports() {
    const [reports, grouped] = await Promise.all([
      reportRepository.listRecent(),
      reportRepository.groupByCategory()
    ]);

    return {
      reports,
      statistics: grouped.map((entry) => ({
        category: entry.category,
        count: entry._count._all
      }))
    };
  }
};

