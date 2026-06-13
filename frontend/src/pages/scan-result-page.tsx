import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchScanById } from "@/api/scans";
import { submitReport } from "@/api/reports";
import { AppShell } from "@/components/layout/app-shell";
import { RiskMeter } from "@/components/scan/risk-meter";
import { ThreatFindings } from "@/components/scan/threat-findings";
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
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <RiskMeter riskScore={scan.riskScore} severity={scan.severity} />
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400">QR Type</div>
                  <div className="text-lg text-white">{scan.qrType}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">QR Content</div>
                  <div className="break-all text-sm text-slate-200">{scan.originalContent}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">AI Explanation</div>
                  <p className="text-sm text-slate-300">{scan.aiExplanation}</p>
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
