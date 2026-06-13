import type { ThreatReport } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ThreatFindings({ findings }: { findings: ThreatReport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Threats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {findings.length === 0 ? (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            No explicit threat findings were recorded for this scan.
          </div>
        ) : (
          findings.map((finding) => (
            <div key={finding.id} className="rounded-xl border border-border bg-slate-950/40 p-4">
              <div className="mb-2">
                <Badge variant="warning">{finding.category.replace(/_/g, " ")}</Badge>
              </div>
              <p className="text-sm text-slate-300">{finding.description}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

