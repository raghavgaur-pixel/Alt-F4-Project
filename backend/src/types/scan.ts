import type { Severity, ThreatCategory } from "@prisma/client";

export type QrType =
  | "URL"
  | "UPI"
  | "WIFI"
  | "SMS"
  | "PHONE"
  | "EMAIL"
  | "VCARD"
  | "CRYPTO_WALLET"
  | "TEXT"
  | "UNKNOWN";

export interface DetectedThreat {
  category: ThreatCategory;
  description: string;
}

export interface ThreatAssessment {
  riskScore: number;
  severity: Severity;
  findings: DetectedThreat[];
  recommendations: string[];
}

export interface DecodedQrPayload {
  content: string;
  qrType: QrType;
}

export interface UpiAnalysis {
  payee: string | null;
  amount: string | null;
  transactionNote: string | null;
  warnings: string[];
}

export interface UrlAnalysis {
  https: boolean;
  suspiciousKeywords: string[];
  redirectCount: number;
  urlLength: number;
  containsApkDownload: boolean;
  domainAgeNote: string;
  loginFormNote: string;
}

export interface ScanAnalysisResult {
  originalContent: string;
  qrType: QrType;
  riskScore: number;
  severity: Severity;
  findings: DetectedThreat[];
  recommendations: string[];
  aiExplanation: string;
  urlAnalysis?: UrlAnalysis;
  upiAnalysis?: UpiAnalysis;
}

