import { ExternalLink, Image as ImageIcon, Link2, ShieldAlert } from "lucide-react";
import { apiBaseUrl } from "@/lib/constants";
import type { BrowserInspectionResult } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "./severity-badge";

function resolveAssetUrl(publicUrl: string) {
  if (/^https?:\/\//i.test(publicUrl)) return publicUrl;
  const baseUrl = apiBaseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${baseUrl}${publicUrl}`;
}

function SectionList({
  title,
  items,
  emptyLabel
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-slate-950/40 p-4">
      <div className="text-xs uppercase text-slate-500">{title}</div>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {items.map((item) => (
            <li key={item} className="rounded-lg border border-border bg-slate-950/50 p-3 leading-6">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BrowserInspectionPanel({ inspection }: { inspection: BrowserInspectionResult }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Automated URL inspection</p>
            <CardTitle>Browser Analysis</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{inspection.confidence}% confidence</Badge>
            <SeverityBadge severity={inspection.riskLevel} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase text-slate-500">Final Destination</div>
                <a
                  href={inspection.finalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 break-all text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                >
                  {inspection.finalUrl}
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </div>
              <Badge variant={inspection.redirects.length > 0 ? "warning" : "success"}>
                {inspection.redirects.length} redirect{inspection.redirects.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                <div className="text-xs uppercase text-slate-500">Risk Level</div>
                <div className="mt-1 text-sm font-semibold text-white">{inspection.riskLevel.replace(/_/g, " ")}</div>
              </div>
              <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                <div className="text-xs uppercase text-slate-500">Browser Errors</div>
                <div className="mt-1 text-sm font-semibold text-white">{inspection.browserErrors.length}</div>
              </div>
              <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                <div className="text-xs uppercase text-slate-500">Analysis Notes</div>
                <div className="mt-1 text-sm font-semibold text-white">{inspection.analysisNotes.length}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950/50 p-5">
            <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
              <ShieldAlert className="h-4 w-4 text-amber-300" />
              Screenshot Findings
            </div>
            {inspection.screenshotFindings.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No screenshot-specific indicators were flagged.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {inspection.screenshotFindings.map((item) => (
                  <li key={item} className="rounded-xl border border-border bg-slate-950/50 p-3 leading-6">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionList
            title="Inspection Findings"
            items={inspection.findings.map((finding) => `${finding.category.replace(/_/g, " ")}: ${finding.description}`)}
            emptyLabel="No explicit browser-rendered findings were recorded."
          />
          <SectionList
            title="Redirect Chain"
            items={inspection.redirects.map((hop, index) => `Hop ${index + 1}: ${hop.url}${hop.status ? ` (status ${hop.status})` : ""}`)}
            emptyLabel="No redirects were observed during navigation."
          />
          <SectionList
            title="Recommendations"
            items={inspection.recommendations}
            emptyLabel="No additional recommendations were generated."
          />
          <SectionList
            title="Analysis Notes"
            items={[...inspection.analysisNotes, ...inspection.browserErrors]}
            emptyLabel="Browser analysis completed without additional notes."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase text-slate-500">
            <ImageIcon className="h-4 w-4 text-cyan-300" />
            Screenshot Gallery
          </div>
          {inspection.screenshots.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-slate-950/40 p-6 text-sm text-slate-400">
              No screenshots were captured for this inspection.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {inspection.screenshots.map((screenshot) => (
                <a
                  key={screenshot.publicUrl}
                  href={resolveAssetUrl(screenshot.publicUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-border bg-slate-950/40 p-3 transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-slate-950/60"
                >
                  <div className="overflow-hidden rounded-xl border border-border bg-slate-950/50">
                    <img
                      src={resolveAssetUrl(screenshot.publicUrl)}
                      alt={screenshot.type.replace(/_/g, " ").toLowerCase()}
                      className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs uppercase text-slate-500">{screenshot.type.replace(/_/g, " ")}</div>
                      <div className="mt-1 text-sm font-medium text-white">{screenshot.width}x{screenshot.height}</div>
                    </div>
                    <Link2 className="h-4 w-4 text-cyan-300" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
