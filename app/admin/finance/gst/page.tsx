"use client";

import { Calculator, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_GST_REPORTS } from "@/lib/admin-misc-mock";

export default function GstReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="GST Reports"
        description="Monthly GST summary from platform invoices"
      >
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Download GSTR-1
        </Button>
      </AdminPageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            Quarterly summary
          </CardTitle>
          <CardDescription>CGST + SGST @ 9% each on taxable amount</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Taxable amount</TableHead>
                <TableHead>CGST</TableHead>
                <TableHead>SGST</TableHead>
                <TableHead>Total with GST</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GST_REPORTS.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell>{row.taxable}</TableCell>
                  <TableCell>{row.cgst}</TableCell>
                  <TableCell>{row.sgst}</TableCell>
                  <TableCell className="font-semibold">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
