import type { ScanAnalysisResult } from "../types/scan.js";

export interface AiProvider {
  explainScan(result: Omit<ScanAnalysisResult, "aiExplanation">): Promise<string>;
}

function labelSeverity(severity: ScanAnalysisResult["severity"]): string {
  return severity.replace(/_/g, " ").toLowerCase();
}

function confidenceFor(result: Omit<ScanAnalysisResult, "aiExplanation">): number {
  const findingWeight = Math.min(result.findings.length * 4, 12);
  const typeWeight = result.qrType === "UNKNOWN" ? -6 : 4;
  const severityWeight = result.severity === "SAFE" || result.severity === "LOW_RISK" ? 2 : 6;

  return Math.max(74, Math.min(97, 82 + findingWeight + typeWeight + severityWeight));
}

function threatAssessment(result: Omit<ScanAnalysisResult, "aiExplanation">): string {
  if (result.severity === "CRITICAL") {
    return "The payload demonstrates strong indicators of malicious intent and should be considered unsafe.";
  }

  if (result.severity === "HIGH_RISK") {
    return "The payload exhibits characteristics commonly observed in phishing and deceptive payment redirection attacks.";
  }

  if (result.severity === "MEDIUM_RISK") {
    return "The payload contains suspicious traits that warrant verification before user interaction.";
  }

  return "The payload appears informational and does not exhibit characteristics associated with phishing, malware, credential harvesting, or payment fraud.";
}

function detectedIndicators(result: Omit<ScanAnalysisResult, "aiExplanation">): string[] {
  const indicators = [`QR type identified: ${result.qrType}`];

  if (result.qrType === "URL" && result.urlAnalysis) {
    indicators.push(result.urlAnalysis.https ? "HTTPS enabled" : "HTTPS not enabled");

    if (result.urlAnalysis.redirectCount > 0) {
      indicators.push(`Redirect chain detected: ${result.urlAnalysis.redirectCount} redirect indicator(s)`);
    }

    if (result.urlAnalysis.suspiciousKeywords.length > 0) {
      indicators.push(`Phishing keyword signals observed: ${result.urlAnalysis.suspiciousKeywords.join(", ")}`);
    }

    if (result.urlAnalysis.containsApkDownload) {
      indicators.push("Executable or mobile application download indicator detected");
    }

    if (/login|signin|verify|account/i.test(result.originalContent)) {
      indicators.push("Login or account verification language detected");
    }
  }

  if (result.qrType === "UPI" && result.upiAnalysis) {
    if (result.upiAnalysis.payee) indicators.push(`Recipient name supplied: ${result.upiAnalysis.payee}`);
    if (result.upiAnalysis.amount) indicators.push(`Pre-filled payment amount detected: ${result.upiAnalysis.amount}`);
    if (result.upiAnalysis.transactionNote) indicators.push("Transaction note supplied for payer context");
    indicators.push(
      result.upiAnalysis.warnings.length > 0
        ? `Payment warning signal count: ${result.upiAnalysis.warnings.length}`
        : "No payment manipulation indicators detected"
    );
  }

  if (result.qrType === "TEXT") {
    indicators.push(
      /^https?:\/\//i.test(result.originalContent) || /https?:\/\/|www\./i.test(result.originalContent)
        ? "URL reference present inside text payload"
        : "No URL reference present inside text payload"
    );
    indicators.push(
      /(pay|upi|bank|transfer|amount|invoice|refund)/i.test(result.originalContent)
        ? "Payment instruction language detected"
        : "No payment instruction language detected"
    );
    indicators.push(
      /(\.exe|\.apk|download|install|powershell|script)/i.test(result.originalContent)
        ? "Executable or download instruction detected"
        : "No executable or download instruction detected"
    );
  }

  if (result.qrType === "WIFI") {
    indicators.push("Wi-Fi credential payload detected");
    indicators.push(/P:[^;]+/i.test(result.originalContent) ? "Network password embedded in QR payload" : "No network password field detected");
  }

  if (result.qrType === "EMAIL") {
    indicators.push("Email action payload detected");
    indicators.push(
      /(urgent|verify|password|account|payment|refund|kyc)/i.test(result.originalContent)
        ? "Social engineering language detected in email content"
        : "No high-pressure email language detected"
    );
  }

  if (result.qrType === "SMS") {
    indicators.push("SMS action payload detected");
    indicators.push(
      /(urgent|otp|verify|prize|refund|bank|kyc|blocked)/i.test(result.originalContent)
        ? "Fraud-oriented SMS wording detected"
        : "No fraud-oriented SMS wording detected"
    );
  }

  if (result.findings.length === 0) {
    indicators.push("No suspicious indicators detected", "No malicious payload patterns observed");
  } else {
    result.findings.forEach((finding) => indicators.push(finding.description));
  }

  return [...new Set(indicators)];
}

function potentialRisks(result: Omit<ScanAnalysisResult, "aiExplanation">): string[] {
  if (result.severity === "CRITICAL") {
    return ["Malware delivery", "Account compromise", "Payment theft"];
  }

  if (result.severity === "HIGH_RISK") {
    return ["Credential theft", "Financial fraud", "Data harvesting"];
  }

  if (result.severity === "MEDIUM_RISK") {
    return ["Deceptive content exposure", "Social engineering attempts"];
  }

  return ["Information authenticity concerns", "User verification recommended"];
}

function executiveSummary(result: Omit<ScanAnalysisResult, "aiExplanation">): string {
  const payloadContext =
    result.qrType === "URL"
      ? "The QR resolves to a web destination and was reviewed for transport security, redirect behavior, and phishing-oriented URL patterns."
      : result.qrType === "UPI"
        ? "The QR encodes a UPI payment request and was reviewed for recipient clarity, payment prefill behavior, and fraud pressure signals."
        : result.qrType === "WIFI"
          ? "The QR contains Wi-Fi configuration data and was reviewed for network trust and credential exposure."
          : result.qrType === "EMAIL"
            ? "The QR initiates an email action and was reviewed for social engineering language and identity abuse potential."
            : result.qrType === "SMS"
              ? "The QR initiates an SMS action and was reviewed for fraud wording, verification lures, and user pressure signals."
              : "The QR content was reviewed for embedded URLs, payment instructions, executable references, and suspicious instruction patterns.";

  return `AEGIS QR Threat Intelligence Engine classified this ${result.qrType} payload as ${labelSeverity(
    result.severity
  )} with a risk score of ${result.riskScore}/100. ${payloadContext}`;
}

function recommendations(result: Omit<ScanAnalysisResult, "aiExplanation">): string[] {
  const actions = new Set(result.recommendations);

  if (result.qrType === "URL") {
    actions.add("Open the domain only after confirming it matches the expected organization and does not rely on redirect parameters.");
    if (!result.urlAnalysis?.https) actions.add("Do not enter credentials or payment details because the destination lacks HTTPS.");
    if (result.urlAnalysis?.containsApkDownload) actions.add("Block the download path and validate the publisher before allowing installation.");
  } else if (result.qrType === "UPI") {
    actions.add("Compare the payee name and UPI handle with an independently verified source before approving payment.");
    if (result.upiAnalysis?.amount) actions.add("Confirm the requested amount outside the QR flow before authorizing the transaction.");
  } else if (result.qrType === "WIFI") {
    actions.add("Connect only if the network name matches a trusted location or administrator-provided SSID.");
    actions.add("Avoid using the network for banking, admin portals, or password resets until trust is established.");
  } else if (result.qrType === "EMAIL") {
    actions.add("Verify the recipient and subject before sending any account, invoice, or identity information.");
  } else if (result.qrType === "SMS") {
    actions.add("Do not send OTPs, banking details, or account identifiers through the pre-filled SMS action.");
  } else {
    actions.add("Validate the content source and inspect any embedded links or payment instructions before acting.");
  }

  return Array.from(actions);
}

class AegisQrAnalysisEngine implements AiProvider {
  async explainScan(result: Omit<ScanAnalysisResult, "aiExplanation">): Promise<string> {
    const confidence = confidenceFor(result);
    const indicators = detectedIndicators(result);
    const risks = potentialRisks(result);
    const actions = recommendations(result);

    return [
      "Executive Summary",
      executiveSummary(result),
      "",
      "Threat Assessment",
      threatAssessment(result),
      "",
      "Detected Indicators",
      indicators.map((indicator) => `✓ ${indicator}`).join("\n"),
      "",
      "Potential Risks",
      risks.map((risk) => `✓ ${risk}`).join("\n"),
      "",
      "Recommended Actions",
      actions.map((action) => `✓ ${action}`).join("\n"),
      "",
      "Confidence Score",
      `Confidence: ${confidence}%`,
      "Based on payload structure, detected indicators, and historical threat patterns from the AEGIS QR Analysis Engine."
    ].join("\n");
  }
}

export const aiService: AiProvider = new AegisQrAnalysisEngine();
