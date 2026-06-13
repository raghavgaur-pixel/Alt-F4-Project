import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { analysisArtifactPublicPath, analysisArtifactRoot } from "../config/storage.js";
import type {
  BrowserInspectionResult,
  BrowserRedirect,
  BrowserScreenshot,
  BrowserScreenshotType,
  DetectedThreat
} from "../types/scan.js";
import { extractInspectableUrl, safeUrlHostname } from "../utils/url.js";
import { ThreatCategory, Severity } from "@prisma/client";

const URL_SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at"
]);

const TRUST_BRAND_TERMS = [
  "google",
  "microsoft",
  "apple",
  "paypal",
  "amazon",
  "meta",
  "facebook",
  "instagram",
  "whatsapp",
  "bank",
  "wallet"
];

function createBrowserErrorFinding(message: string): DetectedThreat {
  return {
    category: ThreatCategory.UNKNOWN,
    description: message
  };
}

function severityFromSignals(score: number): Severity {
  if (score >= 85) return Severity.CRITICAL;
  if (score >= 65) return Severity.HIGH_RISK;
  if (score >= 40) return Severity.MEDIUM_RISK;
  if (score >= 15) return Severity.LOW_RISK;
  return Severity.SAFE;
}

function clampConfidence(value: number) {
  return Math.max(45, Math.min(97, Math.round(value)));
}

function scoreFromRiskLevel(level: Severity): number {
  return {
    SAFE: 0,
    LOW_RISK: 10,
    MEDIUM_RISK: 24,
    HIGH_RISK: 40,
    CRITICAL: 56
  }[level];
}

async function saveScreenshot(
  scanId: string,
  type: BrowserScreenshotType,
  buffer: Buffer,
  width: number,
  height: number
): Promise<BrowserScreenshot> {
  const extension = "png";
  const folder = path.join(analysisArtifactRoot, scanId);
  await mkdir(folder, { recursive: true });

  const fileName = `${type.toLowerCase().replace(/_/g, "-")}.${extension}`;
  const storagePath = path.posix.join(scanId, fileName);
  const filePath = path.join(folder, fileName);
  await writeFile(filePath, buffer);

  const publicPath = path.posix.join(analysisArtifactPublicPath, scanId, fileName);

  return {
    type,
    fileName,
    storagePath,
    publicUrl: publicPath,
    mimeType: "image/png",
    width,
    height
  };
}

function analyzeSignals(params: {
  finalUrl: string;
  bodyText: string;
  title: string;
  iframeDetails: Array<{ hidden: boolean; src: string }>;
  formDetails: Array<{ hasPassword: boolean; hasCardFields: boolean; action: string; method: string }>;
  scriptSnippets: string[];
  popupCount: number;
  alertCount: number;
  openCount: number;
  permissionPrompts: string[];
  urlHint: string;
}): Omit<BrowserInspectionResult, "screenshots" | "browserErrors"> & { browserErrors: string[] } {
  const findings: DetectedThreat[] = [];
  const recommendations = new Set<string>([
    "Inspect the final destination domain before entering credentials or payment details."
  ]);
  const screenshotFindings = new Set<string>();
  const analysisNotes = new Set<string>();
  let score = 8;
  let confidence = 82;

  const finalHost = safeUrlHostname(params.finalUrl);
  const urlObject = new URL(params.finalUrl);
  const isHttps = urlObject.protocol === "https:";
  const shortened = URL_SHORTENERS.has(finalHost);
  const hasLoginLanguage = /login|sign in|verify|account|security update|authenticate/i.test(
    `${params.title}\n${params.bodyText}`
  );
  const hasPasswordField = params.formDetails.some((form) => form.hasPassword);
  const hasCardField = params.formDetails.some((form) => form.hasCardFields);
  const hasSuspiciousForm = hasPasswordField || hasCardField || params.formDetails.some((form) => /post/i.test(form.method));
  const hasIframeRisk = params.iframeDetails.some((iframe) => iframe.hidden);
  const scriptText = params.scriptSnippets.join("\n").toLowerCase();
  const hasSuspiciousJs =
    /eval\s*\(|document\.write\s*\(|settimeout\s*\(\s*['"`]/i.test(scriptText) ||
    /window\.location|location\.href|atob\s*\(/i.test(scriptText);
  const hasDownloadPrompt = /download|install|apk|update now/i.test(`${params.title}\n${params.bodyText}`);
  const pageText = params.bodyText.toLowerCase();

const brandImpersonation = TRUST_BRAND_TERMS.some((term) => {
  const mentionsBrand = pageText.includes(term);
  const hostMatchesBrand = finalHost.includes(term);

  return mentionsBrand && !hostMatchesBrand;
});
  const socialEngineering = /urgent|limited time|verify|suspended|blocked|claim now|reward|gift/i.test(
    `${params.title}\n${params.bodyText}`
  );
  if (!isHttps) {
    score += 18;
    findings.push({
      category: ThreatCategory.PHISHING,
      description: "The inspected page does not use HTTPS."
    });
    recommendations.add("Avoid submitting sensitive data on a non-HTTPS page.");
  }

  if (shortened) {
    score += 10;
    findings.push({
      category: ThreatCategory.SUSPICIOUS_REDIRECT,
      description: "The final destination uses a known URL shortening service."
    });
    analysisNotes.add("URL shortening service detected.");
  }

  if (hasLoginLanguage) {
    score += 10;
    findings.push({
      category: ThreatCategory.PHISHING,
      description: "The page uses login or verification language that can support credential harvesting."
    });
    screenshotFindings.add("Login or verification language visible in the rendered page.");
  }

  if (hasPasswordField) {
    score += 20;
    findings.push({
      category: ThreatCategory.PHISHING,
      description: "Password fields were detected on the page."
    });
    screenshotFindings.add("Password field present in the page layout.");
    recommendations.add("Never enter credentials unless the domain is independently verified.");
  }

  if (hasCardField) {
    score += 18;
    findings.push({
      category: ThreatCategory.PAYMENT_FRAUD,
      description: "Financial input fields were detected in the page markup."
    });
    screenshotFindings.add("Financial or payment form fields are visible.");
  }

  if (hasSuspiciousForm) {
    score += 12;
    findings.push({
      category: ThreatCategory.SOCIAL_ENGINEERING,
      description: "A suspicious form or cross-origin submission pattern was observed."
    });
  }

  if (hasIframeRisk) {
    score += 12;
    findings.push({
      category: ThreatCategory.SUSPICIOUS_REDIRECT,
      description: "Hidden or zero-sized iframe content was detected."
    });
    screenshotFindings.add("Hidden iframe content detected.");
  }

  if (hasSuspiciousJs) {
    score += 12;
    findings.push({
      category: ThreatCategory.MALWARE,
      description: "The page includes JavaScript patterns commonly associated with obfuscation or redirection."
    });
    screenshotFindings.add("Suspicious JavaScript behavior detected.");
  }

  if (hasDownloadPrompt) {
    score += 15;
    findings.push({
      category: ThreatCategory.MALWARE,
      description: "The page presents download or install language that can be used for malware delivery."
    });
  }

  if (brandImpersonation) {
  score += 15;

  findings.push({
    category: ThreatCategory.PHISHING,
    description:
      "The page references a well-known brand while being hosted on a different domain, which may indicate impersonation."
  });

  screenshotFindings.add(
    "Potential brand impersonation indicators detected."
  );

  recommendations.add(
    "Verify the domain belongs to the organization being referenced."
  );
}

  if (socialEngineering) {
    score += 8;
    findings.push({
      category: ThreatCategory.SOCIAL_ENGINEERING,
      description: "Urgency or reward-based language suggests social engineering pressure."
    });
  }

  if (params.popupCount > 0 || params.alertCount > 0 || params.openCount > 0) {
    score += Math.min(12, params.popupCount * 4 + params.alertCount * 2 + params.openCount * 2);
    findings.push({
      category: ThreatCategory.SOCIAL_ENGINEERING,
      description: "Popup or dialog behavior was triggered during page analysis."
    });
    screenshotFindings.add("Popup or dialog behavior observed.");
  }

  if (params.permissionPrompts.length > 0) {
    score += 8;
    findings.push({
      category: ThreatCategory.DATA_HARVESTING,
      description: `The page requested browser permissions: ${params.permissionPrompts.join(", ")}.`
    });
    screenshotFindings.add("Browser permission request pattern detected.");
  }

  if (params.urlHint.includes("apk")) {
    score += 12;
    findings.push({
      category: ThreatCategory.MALWARE,
      description: "The original URL hinted at a mobile application download."
    });
  }

  if (params.iframeDetails.length > 0 && params.iframeDetails.every((iframe) => iframe.hidden)) {
    screenshotFindings.add("One or more iframes were hidden from the user.");
  }

  const normalizedScore = Math.max(0, Math.min(100, score));
  const riskLevel = severityFromSignals(normalizedScore);
  confidence = clampConfidence(
    confidence +
      Math.min(8, findings.length * 2) +
      (params.permissionPrompts.length > 0 ? -4 : 0) +
      (params.popupCount > 0 ? -4 : 0)
  );

  if (findings.length === 0) {
    analysisNotes.add("No high-risk DOM or content indicators were detected.");
  }

  return {
    riskLevel,
    confidence,
    finalUrl: params.finalUrl,
    redirects: [],
    findings,
    screenshotFindings: Array.from(screenshotFindings),
    recommendations: Array.from(recommendations),
    analysisNotes: Array.from(analysisNotes),
    scoreDelta: normalizedScore,
    browserErrors: []
  };
}

export const browserInspectionService = {
  async inspect(initialUrl: string, scanId: string): Promise<BrowserInspectionResult> {
    const inspectableUrl = extractInspectableUrl(initialUrl);
    if (!inspectableUrl) {
      return {
        riskLevel: Severity.HIGH_RISK,
        confidence: 58,
        finalUrl: initialUrl,
        redirects: [],
        findings: [
          createBrowserErrorFinding("The QR payload could not be normalized into a browsable URL.")
        ],
        screenshotFindings: ["Browser inspection was skipped because the QR content is not a valid URL."],
        recommendations: [
          "Manually verify the QR content before opening it in a browser.",
          "Do not trust QR payloads that cannot be normalized into a safe destination URL."
        ],
        screenshots: [],
        analysisNotes: ["Browser session skipped because the payload was not a valid web URL."],
        scoreDelta: 24,
        browserErrors: []
      };
    }

    let playwrightModule: any = null;
    const bootstrapErrors: string[] = [];

    try {
      playwrightModule = await import("playwright");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      bootstrapErrors.push(`Playwright is unavailable: ${message}`);
      return {
        riskLevel: Severity.MEDIUM_RISK,
        confidence: 62,
        finalUrl: inspectableUrl,
        redirects: [],
        findings: [createBrowserErrorFinding("Automated browser inspection is unavailable in this environment.")],
        screenshotFindings: ["Browser automation could not start, so screenshot analysis was skipped."],
        recommendations: [
          "Review the destination manually because browser-based inspection could not be completed."
        ],
        screenshots: [],
        analysisNotes: ["Browser automation dependency could not be loaded."],
        scoreDelta: 18,
        browserErrors: bootstrapErrors
      };
    }

    const navigationTimeoutMs = env.URL_INSPECTION_NAVIGATION_TIMEOUT_MS;
    const timeoutMs = env.URL_INSPECTION_TIMEOUT_MS;
    const viewport = {
      width: env.URL_INSPECTION_VIEWPORT_WIDTH,
      height: env.URL_INSPECTION_VIEWPORT_HEIGHT
    };

    const browser = await playwrightModule.chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      viewport,
      javaScriptEnabled: true,
      acceptDownloads: false,
      ignoreHTTPSErrors: false
    });

    const observedPopups: Array<string> = [];
    const observedDialogs: string[] = [];
    await context.addInitScript(() => {
      const state = {
        permissionPrompts: [] as string[],
        openCount: 0
      };

      const browserWindow = globalThis as any;
      const originalOpen = browserWindow.open?.bind(browserWindow);
      browserWindow.open = function (...args: unknown[]) {
        state.openCount += 1;
        return originalOpen?.(...args);
      };

      Object.defineProperty(browserWindow, "__aegisInspectionState", {
        configurable: true,
        value: state
      });
    });

    const page = await context.newPage();
    await page.setDefaultTimeout(timeoutMs);
    await page.setDefaultNavigationTimeout(navigationTimeoutMs);
    let finalUrl = inspectableUrl;
    const redirects: BrowserRedirect[] = [];
    let screenshotData: {
      fullPage?: Buffer;
      viewport?: Buffer;
      finalRedirected?: Buffer;
    } = {};
    let analysisNotes: string[] = [];
    let screenshotFindings: string[] = [];
    let findings: DetectedThreat[] = [];
    let recommendations = new Set<string>();
    let confidence = 82;
    let riskLevel: Severity = Severity.SAFE;
    let browserErrorMessages: string[] = [];
    let pageTitle = "";
    let bodyText = "";
    let iframeDetails: Array<{ hidden: boolean; src: string }> = [];
    let formDetails: Array<{ hasPassword: boolean; hasCardFields: boolean; action: string; method: string }> = [];
    let scriptSnippets: string[] = [];
    let permissionPrompts: string[] = [];

    page.on("popup", (popup: any) => {
      observedPopups.push(popup.url());
      popup.close().catch(() => undefined);
    });
    page.on("dialog", (dialog: any) => {
      observedDialogs.push(dialog.message());
      dialog.dismiss().catch(() => undefined);
    });
    page.on("download", (download: any) => {
      download.cancel().catch(() => undefined);
    });

    try {
      const response = await page.goto(inspectableUrl, {
        waitUntil: "domcontentloaded",
        timeout: navigationTimeoutMs
      });

      if (response) {
  let request = response.request();
  const hops: BrowserRedirect[] = [];

  while (request.redirectedFrom()) {
    const previous = request.redirectedFrom();

    let status: number | null = null;

    try {
      const previousResponse = await previous.response();
      status = previousResponse?.status() ?? null;
    } catch {
      status = null;
    }

    hops.unshift({
      url: previous.url(),
      status
    });

    request = previous;
  }

  redirects.push(...hops);
}

      await page.waitForLoadState("networkidle", { timeout: navigationTimeoutMs }).catch(() => undefined);
      await page.waitForTimeout(500);

      finalUrl = page.url();

      screenshotData.fullPage = await page.screenshot({ fullPage: true });
      screenshotData.viewport = await page.screenshot({ fullPage: false });
      analysisNotes.push("Full-page screenshot captured successfully.");
analysisNotes.push("Viewport screenshot captured successfully.");
      await page.waitForTimeout(400);
      screenshotData.finalRedirected = await page.screenshot({ fullPage: false });

      pageTitle = await page.title().catch(() => "");
      bodyText = await page.locator("body").innerText().catch(() => "");

      iframeDetails = await page.locator("iframe").evaluateAll((frames: any) =>
        frames.map((frame: any) => {
          const element = frame as any;
          const style = (globalThis as any).getComputedStyle(element);

          return {
            hidden:
              style.display === "none" ||
              style.visibility === "hidden" ||
              Number.parseInt(style.width || "0", 10) === 0 ||
              Number.parseInt(style.height || "0", 10) === 0,
            src: element.src || ""
          };
        })
      ).catch(() => []);

      formDetails = await page.locator("form").evaluateAll((forms: any) =>
        forms.map((form: any) => {
          const element = form as any;
          const passwordFields = Array.from(element.querySelectorAll('input[type="password"]')).length > 0;
          const cardFields = Array.from(element.querySelectorAll('input, textarea')).some((input: any) =>
            /card|cc|cvv|cvc|upi|account|password|otp/i.test(
              `${input.getAttribute("name") ?? ""} ${input.getAttribute("placeholder") ?? ""} ${input.getAttribute("autocomplete") ?? ""}`
            )
          );

          return {
            hasPassword: passwordFields,
            hasCardFields: cardFields,
            action: element.getAttribute("action") ?? "",
            method: element.getAttribute("method") ?? "get"
          };
        })
      ).catch(() => []);

      scriptSnippets = await page.locator("script").evaluateAll((scripts: any) =>
        scripts
          .map((script: any) => (script.textContent || "").slice(0, 400))
          .filter(Boolean)
      ).catch(() => []);

      permissionPrompts = await page.locator("body").evaluate((node: any) => {
        const text = node.innerText.toLowerCase();
        const prompts = [] as string[];

        if (text.includes("allow notifications")) prompts.push("notifications");
        if (text.includes("allow location")) prompts.push("location");
        if (text.includes("enable browser notifications")) prompts.push("notifications");
        if (text.includes("allow camera")) prompts.push("camera");
        if (text.includes("allow microphone")) prompts.push("microphone");
        return prompts;
      }).catch(() => []);

      const analysis = analyzeSignals({
        finalUrl,
        bodyText,
        title: pageTitle,
        iframeDetails,
        formDetails,
        scriptSnippets,
        popupCount: observedPopups.length,
        alertCount: observedDialogs.length,
        openCount: Number(
          await page.evaluate(() => {
            const browserWindow = globalThis as any;
            const state = browserWindow.__aegisInspectionState as { openCount: number } | undefined;
            return state?.openCount ?? 0;
          }).catch(() => 0)
        ),
        permissionPrompts,
        urlHint: inspectableUrl
      });

      findings = analysis.findings;
      recommendations = new Set(analysis.recommendations);
      analysisNotes = analysis.analysisNotes;
      screenshotFindings = analysis.screenshotFindings;
      riskLevel = analysis.riskLevel;
      confidence = analysis.confidence;
      browserErrorMessages = analysis.browserErrors;

      const savedScreenshots: BrowserScreenshot[] = [];
      if (screenshotData.fullPage) {
        savedScreenshots.push(
          await saveScreenshot(scanId, "FULL_PAGE", screenshotData.fullPage, viewport.width, Math.max(viewport.height, 1200))
        );
      }
      if (screenshotData.viewport) {
        savedScreenshots.push(
          await saveScreenshot(scanId, "VIEWPORT", screenshotData.viewport, viewport.width, viewport.height)
        );
      }
      if (screenshotData.finalRedirected) {
        savedScreenshots.push(
          await saveScreenshot(scanId, "FINAL_REDIRECTED", screenshotData.finalRedirected, viewport.width, viewport.height)
        );
      }

      const browserResult: BrowserInspectionResult = {
        riskLevel,
        confidence,
        finalUrl,
        redirects,
        findings,
        screenshotFindings,
        recommendations: Array.from(recommendations),
        screenshots: savedScreenshots,
        analysisNotes,
        scoreDelta: analysis.scoreDelta,
        browserErrors: browserErrorMessages
      };
      analysisNotes.push("Browser inspection completed successfully.");
      return browserResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      browserErrorMessages.push(message);

      const failureFinding = /ssl|certificate|cert/i.test(message)
        ? "The browser reported a certificate or SSL validation failure."
        : /timeout/i.test(message)
          ? "The browser timed out while loading or analyzing the page."
          : /dns|name not resolved|enotfound/i.test(message)
            ? "The browser could not resolve the destination host."
            : /redirect/i.test(message)
              ? "A redirect loop or redirect failure interrupted browser analysis."
              : "The browser analysis session failed unexpectedly.";

      const failureRiskLevel = /ssl|certificate|dns|redirect/i.test(message)
        ? Severity.HIGH_RISK
        : Severity.MEDIUM_RISK;

      return {
        riskLevel: failureRiskLevel,
        confidence: 55,
        finalUrl,
        redirects,
        findings: [createBrowserErrorFinding(failureFinding)],
        screenshotFindings: ["Browser inspection did not complete successfully."],
        recommendations: [
          "Review the destination manually because automated browser analysis was interrupted.",
          "Do not trust this QR code until the final URL and page behavior are verified."
        ],
        screenshots: [],
        analysisNotes: ["Browser inspection encountered a recoverable failure."],
        scoreDelta: scoreFromRiskLevel(failureRiskLevel),
        browserErrors: browserErrorMessages
      };
    } finally {
      await page.close().catch(() => undefined);
      await context.close().catch(() => undefined);
      await browser.close().catch(() => undefined);
    }
  }
};
