import { prisma } from "../config/prisma.js";
import type { ScanAnalysisResult } from "../types/scan.js";

export const scanRepository = {
  create(userId: string, analysis: ScanAnalysisResult) {
    return prisma.scan.create({
      data: {
        userId,
        originalContent: analysis.originalContent,
        qrType: analysis.qrType,
        riskScore: analysis.riskScore,
        aiExplanation: analysis.aiExplanation,
        severity: analysis.severity,
        threatReports: {
          create: analysis.findings.map((finding) => ({
            category: finding.category,
            description: finding.description
          }))
        }
      },
      include: {
        threatReports: true
      }
    });
  },
  findById(id: string) {
    return prisma.scan.findUnique({
      where: { id },
      include: { threatReports: true }
    });
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.scan.findFirst({
      where: { id, userId },
      include: { threatReports: true }
    });
  },
  findHistoryByUser(userId: string) {
    return prisma.scan.findMany({
      where: { userId },
      include: { threatReports: true },
      orderBy: { createdAt: "desc" }
    });
  },
  findRecentForUser(userId: string, limit = 10) {
    return prisma.scan.findMany({
      where: { userId },
      include: { threatReports: true },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }
};
