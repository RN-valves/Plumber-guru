"use client";

import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
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
import { MOCK_REPORTED_CONTENT } from "@/lib/admin-misc-mock";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  pending: "bg-orange-100 text-orange-800",
  removed: "bg-red-100 text-red-800",
  dismissed: "bg-gray-100 text-gray-600",
};

export default function ReportedContentPage() {
  const [items, setItems] = useState(MOCK_REPORTED_CONTENT);

  function setStatus(id: string, status: "removed" | "dismissed") {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reported Content"
        description="Review flagged forum posts, comments, and profiles"
      >
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle className="size-3.5" />
          {items.filter((i) => i.status === "pending").length} pending
        </Badge>
      </AdminPageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reported by</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>{item.reportedBy}</TableCell>
                  <TableCell className="max-w-[200px] text-sm">
                    {item.target}
                  </TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.createdAt}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(STATUS_STYLE[item.status])}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600"
                          onClick={() => setStatus(item.id, "removed")}
                        >
                          <X className="size-3.5" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => setStatus(item.id, "dismissed")}
                        >
                          <Check className="size-3.5" />
                          Dismiss
                        </Button>
                      </div>
                    )}
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
