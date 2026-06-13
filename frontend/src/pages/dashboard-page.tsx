import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Gauge,
  RadioTower,
  ScanLine,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecentScans, fetchScanHistory, uploadScan } from "@/api/scans";
import { ScanHistoryTable } from "@/components/dashboard/scan-history-table";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { AppShell } from "@/components/layout/app-shell";
import { SeverityBadge } from "@/components/scan/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import type { Scan } from "@/types/api";

function confidenceForScan(scan: Scan) {
  const match = scan.aiExplanation.match(/Confidence:\s*(\d+)%/i);
  return match ? Number(match[1]) : Math.min(99, Math.max(82, 100 - Math.round(scan.riskScore / 5)));
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-800/70 ${className}`} />;
}

function InsightCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "text-cyan-300"
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: typeof ScanLine;
  tone?: string;
}) {
  return (
    <Card className="transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/25">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-950/50 p-3">
            <Icon className={`h-5 w-5 ${tone}`} />
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}

function SecurityTips() {
  const tips = [
    "Verify UPI recipient names before approving payment requests.",
    "Avoid QR codes that force credential entry after a redirect.",
    "Treat urgent rewards, refunds, and KYC updates as high-risk signals."
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5 text-cyan-300" />
          <div>
            <p className="text-sm uppercase text-slate-500">Onboarding</p>
            <CardTitle>Security Tips</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip) => (
          <div key={tip} className="flex gap-3 rounded-xl border border-border bg-slate-950/40 p-3 text-sm text-slate-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            <span>{tip}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FeatureHighlights() {
  const features = [
    { title: "AI Detection", icon: BrainCircuit, copy: "Classifies malicious intent from decoded QR payloads." },
    { title: "QR Risk Analysis", icon: Gauge, copy: "Scores payment, URL, identity, and redirect risk patterns." },
    { title: "Community Intelligence", icon: RadioTower, copy: "Uses reported threats to strengthen situational awareness." },
    { title: "Payment Verification", icon: CreditCard, copy: "Highlights UPI recipient and amount anomalies before payment." }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Platform signals</p>
            <CardTitle>Compact Features</CardTitle>
          </div>
          <Badge>4 core capabilities</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="rounded-xl border border-border bg-slate-950/40 p-4 transition hover:border-cyan-400/25 hover:bg-slate-950/60">
              <Icon className="h-5 w-5 text-cyan-300" />
              <h3 className="mt-3 text-sm font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.copy}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function FaqSection() {
  const faqs = [
    ["Risk Score", "Risk Score estimates how dangerous a decoded QR payload is on a 0-100 scale using severity, indicators, payload type, and behavior patterns."],
    ["Confidence Score", "Confidence Score reflects how strongly the engine can support its classification from available metadata and threat signals."],
    ["QR Analysis", "AEGIS QR decodes the image, identifies content type, inspects metadata, evaluates rules, and generates an AI explanation."],
    ["Privacy", "Scan records are kept for authenticated history and investigation context; avoid uploading personal QR codes you do not want analyzed."],
    ["Phishing Detection", "The engine looks for suspicious domains, redirects, credential prompts, urgency cues, and social-engineering language."],
    ["Community Reports", "Community reports help surface repeated malicious categories and provide additional threat intelligence for other users."]
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Knowledge base</p>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
          <Badge variant="default">Accordion</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group rounded-xl border border-border bg-slate-950/40 p-4 transition hover:border-cyan-400/25">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
              {question}
              <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
          </details>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const historyQuery = useQuery({
    queryKey: ["scan-history", user?.id],
    queryFn: () => fetchScanHistory(token!),
    enabled: Boolean(token)
  });
  const recentQuery = useQuery({
    queryKey: ["recent-scans", user?.id],
    queryFn: () => fetchRecentScans(token!),
    enabled: Boolean(token)
  });
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadScan(file, token!),
    onSuccess: (scan) => {
      navigate(`/scan/${scan.id}`);
    }
  });
  const analysisStages = [
    { label: "Decoding QR", detail: "Extracting the payload and classifying the QR type." },
    { label: "Browser Analysis", detail: "Launching an isolated browser session and following redirects." },
    { label: "Screenshot Capture", detail: "Capturing the full page, viewport, and final destination." },
    { label: "Scoring Report", detail: "Combining browser signals, QR heuristics, and AI context." }
  ];
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!uploadMutation.isPending) {
      setStageIndex(0);
      return;
    }

    setStageIndex(0);
    const timer = window.setInterval(() => {
      setStageIndex((current) => Math.min(current + 1, analysisStages.length - 1));
    }, 1400);

    return () => window.clearInterval(timer);
  }, [analysisStages.length, uploadMutation.isPending]);

  const scans = historyQuery.data ?? [];
  const totalScans = scans.length;
  const safeScans = scans.filter((scan) => scan.severity === "SAFE" || scan.severity === "LOW_RISK").length;
  const suspiciousScans = scans.filter((scan) => scan.severity === "MEDIUM_RISK" || scan.severity === "HIGH_RISK" || scan.severity === "CRITICAL").length;
  const averageRisk = totalScans > 0 ? Math.round(scans.reduce((sum, scan) => sum + scan.riskScore, 0) / totalScans) : 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Security operations dashboard</p>
          <h1 className="text-3xl font-semibold text-white">AEGIS QR workspace</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-300">
            Review scan intelligence, upload new QR images, and monitor risk trends with a clean enterprise-style workflow.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {historyQuery.isLoading ? (
            Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-36" />)
          ) : (
            <>
              <InsightCard label="Total Scans" value={totalScans} helper="QR payloads analyzed in your workspace" icon={ScanLine} />
              <InsightCard label="Safe QRs" value={safeScans} helper="Scans with low or no material risk" icon={ShieldCheck} tone="text-emerald-300" />
              <InsightCard label="Suspicious QRs" value={suspiciousScans} helper="Scans requiring caution or review" icon={AlertTriangle} tone="text-amber-300" />
              <InsightCard label="Average Risk Score" value={`${averageRisk}/100`} helper="Mean score across your scan history" icon={TrendingUp} tone="text-rose-300" />
            </>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <UploadZone
              onFileSelected={(file) => uploadMutation.mutate(file)}
              isLoading={uploadMutation.isPending}
              statusLabel={analysisStages[stageIndex]?.label}
              statusDetail={analysisStages[stageIndex]?.detail}
              errorMessage={uploadMutation.isError ? (uploadMutation.error as Error).message : undefined}
            />
            <SecurityTips />
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase text-slate-500">Live workspace</p>
                  <CardTitle>Recent scans</CardTitle>
                </div>
                <Badge variant="default">Latest 4</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentQuery.isLoading ? (
                Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-24" />)
              ) : recentQuery.isError ? (
                <p className="text-rose-300">{(recentQuery.error as Error).message}</p>
              ) : !recentQuery.data || recentQuery.data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-slate-950/40 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                      <Sparkles className="h-8 w-8 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">No recent scans yet</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">Upload your first QR image to populate this intelligence feed.</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      "Upload a QR image from the scanner",
                      "Inspect risk score and confidence",
                      "Open the result for findings and recommendations"
                    ].map((step, index) => (
                      <div key={step} className="rounded-xl border border-border bg-slate-950/50 p-3 text-sm text-slate-300">
                        <div className="mb-2 text-xs uppercase text-slate-500">Step {index + 1}</div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                recentQuery.data.slice(0, 4).map((scan) => (
                  <div key={scan.id} className="rounded-xl border border-border bg-slate-950/40 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-slate-950/60">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-medium text-white">{scan.qrType}</div>
                          <SeverityBadge severity={scan.severity} />
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                          <Clock3 className="h-4 w-4 text-slate-500" />
                          {new Date(scan.createdAt).toLocaleString()}
                        </div>
                        <div className="mt-2 max-w-md truncate text-xs text-slate-500">{scan.originalContent}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={scan.riskScore >= 70 ? "danger" : scan.riskScore >= 40 ? "warning" : "success"}>{scan.riskScore}/100</Badge>
                        <div className="mt-2 text-xs text-slate-500">Confidence {confidenceForScan(scan)}%</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <FeatureHighlights />
        <FaqSection />
      </div>

      <div className="mt-6">
        {historyQuery.isLoading ? (
          <Card>
            <CardContent className="p-6 text-slate-400">Loading scan history...</CardContent>
          </Card>
        ) : historyQuery.isError ? (
          <Card>
            <CardContent className="p-6 text-rose-300">{(historyQuery.error as Error).message}</CardContent>
          </Card>
        ) : (
          <ScanHistoryTable scans={historyQuery.data ?? []} title="Analysis history" />
        )}
      </div>
    </AppShell>
  );
}
