import type { CommunityReportResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportStats({ statistics }: Pick<CommunityReportResponse, "statistics">) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statistics.map((item) => (
        <Card key={item.category}>
          <CardHeader>
            <CardTitle className="text-base">{item.category.replace(/_/g, " ")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-cyan-300">{item.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

