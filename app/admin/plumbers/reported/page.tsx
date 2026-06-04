"use client";

import Link from "next/link";
import { useState } from "react";
import { Flag, Shield } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_REPORTED_PLUMBERS } from "@/lib/admin-misc-mock";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  open: "bg-red-100 text-red-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  suspended: "bg-gray-100 text-gray-600",
};

export default function ReportedPlumbersPage() {
  const [rows, setRows] = useState(MOCK_REPORTED_PLUMBERS);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reported Plumbers"
        description="Review customer complaints and take action"
      >
        <Badge variant="secondary" className="gap-1">
          <Flag className="size-3.5" />
          {rows.filter((r) => r.status === "open").length} open
        </Badge>
      </AdminPageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plumber</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Last report</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.phone}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{row.reports}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] text-sm">
                    {row.reason}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.lastReported}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(STATUS_STYLE[row.status])}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, status: "reviewed" as const }
                                : r
                            )
                          )
                        }
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        render={<Link href="/admin/plumbers/verify" />}
                      >
                        <Shield className="size-3.5" />
                        Verify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
