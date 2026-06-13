import type { CommunityReport } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentReportsList({ reports }: { reports: CommunityReport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Reported QR Threats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-border bg-slate-950/40 p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Badge variant="danger">{report.category.replace(/_/g, " ")}</Badge>
              <span className="text-sm text-slate-400">{new Date(report.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-300">{report.description}</p>
            <div className="mt-3 text-sm text-slate-400">
              QR type: {report.scan.qrType} | Risk score: {report.scan.riskScore}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

