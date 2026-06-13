import { Link } from "react-router-dom";
import type { Scan } from "@/types/api";
import { SeverityBadge } from "../scan/severity-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";

interface ScanHistoryTableProps {
  scans: Scan[];
  title: string;
  description?: string;
}

export function ScanHistoryTable({ scans, title, description }: ScanHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm text-slate-400">{description}</p> : null}
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-slate-950/30 p-8 text-center">
            <div className="text-base font-medium text-white">No scans found</div>
            <p className="mt-2 text-sm text-slate-400">Upload a QR image to start building your analysis history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Risk</TableHeaderCell>
                  <TableHeaderCell>Severity</TableHeaderCell>
                  <TableHeaderCell>Scanned</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.id} className="hover:bg-slate-950/30">
                    <TableCell>
                      <div className="min-w-[8rem] font-medium text-white">{scan.qrType}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-cyan-300">{scan.riskScore}/100</div>
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={scan.severity} />
                    </TableCell>
                    <TableCell className="min-w-[12rem] text-slate-300">{new Date(scan.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Link className="whitespace-nowrap text-cyan-300 transition hover:text-cyan-200" to={`/scan/${scan.id}`}>
                        View Result
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
