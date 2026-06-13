import { env } from "../config/env.js";
import type { ScanAnalysisResult } from "../types/scan.js";

export interface AiProvider {
  explainScan(result: Omit<ScanAnalysisResult, "aiExplanation">): Promise<string>;
}

class MockGeminiProvider implements AiProvider {
  async explainScan(result: Omit<ScanAnalysisResult, "aiExplanation">): Promise<string> {
    const findingSummary =
      result.findings.length > 0
        ? result.findings.map((finding) => finding.description).join(" ")
        : "No obvious malicious patterns were detected.";

    return `Mock Gemini (${env.GEMINI_API_KEY.slice(0, 4)}...) assessed this ${result.qrType} QR code as ${result.severity.replace(
      /_/g,
      " "
    )}. ${findingSummary}`;
  }
}

export const aiService: AiProvider = new MockGeminiProvider();

