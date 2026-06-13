import type { CommunityReportResponse } from "@/types/api";
import { AlertTriangle, Bug, CreditCard, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportStats({ statistics }: Pick<CommunityReportResponse, "statistics">) {
  const totalReports = statistics.reduce((sum, item) => sum + item.count, 0);
  const statCards = [
    { label: "Total Reports", value: totalReports, icon: FileWarning, helper: "Community-submitted QR threats" },
    { label: "Payment Fraud", value: statistics.find((item) => item.category === "PAYMENT_FRAUD")?.count ?? 0, icon: CreditCard, helper: "Payment abuse and transfer scams" },
    { label: "Phishing", value: statistics.find((item) => item.category === "PHISHING")?.count ?? 0, icon: AlertTriangle, helper: "Credential theft and spoofing attempts" },
    { label: "Malware", value: statistics.find((item) => item.category === "MALWARE")?.count ?? 0, icon: Bug, helper: "Malicious downloads or payload delivery" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item) => {
        const Icon = item.icon;
        return (
        <Card key={item.label} className="transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/25">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">{item.label}</CardTitle>
              <div className="rounded-xl border border-border bg-slate-950/50 p-2">
                <Icon className="h-5 w-5 text-cyan-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-cyan-300">{item.value}</div>
            <p className="mt-2 text-sm text-slate-400">{item.helper}</p>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}
