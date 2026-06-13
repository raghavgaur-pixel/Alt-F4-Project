import { prisma } from "../config/prisma.js";
import type { ReportInput } from "../validators/report-validator.js";

export const reportRepository = {
  create(payload: ReportInput) {
    return prisma.threatReport.create({
      data: payload,
      include: { scan: true }
    });
  },
  listRecent(limit = 20) {
    return prisma.threatReport.findMany({
      include: { scan: true },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  },
  groupByCategory() {
    return prisma.threatReport.groupBy({
      by: ["category"],
      _count: {
        _all: true
      }
    });
  }
};

