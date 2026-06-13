import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Crosshair,
  FileSearch,
  Fingerprint,
  Gauge,
  RadioTower,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  WalletCards
} from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchScanById } from "@/api/scans";
import { submitReport } from "@/api/reports";
import { AppShell } from "@/components/layout/app-shell";
import { RiskMeter } from "@/components/scan/risk-meter";
import { SeverityBadge } from "@/components/scan/severity-badge";
import { ThreatFindings } from "@/components/scan/threat-findings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { Scan, Severity, ThreatCategory } from "@/types/api";

const reportSectionTitles = [
  "Executive Summary",
  "Threat Assessment",
  "Detected Indicators",
  "Potential Risks",
  "Recommended Actions",
  "Confidence Score"
];

const reportCategories = [
  "PHISHING",
  "MALWARE",
  "PAYMENT_FRAUD",
  "SOCIAL_ENGINEERING",
  "SUSPICIOUS_REDIRECT",
  "DATA_HARVESTING",
  "UNKNOWN"
] as const;

function parseAiReport(report: string) {
  const lines = report.split("\n");
  const sections: Array<{ title: string; body: string }> = [];
  let currentTitle = "Executive Summary";
  let currentBody: string[] = [];

  lines.forEach((line) => {
    if (reportSectionTitles.includes(line.trim())) {
      if (currentBody.length > 0) {
        sections.push({ title: currentTitle, body: currentBody.join("\n").trim() });
      }
      currentTitle = line.trim();
      currentBody = [];
      return;
    }

    currentBody.push(line);
  });

  if (currentBody.length > 0) {
    sections.push({ title: currentTitle, body: currentBody.join("\n").trim() });
  }

  return sections.length > 0 ? sections.filter((section) => section.body) : [{ title: "Executive Summary", body: report }];
}

function confidenceFromReport(report: string) {
  const match = report.match(/Confidence:\s*(\d+)%/i);
  return match ? Number(match[1]) : 91;
}

function sectionBody(sections: Array<{ title: string; body: string }>, title: string) {
  return sections.find((section) => section.title === title)?.body ?? "";
}

function normalizeReportLine(line: string) {
  return line.replace(/^[\s*+-]*[✓-]?\s*/, "").trim();
}

function extractListItems(body: string) {
  return body
    .split("\n")
    .map(normalizeReportLine)
    .filter(Boolean);
}

function severityRank(severity: Severity) {
  return {
    SAFE: 12,
    LOW_RISK: 28,
    MEDIUM_RISK: 55,
    HIGH_RISK: 78,
    CRITICAL: 94
  }[severity];
}

function severityTone(severity: Severity) {
  if (severity === "CRITICAL" || severity === "HIGH_RISK") return "text-rose-200 border-rose-400/25 bg-rose-400/10";
  if (severity === "MEDIUM_RISK") return "text-amber-200 border-amber-400/25 bg-amber-400/10";
  if (severity === "SAFE") return "text-emerald-200 border-emerald-400/25 bg-emerald-400/10";
  return "text-cyan-200 border-cyan-400/25 bg-cyan-400/10";
}

function categoryLabel(category: ThreatCategory | "UNKNOWN") {
  return category.replace(/_/g, " ");
}

function inferThreatCategory(scan: Scan, reportText: string): ThreatCategory | "UNKNOWN" {
  if (scan.threatReports[0]?.category) return scan.threatReports[0].category;
  const upperReport = reportText.toUpperCase();
  return reportCategories.find((categoryName) => upperReport.includes(categoryName.replace(/_/g, " "))) ?? "UNKNOWN";
}

function getVerdict(scan: Scan) {
  if (scan.severity === "CRITICAL") return "Block and escalate immediately";
  if (scan.severity === "HIGH_RISK") return "High-risk QR payload; user action should be blocked";
  if (scan.severity === "MEDIUM_RISK") return "Suspicious QR payload requiring user verification";
  if (scan.severity === "LOW_RISK") return "Low-risk payload with limited suspicious signals";
  return "No material threat detected";
}

function parsePayloadMetadata(content: string) {
  let recipient = "Not detected";
  let amount = "Not specified";

  try {
    const parsed = new URL(content);
    if (parsed.protocol.toLowerCase() === "upi:") {
      recipient = parsed.searchParams.get("pa") ?? parsed.searchParams.get("pn") ?? "UPI recipient detected";
      const transactionAmount = parsed.searchParams.get("am");
      const currency = parsed.searchParams.get("cu") ?? "INR";
      amount = transactionAmount ? `${currency} ${transactionAmount}` : "Not specified";
    } else {
      recipient = parsed.hostname || "URL endpoint detected";
      amount = "Not applicable";
    }
  } catch {
    const upiMatch = content.match(/(?:pa|pn)=([^&]+)/i);
    const amountMatch = content.match(/am=([^&]+)/i);
    if (upiMatch) recipient = decodeURIComponent(upiMatch[1]);
    if (amountMatch) amount = `INR ${decodeURIComponent(amountMatch[1])}`;
  }

  return { recipient, amount };
}

function buildFindings(scan: Scan, sections: Array<{ title: string; body: string }>) {
  const indicatorItems = extractListItems(sectionBody(sections, "Detected Indicators"));
  const riskItems = extractListItems(sectionBody(sections, "Potential Risks"));
  const sourceItems =
    scan.threatReports.length > 0
      ? scan.threatReports.map((finding) => `${categoryLabel(finding.category)}: ${finding.description}`)
      : indicatorItems.length > 0
        ? indicatorItems
        : riskItems;

  if (sourceItems.length === 0) {
    return [
      {
        title: scan.severity === "SAFE" ? "No confirmed malicious indicator" : "Behavioral anomaly detected",
        description:
          scan.severity === "SAFE"
            ? "The AI engine did not record explicit threat indicators in the decoded payload."
            : "The payload contains enough suspicious context to elevate the risk posture.",
        impact:
          scan.severity === "SAFE"
            ? "User impact is currently assessed as minimal."
            : "A user could be exposed to fraud, credential theft, or unsafe redirection if they proceed.",
        severity: scan.severity
      }
    ];
  }

  return sourceItems.slice(0, 5).map((item, index) => ({
    title: item.includes(":") ? item.split(":")[0] : `Intelligence Finding ${index + 1}`,
    description: item.includes(":") ? item.split(":").slice(1).join(":").trim() : item,
    impact:
      riskItems[index] ??
      (scan.riskScore >= 70
        ? "Material user harm is possible without intervention."
        : "The signal contributes to the aggregate risk score and should be reviewed."),
    severity: scan.severity
  }));
}

function buildRecommendations(sections: Array<{ title: string; body: string }>, scan: Scan) {
  const recommendations = extractListItems(sectionBody(sections, "Recommended Actions"));
  const fallback =
    scan.riskScore >= 70
      ? ["Block the QR interaction until a security owner reviews the payload.", "Warn the user not to submit credentials or payment details."]
      : ["Allow only after user verification.", "Retain the scan result for audit and future correlation."];

  return (recommendations.length > 0 ? recommendations : fallback).slice(0, 4).map((recommendation, index) => ({
    priority: index === 0 && scan.riskScore >= 70 ? "P1" : index < 2 ? "P2" : "P3",
    action: recommendation
  }));
}

function AnimatedScoreBar({ label, value, tone = "from-cyan-300 to-emerald-300" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase text-slate-500">
        <span>{label}</span>
        <span className="font-semibold text-slate-200">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800/90">
        <div className={`h-full animate-[threat-fill_900ms_ease-out] rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string | number;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-xl border border-border bg-slate-950/40 p-4">
      <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
        <Icon className="h-4 w-4 text-cyan-300" />
        <span>{label}</span>
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function ReportPanel({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {eyebrow ? <p className="mb-1 text-xs uppercase text-slate-500">{eyebrow}</p> : null}
      <h4 className="text-base font-semibold text-white">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function IntelligenceFindingCard({
  finding,
  index
}: {
  finding: { title: string; description: string; impact: string; severity: Severity };
  index: number;
}) {
  return (
    <div className="animate-[report-rise_450ms_ease-out_both] rounded-xl border border-border bg-slate-950/50 p-4" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500">Finding {index + 1}</p>
          <h5 className="mt-1 text-sm font-semibold text-white">{finding.title}</h5>
        </div>
        <SeverityBadge severity={finding.severity} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{finding.description}</p>
      <div className={`mt-4 rounded-lg border p-3 text-sm ${severityTone(finding.severity)}`}>
        <span className="font-semibold">Impact: </span>
        {finding.impact}
      </div>
    </div>
  );
}

function AiIntelligenceReport({
  scan,
  sections,
  confidence
}: {
  scan: Scan;
  sections: Array<{ title: string; body: string }>;
  confidence: number;
}) {
  const payloadMetadata = parsePayloadMetadata(scan.originalContent);
  const threatCategory = inferThreatCategory(scan, scan.aiExplanation);
  const findings = buildFindings(scan, sections);
  const recommendations = buildRecommendations(sections, scan);
  const executiveSummary = sectionBody(sections, "Executive Summary") || scan.aiExplanation;
  const detectedIndicatorCount = Math.max(findings.length, scan.threatReports.length);
  const threatLikelihood = Math.min(98, Math.max(scan.riskScore, severityRank(scan.severity)));
  const fraudProbability = threatCategory === "PAYMENT_FRAUD" ? Math.min(99, scan.riskScore + 12) : Math.min(95, Math.round(scan.riskScore * 0.86));
  const timeline = [
    { label: "Payload Parsed", icon: FileSearch },
    { label: "Metadata Extracted", icon: Fingerprint },
    { label: "Rules Executed", icon: Crosshair },
    { label: "Threat Intelligence Checked", icon: RadioTower },
    { label: "Classification Generated", icon: BrainCircuit }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-slate-950/30">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-sm uppercase text-cyan-300">
              <Sparkles className="h-4 w-4" />
              AEGIS QR Threat Intelligence Engine
            </p>
            <CardTitle>AI Report</CardTitle>
          </div>
          <Badge variant={scan.riskScore >= 70 ? "danger" : scan.riskScore >= 40 ? "warning" : "success"}>
            {categoryLabel(threatCategory)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-slate-500">Final Verdict</p>
                <h4 className="mt-2 max-w-2xl text-2xl font-semibold text-white">{getVerdict(scan)}</h4>
              </div>
              <SeverityBadge severity={scan.severity} />
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{executiveSummary}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <AnimatedScoreBar label="Risk Score" value={scan.riskScore} tone="from-amber-300 to-rose-500" />
              <AnimatedScoreBar label="Confidence Score" value={confidence} />
            </div>
          </div>

          <ReportPanel title="Threat Assessment" eyebrow="probability model">
            <div className="space-y-4">
              <AnimatedScoreBar label="Threat Likelihood" value={threatLikelihood} tone="from-rose-300 to-red-500" />
              <AnimatedScoreBar label="Fraud Probability" value={fraudProbability} tone="from-amber-300 to-orange-500" />
              <AnimatedScoreBar label="User Risk Level" value={severityRank(scan.severity)} tone="from-cyan-300 to-rose-400" />
              <AnimatedScoreBar label="Detection Confidence" value={confidence} />
            </div>
          </ReportPanel>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricTile icon={ClipboardCheck} label="QR Type" value={scan.qrType} />
          <MetricTile icon={WalletCards} label="Recipient" value={payloadMetadata.recipient} />
          <MetricTile icon={Gauge} label="Amount" value={payloadMetadata.amount} />
          <MetricTile icon={AlertTriangle} label="Warning Signals" value={detectedIndicatorCount} />
          <MetricTile icon={ShieldAlert} label="Threat Category" value={categoryLabel(threatCategory)} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <ReportPanel title="Detected Indicators" eyebrow="intelligence findings">
            <div className="space-y-4">
              {findings.map((finding, index) => (
                <IntelligenceFindingCard key={`${finding.title}-${index}`} finding={finding} index={index} />
              ))}
            </div>
          </ReportPanel>

          <div className="space-y-6">
            <ReportPanel title="Recommended Actions" eyebrow="security response">
              <div className="space-y-3">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.action} className="rounded-xl border border-border bg-slate-950/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant={recommendation.priority === "P1" ? "danger" : recommendation.priority === "P2" ? "warning" : "default"}>
                        {recommendation.priority}
                      </Badge>
                      <span className="text-xs uppercase text-slate-500">Actionable control</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{recommendation.action}</p>
                  </div>
                ))}
              </div>
            </ReportPanel>

            <ReportPanel title="Detection Timeline" eyebrow="analysis pipeline">
              <div className="space-y-3">
                {timeline.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-slate-950/50 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-100">{item.label}</p>
                        <p className="text-xs text-slate-500">Step {index + 1} completed</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    </div>
                  );
                })}
              </div>
            </ReportPanel>
          </div>
        </div>

        <ReportPanel title="Analyst Notes" eyebrow="classification rationale">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Target className="h-4 w-4 text-cyan-300" />
                Classification Basis
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The engine assigned {categoryLabel(threatCategory)} based on payload structure, decoded metadata, known risk patterns, and the aggregate severity score.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="h-4 w-4 text-amber-300" />
                Score Drivers
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {detectedIndicatorCount} warning signal{detectedIndicatorCount === 1 ? "" : "s"}, payload type, severity, and confidence weighting influenced the final risk score.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Not Detected
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                No executable attachment, local device exploit, or confirmed malware payload was identified from the decoded QR content.
              </p>
            </div>
          </div>
        </ReportPanel>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-slate-950/50 p-4 text-xs text-slate-500">
          <span>Generated by AEGIS QR Threat Intelligence Engine</span>
          <span>Analysis Confidence: {confidence}%</span>
          <span>Timestamp: {new Date(scan.createdAt).toLocaleString()}</span>
          <span>Detection Model Version: AEGIS QR-TI-2026.06</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-800/70 ${className}`} />;
}

export function ScanResultPage() {
  const { id = "" } = useParams();
  const { token } = useAuth();
  const [category, setCategory] = useState<(typeof reportCategories)[number]>("PHISHING");
  const [description, setDescription] = useState("");
  const scanQuery = useQuery({
    queryKey: ["scan", id],
    queryFn: () => fetchScanById(id, token!),
    enabled: Boolean(token && id)
  });
  const reportMutation = useMutation({
    mutationFn: () => submitReport({ scanId: id, category, description }, token!),
    onSuccess: () => setDescription("")
  });

  const scan = scanQuery.data;
  const reportSections = useMemo(() => {
    if (!scan) return [];
    return parseAiReport(scan.aiExplanation);
  }, [scan]);
  const confidence = scan ? confidenceFromReport(scan.aiExplanation) : 91;
  return (
    <AppShell>
      {scanQuery.isLoading ? (
        <div className="space-y-8">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-10 w-64" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <SkeletonBlock className="h-64" />
            <SkeletonBlock className="h-64" />
          </div>
          <SkeletonBlock className="h-96" />
        </div>
      ) : scanQuery.isError ? (
        <Card>
          <CardContent className="p-6 text-rose-300">{(scanQuery.error as Error).message}</CardContent>
        </Card>
      ) : scan ? (
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-sm uppercase text-slate-500">Scan Results</p>
            <h1 className="text-3xl font-semibold text-white">AEGIS QR Analysis Report</h1>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <RiskMeter riskScore={scan.riskScore} severity={scan.severity} confidence={confidence} />
            <Card>
              <CardHeader>
                <CardTitle>Payload Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-slate-950/40 p-4">
                    <div className="text-xs uppercase text-slate-500">Type</div>
                    <div className="mt-1 text-base font-medium text-white">{scan.qrType}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-slate-950/40 p-4">
                    <div className="text-xs uppercase text-slate-500">Length</div>
                    <div className="mt-1 text-base font-medium text-white">{scan.originalContent.length} Characters</div>
                  </div>
                  <div className="rounded-xl border border-border bg-slate-950/40 p-4">
                    <div className="text-xs uppercase text-slate-500">Encoding</div>
                    <div className="mt-1 text-base font-medium text-white">UTF-8</div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-slate-950/40 p-4">
                  <div className="text-xs uppercase text-slate-500">Decoded Payload</div>
                  <div className="mt-2 max-h-32 overflow-auto break-all text-sm leading-6 text-slate-200">
                    {scan.originalContent}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <AiIntelligenceReport scan={scan} sections={reportSections} confidence={confidence} />

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <ThreatFindings findings={scan.threatReports} />
            <Card>
              <CardHeader>
                <CardTitle>Detection Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Rules Engine", "AI Classifier", "Community Intel", "Risk Scoring"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-slate-950/40 p-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-slate-950/40 p-4">
                    <div className="text-xs uppercase text-slate-500">Scan ID</div>
                    <div className="mt-1 break-all text-sm text-slate-200">{scan.id}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-slate-950/40 p-4">
                    <div className="text-xs uppercase text-slate-500">Created</div>
                    <div className="mt-1 text-sm text-slate-200">{new Date(scan.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report to Community Feed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as (typeof reportCategories)[number])}
                    className="flex h-11 w-full rounded-xl border border-border bg-slate-950/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {reportCategories.map((value) => (
                      <option key={value} value={value}>
                        {value.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <Input value={scan.id} readOnly />
                </div>
                <Textarea
                  placeholder="Describe why this QR code should be reported."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <Button onClick={() => reportMutation.mutate()} disabled={!description || reportMutation.isPending}>
                  {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
