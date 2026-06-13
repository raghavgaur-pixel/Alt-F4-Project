import { ThreatCategory } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { scanRepository } from "../repositories/scan-repository.js";
import type { ScanAnalysisResult } from "../types/scan.js";
import { AppError } from "../utils/app-error.js";
import { aiService } from "./ai-service.js";
import { browserInspectionService } from "./browser-inspection-service.js";
import { qrDecoderService } from "./qr-decoder-service.js";
import { threatScoringService } from "./threat-scoring-service.js";
import { upiAnalyzerService } from "./upi-analyzer-service.js";
import { urlAnalyzerService } from "./url-analyzer-service.js";
import { extractInspectableUrl } from "../utils/url.js";

export const scanService = {
  async analyzeUpload(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new AppError("QR image file is required", 400);
    }

    const decoded = await qrDecoderService.decode(file.buffer);
    const inspectableUrl = extractInspectableUrl(decoded.content);
    const qrType = inspectableUrl ? "URL" : decoded.qrType;
    const scanId = randomUUID();

    let baseScore = 5;
    const findings: ScanAnalysisResult["findings"] = [];
    const recommendations = new Set<string>([
      "Treat unsolicited QR codes as untrusted until the destination is verified."
    ]);
    let urlAnalysis: ScanAnalysisResult["urlAnalysis"];
    let upiAnalysis: ScanAnalysisResult["upiAnalysis"];
    let browserInspection: ScanAnalysisResult["browserInspection"];

    switch (qrType) {
      case "URL": {
        const analyzedUrl = inspectableUrl ?? decoded.content;
        const result = urlAnalyzerService.analyze(analyzedUrl);
        baseScore += result.scoreDelta;
        findings.push(...result.findings);
        result.recommendations.forEach((value) => recommendations.add(value));
        urlAnalysis = result.analysis;
        browserInspection = await browserInspectionService.inspect(analyzedUrl, scanId);
        baseScore += Math.min(35, browserInspection.scoreDelta);
        findings.push(...browserInspection.findings);
        browserInspection.recommendations.forEach((value) => recommendations.add(value));
        if (browserInspection.finalUrl && browserInspection.finalUrl !== analyzedUrl) {
          baseScore += browserInspection.redirects.length > 0 ? 6 : 0;
        }
        break;
      }
      case "UPI": {
        const result = upiAnalyzerService.analyze(decoded.content);
        baseScore += result.scoreDelta;
        findings.push(...result.findings);
        result.recommendations.forEach((value) => recommendations.add(value));
        upiAnalysis = result.analysis;
        break;
      }
      case "CRYPTO_WALLET": {
        baseScore += 22;
        findings.push({
          category: ThreatCategory.PAYMENT_FRAUD,
          description: "Crypto wallet transfers are irreversible and should be verified carefully."
        });
        recommendations.add("Confirm wallet ownership and transaction purpose before sending funds.");
        break;
      }
      case "SMS":
      case "PHONE":
      case "EMAIL": {
        baseScore += 12;
        findings.push({
          category: ThreatCategory.SOCIAL_ENGINEERING,
          description: "This QR code initiates a direct contact action that can be used for impersonation."
        });
        recommendations.add("Validate the sender identity before responding or sharing data.");
        break;
      }
      case "WIFI": {
        baseScore += 18;
        findings.push({
          category: ThreatCategory.DATA_HARVESTING,
          description: "Wi-Fi QR codes can connect devices to untrusted networks."
        });
        recommendations.add("Use only networks controlled by a trusted organization.");
        break;
      }
      default: {
        if (decoded.content.length > 180) {
          baseScore += 10;
        }
      }
    }

    const assessment = threatScoringService.score(
      baseScore,
      findings,
      Array.from(recommendations)
    );

    const partialResult = {
      originalContent: decoded.content,
      qrType,
      riskScore: assessment.riskScore,
      severity: assessment.severity,
      findings: assessment.findings,
      recommendations: assessment.recommendations,
      urlAnalysis,
      upiAnalysis,
      browserInspection
    };

    const aiExplanation = await aiService.explainScan(partialResult);
    const fullResult: ScanAnalysisResult = {
      ...partialResult,
      aiExplanation
    };

    return scanRepository.create(userId, fullResult, scanId);
  },

  async getScanById(scanId: string, userId: string) {
    const scan = await scanRepository.findByIdForUser(scanId, userId);

    if (!scan) {
      throw new AppError("Scan not found", 404);
    }

    return scan;
  },

  async getHistory(userId: string) {
    return scanRepository.findHistoryByUser(userId);
  }
};

