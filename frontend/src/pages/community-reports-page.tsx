import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BadgeCheck, CreditCard, KeyRound, Link2Off, RadioTower, TrendingUp } from "lucide-react";
import { fetchReports } from "@/api/reports";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { RecentReportsList } from "@/components/reports/recent-reports-list";
import { ReportStats } from "@/components/reports/report-stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommunityReportResponse, ThreatCategory } from "@/types/api";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-800/70 ${className}`} />;
}

function categoryCount(data: CommunityReportResponse, category: ThreatCategory) {
  return data.statistics.find((item) => item.category === category)?.count ?? 0;
}

function ThreatTrendChart({ data }: { data: CommunityReportResponse }) {
  const total = Math.max(1, data.statistics.reduce((sum, item) => sum + item.count, 0));
  const topCategories = [...data.statistics].sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Threat trend</p>
            <CardTitle>Category Velocity</CardTitle>
          </div>
          <Badge>Live community sample</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCategories.length === 0 ? (
          <p className="text-sm text-slate-400">No trend data available yet.</p>
        ) : (
          topCategories.map((item) => {
            const percent = Math.max(8, Math.round((item.count / total) * 100));
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-200">{item.category.replace(/_/g, " ")}</span>
                  <span className="text-slate-500">{item.count} reports</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800/90">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-amber-300 to-rose-500 transition-all duration-700" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function CategoryBreakdown({ data }: { data: CommunityReportResponse }) {
  const cards = [
    { label: "Credential Theft", value: categoryCount(data, "PHISHING"), icon: KeyRound, copy: "Fake logins, KYC pages, and account recovery traps" },
    { label: "Payment Abuse", value: categoryCount(data, "PAYMENT_FRAUD"), icon: CreditCard, copy: "UPI requests, prefilled amounts, and refund scams" },
    { label: "Redirect Risk", value: categoryCount(data, "SUSPICIOUS_REDIRECT"), icon: Link2Off, copy: "Chained destinations and suspicious landing pages" },
    { label: "Social Engineering", value: categoryCount(data, "SOCIAL_ENGINEERING"), icon: RadioTower, copy: "Urgency, impersonation, and trust manipulation" }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Breakdown</p>
            <CardTitle>Threat Categories</CardTitle>
          </div>
          <Badge variant="default">4 key signals</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-border bg-slate-950/40 p-4 transition hover:border-cyan-400/25 hover:bg-slate-950/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-slate-500">{item.label}</p>
                  <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                </div>
                <Icon className="h-5 w-5 text-cyan-300" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function CommonScamsSection() {
  const scams = [
    { title: "Refund QR Fraud", icon: CreditCard, tip: "Never scan a QR code to receive money; QR payments usually authorize sending funds." },
    { title: "Fake KYC Updates", icon: BadgeCheck, tip: "Open bank and wallet apps directly instead of following QR-linked KYC pages." },
    { title: "Phishing Redirects", icon: Link2Off, tip: "Check the final domain before entering passwords, OTPs, or card details." },
    { title: "Urgency Campaigns", icon: AlertTriangle, tip: "Treat limited-time rewards, penalties, and account-lock warnings as suspicious." }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Education</p>
            <CardTitle>Common QR Scams</CardTitle>
          </div>
          <Badge>Prevention tips</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scams.map((scam) => {
          const Icon = scam.icon;
          return (
            <div key={scam.title} className="rounded-xl border border-border bg-slate-950/40 p-4">
              <Icon className="h-5 w-5 text-amber-300" />
              <h3 className="mt-3 text-sm font-semibold text-white">{scam.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{scam.tip}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function CommunityReportsPage() {
  const reportsQuery = useQuery({
    queryKey: ["community-reports"],
    queryFn: fetchReports
  });

  return (
    <MarketingShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Threat intelligence exchange</p>
              <h1 className="text-3xl font-semibold text-white">Community Reports</h1>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Review malicious QR submissions, emerging scam categories, and shared intelligence from the AEGIS QR community.
            </p>
          </div>
          <Badge>
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Community telemetry
          </Badge>
        </div>

        {reportsQuery.isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-36" />)}
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <SkeletonBlock className="h-80" />
              <SkeletonBlock className="h-80" />
            </div>
          </div>
        ) : reportsQuery.isError ? (
          <Card>
            <CardContent className="p-6 text-rose-300">{(reportsQuery.error as Error).message}</CardContent>
          </Card>
        ) : reportsQuery.data ? (
          <div className="space-y-6">
            <ReportStats statistics={reportsQuery.data.statistics} />
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <ThreatTrendChart data={reportsQuery.data} />
              <CategoryBreakdown data={reportsQuery.data} />
            </div>
            <RecentReportsList reports={reportsQuery.data.reports} />
            <CommonScamsSection />
          </div>
        ) : null}
      </div>
    </MarketingShell>
  );
}
