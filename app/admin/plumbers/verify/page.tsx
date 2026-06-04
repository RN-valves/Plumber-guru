"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  VERIFICATION_QUEUE,
  VERIFIED_HISTORY,
} from "@/lib/admin-plumbers-mock";

const VERIFY_STATS = {
  pending: 12,
  approvedToday: 8,
  rejectedToday: 2,
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function VerifyPlumbersPage() {
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>(
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Verify Plumbers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review documents and approve plumber registrations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatPill
          label="Pending"
          value={VERIFY_STATS.pending}
          className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400"
        />
        <StatPill
          label="Approved today"
          value={VERIFY_STATS.approvedToday}
          className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
        />
        <StatPill
          label="Rejected today"
          value={VERIFY_STATS.rejectedToday}
          className="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
        />
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Verification queue</TabsTrigger>
          <TabsTrigger value="history">Verified history</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {VERIFICATION_QUEUE.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center bg-muted/40 px-4 py-6">
                    <Avatar className="size-24">
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {initials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-3 text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.city}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {item.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Documents
                      </p>
                      <ul className="space-y-2">
                        <DocumentRow
                          label={item.documents.aadhaar.label}
                          uploaded={item.documents.aadhaar.uploaded}
                        />
                        <DocumentRow
                          label={item.documents.skillCertificate.label}
                          uploaded={item.documents.skillCertificate.uploaded}
                        />
                        <DocumentRow
                          label={item.documents.photoId.label}
                          uploaded={item.documents.photoId.uploaded}
                        />
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {item.submittedAt}
                    </p>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="size-4" />
                      Verify & Approve
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <FileText className="size-4" />
                      Request More Documents
                    </Button>
                    <div className="space-y-2">
                      <Label htmlFor={`reject-${item.id}`} className="text-xs">
                        Rejection reason
                      </Label>
                      <Textarea
                        id={`reject-${item.id}`}
                        placeholder="Reason for rejection…"
                        rows={2}
                        value={rejectReasons[item.id] ?? ""}
                        onChange={(e) =>
                          setRejectReasons((r) => ({
                            ...r,
                            [item.id]: e.target.value,
                          }))
                        }
                      />
                      <Button variant="outline" className="w-full text-red-600">
                        <XCircle className="size-4" />
                        Reject
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full"
                      render={<Link href={`/admin/plumbers/${item.id}`} />}
                    >
                      View full profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently verified</CardTitle>
              <CardDescription>Last 50 verified plumbers</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Verified at</TableHead>
                    <TableHead>Verified by</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {VERIFIED_HISTORY.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.verifiedAt}
                      </TableCell>
                      <TableCell>{row.verifiedBy}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" render={
                          <Link href={`/admin/plumbers/${row.id}`} />
                        }>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatPill({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <Card className={cn("border py-4", className)}>
      <CardContent className="flex items-center justify-between px-4 py-0">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {label.includes("Pending") && <Clock className="size-8 opacity-50" />}
        {label.includes("Approved") && (
          <CheckCircle2 className="size-8 opacity-50" />
        )}
        {label.includes("Rejected") && (
          <XCircle className="size-8 opacity-50" />
        )}
      </CardContent>
    </Card>
  );
}

function DocumentRow({
  label,
  uploaded,
}: {
  label: string;
  uploaded: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
      <span className="flex items-center gap-2">
        <FileText className="size-4 text-muted-foreground" />
        {label}
      </span>
      {uploaded ? (
        <Button variant="outline" size="xs" className="gap-1">
          <Eye className="size-3" />
          View
        </Button>
      ) : (
        <Badge variant="outline" className="text-orange-600">
          Missing
        </Badge>
      )}
    </li>
  );
}
