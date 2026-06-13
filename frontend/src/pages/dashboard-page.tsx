import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchRecentScans, fetchScanHistory, uploadScan } from "@/api/scans";
import { ScanHistoryTable } from "@/components/dashboard/scan-history-table";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
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

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <UploadZone onFileSelected={(file) => uploadMutation.mutate(file)} isLoading={uploadMutation.isPending} />
        <Card>
          <CardHeader>
            <CardTitle>Recent scans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQuery.isLoading ? (
              <p className="text-slate-400">Loading recent scans...</p>
            ) : recentQuery.isError ? (
              <p className="text-rose-300">{(recentQuery.error as Error).message}</p>
            ) : (
              recentQuery.data?.slice(0, 4).map((scan) => (
                <div key={scan.id} className="rounded-xl border border-border bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{scan.qrType}</div>
                      <div className="text-sm text-slate-400">{new Date(scan.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-cyan-300">{scan.riskScore}/100</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        {historyQuery.isLoading ? (
          <Card>
            <CardContent className="p-6 text-slate-400">Loading scan history...</CardContent>
          </Card>
        ) : historyQuery.isError ? (
          <Card>
            <CardContent className="p-6 text-rose-300">{(historyQuery.error as Error).message}</CardContent>
          </Card>
        ) : (
          <ScanHistoryTable scans={historyQuery.data ?? []} title="Analysis history" />
        )}
      </div>
    </AppShell>
  );
}

