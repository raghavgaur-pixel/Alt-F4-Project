import type { DetectedThreat, UrlAnalysis } from "../types/scan.js";
import { ThreatCategory } from "@prisma/client";

const suspiciousKeywords = [
  "login",
  "verify",
  "account",
  "secure",
  "wallet",
  "gift",
  "free",
  "bonus",
  "apk",
  "update"
];

export interface UrlAnalyzerResult {
  analysis: UrlAnalysis;
  scoreDelta: number;
  findings: DetectedThreat[];
  recommendations: string[];
}

export const urlAnalyzerService = {
  analyze(rawUrl: string): UrlAnalyzerResult {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return {
        analysis: {
          https: false,
          suspiciousKeywords: [],
          redirectCount: 0,
          urlLength: rawUrl.length,
          containsApkDownload: false,
          domainAgeNote: "Invalid URL format.",
          loginFormNote: "Login form detection unavailable because the URL is invalid."
        },
        scoreDelta: 60,
        findings: [
          {
            category: ThreatCategory.PHISHING,
            description: "The QR code points to an invalid or malformed URL."
          }
        ],
        recommendations: ["Do not open or share this QR code until the source is verified."]
      };
    }

    let scoreDelta = 5;
    const findings: DetectedThreat[] = [];
    const recommendations = new Set<string>([
      "Verify the destination domain before entering credentials or downloading files."
    ]);
    const matchedKeywords = suspiciousKeywords.filter((keyword) =>
      parsedUrl.href.toLowerCase().includes(keyword)
    );
    const containsApkDownload = /\.apk($|\?)/i.test(parsedUrl.pathname) || parsedUrl.href.toLowerCase().includes("apk");
    const redirectCount = (parsedUrl.search.match(/redirect|url=|next=|target=/gi) ?? []).length;

    if (parsedUrl.protocol !== "https:") {
      scoreDelta += 20;
      findings.push({
        category: ThreatCategory.PHISHING,
        description: "The destination does not use HTTPS, which weakens transport security."
      });
      recommendations.add("Avoid submitting sensitive data through a non-HTTPS page.");
    }

    if (matchedKeywords.length > 0) {
      scoreDelta += 12;
      findings.push({
        category: ThreatCategory.SOCIAL_ENGINEERING,
        description: `The URL contains high-risk keywords: ${matchedKeywords.join(", ")}.`
      });
    }

    if (redirectCount > 0) {
      scoreDelta += Math.min(redirectCount * 8, 20);
      findings.push({
        category: ThreatCategory.SUSPICIOUS_REDIRECT,
        description: "The URL contains parameters commonly used for redirect-based tracking or cloaking."
      });
    }

    if (parsedUrl.href.length > 120) {
      scoreDelta += 10;
      findings.push({
        category: ThreatCategory.UNKNOWN,
        description: "The URL is unusually long, which can be used to hide the real destination."
      });
    }

    if (containsApkDownload) {
      scoreDelta += 30;
      findings.push({
        category: ThreatCategory.MALWARE,
        description: "The URL appears to initiate or advertise an APK download."
      });
      recommendations.add("Do not sideload APK files unless the publisher and checksum are verified.");
    }

    return {
      analysis: {
        https: parsedUrl.protocol === "https:",
        suspiciousKeywords: matchedKeywords,
        redirectCount,
        urlLength: parsedUrl.href.length,
        containsApkDownload,
        domainAgeNote: "Domain age check is a placeholder until WHOIS or threat intel is integrated.",
        loginFormNote: "Login form detection is a placeholder until headless inspection is integrated."
      },
      scoreDelta,
      findings,
      recommendations: Array.from(recommendations)
    };
  }
};

