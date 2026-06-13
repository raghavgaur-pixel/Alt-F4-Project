import { Clock3, Gauge, ShieldAlert, ShieldX } from "lucide-react";
import type { CommunityReport } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/scan/severity-badge";

function confidenceForReport(report: CommunityReport) {
  return Math.min(99, Math.max(82, 100 - Math.round(report.scan.riskScore / 5)));
}

export function RecentReportsList({ reports }: { reports: CommunityReport[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Community intelligence feed</p>
            <CardTitle>Recently Reported QR Threats</CardTitle>
          </div>
          <Badge variant="default">{reports.length} reports</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-slate-950/40 p-8 text-center lg:col-span-2">
            <ShieldX className="mx-auto h-10 w-10 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">No community reports yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Report suspicious QR codes from scan results to build shared intelligence for phishing, payment fraud, and malware campaigns.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-slate-950/50 p-4 text-left text-sm text-slate-300">
              Community reports help AEGIS QR connect repeated QR behavior into a stronger threat picture. Review a scan result, choose a category, and submit a short summary to contribute.
            </div>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-border bg-slate-950/40 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-slate-950/60"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="danger">{report.category.replace(/_/g, " ")}</Badge>
                    <SeverityBadge severity={report.scan.severity} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
                <Badge variant={report.scan.riskScore >= 70 ? "danger" : report.scan.riskScore >= 40 ? "warning" : "success"}>
                  Risk {report.scan.riskScore}/100
                </Badge>
              </div>
              <h3 className="text-base font-semibold text-white">{report.scan.qrType} threat report</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{report.description}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
                    <Gauge className="h-4 w-4 text-cyan-300" />
                    Risk and confidence
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
                        style={{ width: `${report.scan.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white">{report.scan.riskScore}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={confidenceForReport(report) >= 92 ? "success" : "default"}>Confidence {confidenceForReport(report)}%</Badge>
                    <Badge variant={report.scan.severity === "CRITICAL" || report.scan.severity === "HIGH_RISK" ? "danger" : "warning"}>
                      {report.scan.severity.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
                    <ShieldAlert className="h-4 w-4 text-amber-300" />
                    Summary
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {report.category.replace(/_/g, " ")} signal on {report.scan.qrType}. {report.scan.aiExplanation.split(".")[0]}.
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
