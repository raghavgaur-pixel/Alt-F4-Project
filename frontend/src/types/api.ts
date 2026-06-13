export type Severity = "SAFE" | "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK" | "CRITICAL";
export type ThreatCategory =
  | "PHISHING"
  | "MALWARE"
  | "PAYMENT_FRAUD"
  | "SOCIAL_ENGINEERING"
  | "SUSPICIOUS_REDIRECT"
  | "DATA_HARVESTING"
  | "UNKNOWN";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ThreatReport {
  id: string;
  scanId: string;
  category: ThreatCategory;
  description: string;
  createdAt: string;
}

export interface ThreatFinding {
  category: ThreatCategory;
  description: string;
}

export type BrowserScreenshotType = "FULL_PAGE" | "VIEWPORT" | "FINAL_REDIRECTED";

export interface BrowserScreenshot {
  type: BrowserScreenshotType;
  fileName: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface BrowserRedirect {
  url: string;
  status: number | null;
}

export interface BrowserInspectionResult {
  riskLevel: Severity;
  confidence: number;
  finalUrl: string;
  redirects: BrowserRedirect[];
  findings: ThreatFinding[];
  screenshotFindings: string[];
  recommendations: string[];
  screenshots: BrowserScreenshot[];
  analysisNotes: string[];
  scoreDelta: number;
  browserErrors: string[];
}

export interface Scan {
  id: string;
  userId: string;
  originalContent: string;
  qrType: string;
  riskScore: number;
  aiExplanation: string;
  severity: Severity;
  finalUrl: string | null;
  browserInspection: BrowserInspectionResult | null;
  createdAt: string;
  threatReports: ThreatReport[];
  screenshots: BrowserScreenshot[];
}

export interface CommunityReport {
  id: string;
  scanId: string;
  category: ThreatCategory;
  description: string;
  createdAt: string;
  scan: Scan;
}

export interface CommunityReportResponse {
  reports: CommunityReport[];
  statistics: Array<{
    category: ThreatCategory;
    count: number;
  }>;
}

export interface ApiEnvelope<T> {
  data: T;
}

