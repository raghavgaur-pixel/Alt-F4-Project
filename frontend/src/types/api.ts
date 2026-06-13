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

export interface Scan {
  id: string;
  userId: string;
  originalContent: string;
  qrType: string;
  riskScore: number;
  aiExplanation: string;
  severity: Severity;
  createdAt: string;
  threatReports: ThreatReport[];
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

