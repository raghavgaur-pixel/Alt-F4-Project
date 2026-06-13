import { ThreatCategory } from "@prisma/client";
import type { DetectedThreat, UpiAnalysis } from "../types/scan.js";

export interface UpiAnalyzerResult {
  analysis: UpiAnalysis;
  scoreDelta: number;
  findings: DetectedThreat[];
  recommendations: string[];
}

export const upiAnalyzerService = {
  analyze(payload: string): UpiAnalyzerResult {
    const url = new URL(payload);
    const payee = url.searchParams.get("pn");
    const amount = url.searchParams.get("am");
    const transactionNote = url.searchParams.get("tn");
    const payeeAddress = url.searchParams.get("pa");
    const findings: DetectedThreat[] = [];
    const recommendations = new Set<string>([
      "Confirm the recipient identity through a trusted channel before approving payment."
    ]);
    const warnings: string[] = [];
    let scoreDelta = 8;

    if (amount) {
      scoreDelta += 20;
      warnings.push("This request contains a pre-filled amount.");
      findings.push({
        category: ThreatCategory.PAYMENT_FRAUD,
        description: "The QR code includes a pre-filled payment amount."
      });
    }

    if (!payeeAddress || !payeeAddress.includes("@")) {
      scoreDelta += 16;
      warnings.push("The UPI receiver handle looks incomplete or unusual.");
      findings.push({
        category: ThreatCategory.PAYMENT_FRAUD,
        description: "The receiver UPI ID appears incomplete or suspicious."
      });
    }

    if (transactionNote && /(urgent|refund|reward|kyc|verify)/i.test(transactionNote)) {
      scoreDelta += 18;
      warnings.push("The note includes pressure or verification language commonly seen in scams.");
      findings.push({
        category: ThreatCategory.SOCIAL_ENGINEERING,
        description: "The payment note contains urgent or manipulative language."
      });
    }

    if (!payee) {
      scoreDelta += 10;
      warnings.push("The request omits a clear payee name.");
    }

    return {
      analysis: {
        payee,
        amount,
        transactionNote,
        warnings
      },
      scoreDelta,
      findings,
      recommendations: Array.from(recommendations)
    };
  }
};

