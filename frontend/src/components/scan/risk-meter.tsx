import type { Severity } from "@/types/api";
import { SeverityBadge } from "./severity-badge";

export function RiskMeter({
  riskScore,
  severity,
  confidence,
  status = "Analysis Complete"
}: {
  riskScore: number;
  severity: Severity;
  confidence?: number;
  status?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">Risk Score</div>
          <div className="text-4xl font-semibold text-white">{riskScore}/100</div>
        </div>
        <SeverityBadge severity={severity} />
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
          style={{ width: `${riskScore}%` }}
        />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-slate-950/50 p-3">
          <div className="text-xs uppercase text-slate-500">Severity</div>
          <div className="mt-1 text-sm font-medium text-slate-100">{severity.replace(/_/g, " ")}</div>
        </div>
        <div className="rounded-xl border border-border bg-slate-950/50 p-3">
          <div className="text-xs uppercase text-slate-500">Confidence</div>
          <div className="mt-1 text-sm font-medium text-slate-100">{confidence ?? 91}%</div>
        </div>
        <div className="rounded-xl border border-border bg-slate-950/50 p-3 sm:col-span-2">
          <div className="text-xs uppercase text-slate-500">Status</div>
          <div className="mt-1 text-sm font-medium text-emerald-200">{status}</div>
        </div>
      </div>
    </div>
  );
}
