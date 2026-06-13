import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock3, ScanLine, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecentScans, fetchScanHistory, uploadScan } from "@/api/scans";
import { ScanHistoryTable } from "@/components/dashboard/scan-history-table";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { AppShell } from "@/components/layout/app-shell";
import { SeverityBadge } from "@/components/scan/severity-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [search, setSearch] = useState("");
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
  const scans = historyQuery.data ?? [];
  const filteredScans = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return scans;
    return scans.filter((scan) => {
      return (
        scan.qrType.toLowerCase().includes(query) ||
        scan.severity.toLowerCase().includes(query) ||
        scan.originalContent.toLowerCase().includes(query)
      );
    });
  }, [scans, search]);
  const overviewCards = useMemo(() => {
    const highRiskCount = scans.filter((scan) => scan.severity === "HIGH_RISK" || scan.severity === "CRITICAL").length;
    const avgRisk = scans.length > 0 ? Math.round(scans.reduce((sum, scan) => sum + scan.riskScore, 0) / scans.length) : 0;
    const recentThreats = recentQuery.data?.filter((scan) => scan.threatReports.length > 0).length ?? 0;

    return [
      { label: "Total scans", value: scans.length, detail: "Recorded in your workspace", icon: ScanLine, accent: "text-cyan-300" },
      { label: "High-risk findings", value: highRiskCount, detail: "Escalate for review first", icon: AlertTriangle, accent: "text-rose-300" },
      { label: "Average risk score", value: `${avgRisk}/100`, detail: "Across your scan history", icon: ShieldCheck, accent: "text-emerald-300" },
      { label: "Recent flagged scans", value: recentThreats, detail: "Threat reports in the latest activity", icon: Clock3, accent: "text-amber-300" }
    ];
  }, [recentQuery.data, scans]);

  return (
    <AppShell>
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold text-white">Security Dashboard</h1>
        <p className="max-w-3xl text-slate-300">
          Review scan activity, spot elevated QR risks faster, and keep the upload flow ready for the next investigation.
        </p>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-start justify-between gap-4 p-6">
              <div>
                <div className="text-sm text-slate-400">{card.label}</div>
                <div className={`mt-3 text-3xl font-semibold ${card.accent}`}>{card.value}</div>
                <div className="mt-2 text-sm text-slate-400">{card.detail}</div>
              </div>
              <card.icon className={`mt-1 h-5 w-5 ${card.accent}`} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <UploadZone onFileSelected={(file) => uploadMutation.mutate(file)} isLoading={uploadMutation.isPending} />
        <Card>
          <CardHeader>
            <CardTitle>Recent scans</CardTitle>
            <p className="text-sm text-slate-400">Quick access to the latest QR analyses and flagged activity.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQuery.isLoading ? (
              <div className="rounded-2xl border border-dashed border-border bg-slate-950/30 p-6 text-sm text-slate-400">
                Loading recent scans...
              </div>
            ) : recentQuery.isError ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6 text-sm text-rose-300">
                {(recentQuery.error as Error).message}
              </div>
            ) : recentQuery.data && recentQuery.data.length > 0 ? (
              recentQuery.data?.slice(0, 4).map((scan) => (
                <div key={scan.id} className="rounded-2xl border border-border bg-slate-950/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-white">{scan.qrType}</div>
                      <div className="mt-1 text-sm text-slate-400">{new Date(scan.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <SeverityBadge severity={scan.severity} />
                      <div className="text-cyan-300">{scan.riskScore}/100</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-400">
                    {scan.threatReports.length > 0
                      ? `${scan.threatReports.length} threat indicator${scan.threatReports.length > 1 ? "s" : ""} detected`
                      : "No explicit threat findings recorded"}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-slate-950/30 p-6 text-center">
                <div className="text-base font-medium text-white">No recent scans yet</div>
                <p className="mt-2 text-sm text-slate-400">Upload a QR image to populate the recent activity feed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Analysis history</h2>
            <p className="text-sm text-slate-400">Search by QR type, severity, or payload content.</p>
          </div>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search scan history"
            className="md:max-w-sm"
          />
        </div>
        {historyQuery.isLoading ? (
          <Card>
            <CardContent className="p-6 text-slate-400">Loading scan history...</CardContent>
          </Card>
        ) : historyQuery.isError ? (
          <Card>
            <CardContent className="p-6 text-rose-300">{(historyQuery.error as Error).message}</CardContent>
          </Card>
        ) : (
          <ScanHistoryTable
            scans={filteredScans}
            title="Analysis history"
            description={search ? `Showing ${filteredScans.length} matching scan${filteredScans.length === 1 ? "" : "s"}.` : "Every uploaded scan with its current risk assessment."}
          />
        )}
      </div>
    </AppShell>
  );
}
