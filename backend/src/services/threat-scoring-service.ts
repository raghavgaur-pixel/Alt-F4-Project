import { Severity } from "@prisma/client";
import type { DetectedThreat, ThreatAssessment } from "../types/scan.js";

function severityFromRiskScore(riskScore: number): Severity {
  if (riskScore >= 85) return Severity.CRITICAL;
  if (riskScore >= 65) return Severity.HIGH_RISK;
  if (riskScore >= 40) return Severity.MEDIUM_RISK;
  if (riskScore >= 15) return Severity.LOW_RISK;
  return Severity.SAFE;
}

export const threatScoringService = {
  score(baseScore: number, findings: DetectedThreat[], recommendations: string[]): ThreatAssessment {
    const normalizedScore = Math.max(0, Math.min(100, baseScore));

    return {
      riskScore: normalizedScore,
      severity: severityFromRiskScore(normalizedScore),
      findings,
      recommendations
    };
  }
};

