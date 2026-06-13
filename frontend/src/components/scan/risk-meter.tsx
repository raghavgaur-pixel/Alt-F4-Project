import type { Severity } from "@/types/api";
import { SeverityBadge } from "./severity-badge";

export function RiskMeter({ riskScore, severity }: { riskScore: number; severity: Severity }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">Risk Score</div>
          <div className="text-4xl font-semibold text-white">{riskScore}</div>
        </div>
        <SeverityBadge severity={severity} />
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
          style={{ width: `${riskScore}%` }}
        />
      </div>
    </div>
  );
}

