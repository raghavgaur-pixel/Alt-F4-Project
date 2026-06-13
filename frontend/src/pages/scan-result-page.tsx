import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Download, FileWarning, ShieldCheck, Sparkles } from "lucide-react";
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

const reportCategories = [
  "PHISHING",
  "MALWARE",
  "PAYMENT_FRAUD",
  "SOCIAL_ENGINEERING",
  "SUSPICIOUS_REDIRECT",
  "DATA_HARVESTING",
  "UNKNOWN"
] as const;

function splitExplanationSections(aiExplanation: string, fallbackThreatAssessment: string, indicators: string[], risks: string[], actions: string[], confidence: string) {
  const lines = aiExplanation
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const executiveSummary = lines[0] ?? aiExplanation;
  const remaining = lines.slice(1);

  return [
    {
      title: "Executive Summary",
      content: executiveSummary || "No executive summary was provided."
    },
    {
      title: "Threat Assessment",
      content: remaining[0] ?? fallbackThreatAssessment
    },
    {
      title: "Detected Indicators",
      items: indicators.length > 0 ? indicators : ["No explicit indicators were detected from this scan."]
    },
    {
      title: "Potential Risks",
      items: risks
    },
    {
      title: "Recommended Actions",
      items: actions
    },
    {
      title: "Confidence Score",
      content: confidence
    }
  ];
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
  const recommendationList = useMemo(() => {
    if (!scan) return [];
    if (scan.threatReports.length === 0) {
      return ["Treat this QR code cautiously if it came from an unsolicited source."];
    }
    return [
      "Verify the sender and destination independently before acting.",
      "Avoid sharing credentials, OTPs, or payment approvals from QR-driven flows.",
      "Report confirmed malicious QR codes to help the community feed."
    ];
  }, [scan]);
  const severitySummary = useMemo(() => {
    if (!scan) return "";
    if (scan.severity === "CRITICAL" || scan.severity === "HIGH_RISK") {
      return "This QR scan should be treated as high priority because the current signals indicate elevated user harm potential.";
    }
    if (scan.severity === "MEDIUM_RISK") {
      return "This QR scan shows suspicious traits that deserve manual review before users proceed.";
    }
    return "This QR scan does not show strong threat signals, but it should still be verified against the expected source.";
  }, [scan]);
  const indicatorList = useMemo(() => {
    if (!scan) return [];
    if (scan.threatReports.length > 0) {
      return scan.threatReports.map((report) => `${report.category.replace(/_/g, " ")}: ${report.description}`);
    }
    return [`QR type identified as ${scan.qrType}.`, `Risk score recorded at ${scan.riskScore}/100.`];
  }, [scan]);
  const riskList = useMemo(() => {
    if (!scan) return [];
    if (scan.severity === "CRITICAL" || scan.severity === "HIGH_RISK") {
      return ["Potential credential theft or fraudulent payment flow.", "Higher chance of social engineering or malicious redirection."];
    }
    if (scan.severity === "MEDIUM_RISK") {
      return ["Destination or payload may not match user expectations.", "Additional verification is recommended before sharing data or approving a transaction."];
    }
    return ["Residual risk remains if the QR source itself is spoofed or tampered with."];
  }, [scan]);
  const confidenceScore = useMemo(() => {
    if (!scan) return "";
    if (scan.riskScore >= 80) return "High confidence";
    if (scan.riskScore >= 45) return "Moderate confidence";
    return "Preliminary confidence";
  }, [scan]);
  const formattedSections = useMemo(() => {
    if (!scan) return [];
    return splitExplanationSections(
      scan.aiExplanation,
      severitySummary,
      indicatorList,
      riskList,
      recommendationList,
      `${confidenceScore} based on severity, risk score, and detected indicators.`
    );
  }, [confidenceScore, indicatorList, recommendationList, riskList, scan, severitySummary]);

  return (
    <AppShell>
      {scanQuery.isLoading ? (
        <Card>
          <CardContent className="p-6 text-slate-400">Loading scan result...</CardContent>
        </Card>
      ) : scanQuery.isError ? (
        <Card>
          <CardContent className="p-6 text-rose-300">{(scanQuery.error as Error).message}</CardContent>
        </Card>
      ) : scan ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm text-slate-400">Scan Result</div>
              <h1 className="mt-1 text-3xl font-semibold text-white">Threat assessment for this QR code</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <SeverityBadge severity={scan.severity} />
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-6">
              <RiskMeter riskScore={scan.riskScore} severity={scan.severity} />
              <Card>
                <CardHeader>
                  <CardTitle>Threat Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-slate-950/35 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                    <div>
                      <div className="font-medium text-white">Current posture</div>
                      <p className="mt-1 text-sm text-slate-300">{severitySummary}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-slate-950/35 p-4">
                      <div className="text-sm text-slate-400">QR type</div>
                      <div className="mt-2 font-medium text-white">{scan.qrType}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-slate-950/35 p-4">
                      <div className="text-sm text-slate-400">Detected findings</div>
                      <div className="mt-2 font-medium text-white">{scan.threatReports.length}</div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-slate-950/35 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FileWarning className="h-4 w-4 text-cyan-300" />
                      <div className="font-medium text-white">Threat timeline</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-400">Scan created</span>
                        <span className="text-slate-200">{new Date(scan.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-400">Risk evaluation</span>
                        <span className="text-slate-200">{scan.riskScore}/100 with {scan.severity.replace(/_/g, " ").toLowerCase()} severity</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-400">Community review</span>
                        <span className="text-slate-200">{scan.threatReports.length > 0 ? "Signals available" : "No submitted findings yet"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>AI Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <Badge>{scan.qrType}</Badge>
                    <Badge variant="warning">{confidenceScore}</Badge>
                    {scan.threatReports.length > 0 ? <Badge variant="danger">Threat indicators present</Badge> : <Badge variant="success">No threat indicators</Badge>}
                  </div>
                  <div className="rounded-2xl border border-border bg-slate-950/35 p-4 text-sm text-slate-300">
                    <div className="mb-2 flex items-center gap-2 font-medium text-white">
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                      Original payload
                    </div>
                    <div className="break-all leading-6">{scan.originalContent}</div>
                  </div>
                </div>
                {formattedSections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-border bg-slate-950/35 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      {section.title === "Recommended Actions" ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-cyan-300" />
                      )}
                      <h3 className="font-medium text-white">{section.title}</h3>
                    </div>
                    {section.items ? (
                      <div className="space-y-3">
                        {section.items.map((item) => (
                          <div key={item} className="rounded-xl border border-border bg-slate-950/35 p-3 text-sm text-slate-300">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-6 text-slate-300">{section.content}</p>
                    )}
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-border bg-slate-950/25 p-4 text-sm text-slate-400">
                  Community report placeholder: exported reports and shared threat review can be surfaced here without changing the existing AI pipeline.
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <ThreatFindings findings={scan.threatReports} />
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendationList.map((item) => (
                  <div key={item} className="rounded-xl border border-border bg-slate-950/40 p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
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
      ) : null}
    </AppShell>
  );
}
