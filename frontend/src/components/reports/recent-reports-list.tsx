import { Clock3, FileSearch, Gauge, ShieldAlert } from "lucide-react";
import type { CommunityReport } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/scan/severity-badge";

export function RecentReportsList({ reports }: { reports: CommunityReport[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Community intelligence feed</p>
            <CardTitle>Recently Reported QR Threats</CardTitle>
          </div>
          <Badge>{reports.length} reports</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-slate-950/40 p-8 text-center lg:col-span-2">
            <FileSearch className="mx-auto h-10 w-10 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">No community reports yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Report suspicious QR codes from scan results to build shared intelligence for phishing, payment fraud, and malware campaigns.
            </p>
          </div>
        ) : (
          reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-border bg-slate-950/40 p-5 transition-all duration-200 hover:scale-[1.01] hover:border-cyan-400/25 hover:bg-slate-950/60 hover:shadow-lg hover:shadow-cyan-500/10">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant="danger">{report.category.replace(/_/g, " ")}</Badge>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock3 className="h-4 w-4 text-slate-500" />
                  {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
              <SeverityBadge severity={report.scan.severity} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <h3 className="text-base font-bold text-white tracking-tight">{report.scan.qrType} Threat Intelligence</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">{report.description}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/50 bg-slate-950/50 p-4 transition-colors hover:border-cyan-400/20">
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Risk Assessment</span>
                  <Gauge className="h-3.5 w-3.5 text-cyan-300" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800 shadow-inner">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] transition-all duration-1000" style={{ width: `${report.scan.riskScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white">{report.scan.riskScore}%</span>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-slate-950/50 p-4 transition-colors hover:border-amber-400/20">
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Intelligence Summary</span>
                  <FileSearch className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <p className="mt-2.5 text-xs font-medium text-slate-300 truncate">
                  {report.category.replace(/_/g, " ")} detected in {report.scan.qrType} payload
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
