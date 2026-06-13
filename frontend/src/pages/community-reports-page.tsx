import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "@/api/reports";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { RecentReportsList } from "@/components/reports/recent-reports-list";
import { ReportStats } from "@/components/reports/report-stats";
import { Card, CardContent } from "@/components/ui/card";

export function CommunityReportsPage() {
  const reportsQuery = useQuery({
    queryKey: ["community-reports"],
    queryFn: fetchReports
  });

  return (
    <MarketingShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Community Reports</h1>
          <p className="mt-2 text-slate-300">
            Review recently reported malicious QR codes and category-level threat counts.
          </p>
        </div>
        {reportsQuery.isLoading ? (
          <Card>
            <CardContent className="p-6 text-slate-400">Loading community intelligence...</CardContent>
          </Card>
        ) : reportsQuery.isError ? (
          <Card>
            <CardContent className="p-6 text-rose-300">{(reportsQuery.error as Error).message}</CardContent>
          </Card>
        ) : reportsQuery.data ? (
          <>
            <ReportStats statistics={reportsQuery.data.statistics} />
            <RecentReportsList reports={reportsQuery.data.reports} />
          </>
        ) : null}
      </div>
    </MarketingShell>
  );
}
