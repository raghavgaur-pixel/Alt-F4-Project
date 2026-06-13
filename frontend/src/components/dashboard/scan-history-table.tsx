import { Link } from "react-router-dom";
import type { Scan } from "@/types/api";
import { SeverityBadge } from "../scan/severity-badge";
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
                <TableRow key={scan.id}>
                  <TableCell>{scan.qrType}</TableCell>
                  <TableCell>{scan.riskScore}/100</TableCell>
                  <TableCell>
                    <SeverityBadge severity={scan.severity} />
                  </TableCell>
                  <TableCell>{new Date(scan.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link className="text-cyan-300 hover:text-cyan-200" to={`/scan/${scan.id}`}>
                      View Result
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

