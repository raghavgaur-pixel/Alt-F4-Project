import { prisma } from "../config/prisma.js";
import type { BrowserInspectionResult, ScanAnalysisResult } from "../types/scan.js";

function normalizeBrowserInspection(browserInspection: BrowserInspectionResult | undefined) {
  if (!browserInspection) return null;

  return {
    ...browserInspection,
    screenshots: browserInspection.screenshots.map((screenshot) => ({
      ...screenshot
    }))
  };
}

export const scanRepository = {
  async create(userId: string, analysis: ScanAnalysisResult, scanId?: string) {
    return prisma.scan.create({
      data: {
        ...(scanId ? { id: scanId } : {}),
        userId,
        originalContent: analysis.originalContent,
        qrType: analysis.qrType,
        riskScore: analysis.riskScore,
        aiExplanation: analysis.aiExplanation,
        severity: analysis.severity,
        finalUrl: analysis.browserInspection?.finalUrl ?? null,
        browserInspection: normalizeBrowserInspection(analysis.browserInspection),
        threatReports: {
          create: analysis.findings.map((finding) => ({
            category: finding.category,
            description: finding.description
          }))
        },
        screenshots: analysis.browserInspection?.screenshots.length
          ? {
              create: analysis.browserInspection.screenshots.map((screenshot) => ({
                type: screenshot.type,
                fileName: screenshot.fileName,
                storagePath: screenshot.storagePath,
                publicUrl: screenshot.publicUrl,
                mimeType: screenshot.mimeType,
                width: screenshot.width,
                height: screenshot.height
              }))
            }
          : undefined
      } as any,
      include: {
        threatReports: true,
        screenshots: true
      } as any
    } as any);
  },
  findById(id: string) {
    return prisma.scan.findUnique({
      where: { id },
      include: { threatReports: true, screenshots: true }
    } as any);
  },
  findByIdForUser(id: string, userId: string) {
    return prisma.scan.findFirst({
      where: { id, userId },
      include: { threatReports: true, screenshots: true }
    } as any);
  },
  findHistoryByUser(userId: string) {
    return prisma.scan.findMany({
      where: { userId },
      include: { threatReports: true },
      orderBy: { createdAt: "desc" }
    } as any);
  },
  findRecentForUser(userId: string, limit = 10) {
    return prisma.scan.findMany({
      where: { userId },
      include: { threatReports: true, screenshots: true },
      orderBy: { createdAt: "desc" },
      take: limit
    } as any);
  }
};
