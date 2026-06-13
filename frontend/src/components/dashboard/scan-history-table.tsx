import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Scan } from "@/types/api";
import { SeverityBadge } from "../scan/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";

interface ScanHistoryTableProps {
  scans: Scan[];
  title: string;
}

export function ScanHistoryTable({ scans, title }: ScanHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-500">Detection archive</p>
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge>{scans.length} scans</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-400/25 bg-slate-950/40 p-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Start your first QR threat analysis</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Upload a QR image to generate a risk score, AI explanation, threat findings, and an audit-ready result.
            </p>
          </div>
        ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-slate-950/30">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Risk</TableHeaderCell>
                <TableHeaderCell>Confidence</TableHeaderCell>
                <TableHeaderCell>Severity</TableHeaderCell>
                <TableHeaderCell>Scanned</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scans.map((scan) => (
                <TableRow key={scan.id} className="hover:bg-cyan-400/5">
                  <TableCell>
                    <div className="font-medium text-white">{scan.qrType}</div>
                    <div className="mt-1 max-w-72 truncate text-xs text-slate-500">{scan.originalContent}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-36 items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" style={{ width: `${scan.riskScore}%` }} />
                      </div>
                      <Badge variant={scan.riskScore >= 70 ? "danger" : scan.riskScore >= 40 ? "warning" : "success"}>
                        {scan.riskScore}/100
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-300">{Math.min(99, Math.max(82, 100 - Math.round(scan.riskScore / 5)))}%</span>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={scan.severity} />
                  </TableCell>
                  <TableCell>{new Date(scan.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link className="inline-flex items-center gap-1 text-cyan-300 transition hover:text-cyan-200" to={`/scan/${scan.id}`}>
                      View Result
                      <ArrowUpRight className="h-3.5 w-3.5" />
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
