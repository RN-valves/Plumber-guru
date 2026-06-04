"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Eye,
  MapPin,
  Send,
  Star,
  Trash2,
  Upload,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getPlumberDetail } from "@/lib/admin-plumbers-mock";

const PlumberMap = dynamic(
  () =>
    import("@/components/admin/plumbers/PlumberMap").then((m) => m.PlumberMap),
  { ssr: false, loading: () => (
    <div className="flex h-[240px] items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ) }
);

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );
}

const JOB_STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  applied: "bg-orange-100 text-orange-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const INVOICE_STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-orange-100 text-orange-800",
  overdue: "bg-red-100 text-red-800",
};

export default function PlumberDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "pg-1000";
  const plumber = useMemo(() => getPlumberDetail(id), [id]);
  const [smsMessage, setSmsMessage] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [verification, setVerification] = useState(plumber.verified);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1 -ml-2" render={
        <Link href="/admin/plumbers" />
      }>
        <ArrowLeft className="size-4" />
        Back to plumbers
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
              <Avatar className="size-24">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {initials(plumber.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">{plumber.name}</h1>
                  {plumber.verified === "verified" ? (
                    <Badge className="bg-green-600">Verified</Badge>
                  ) : (
                    <Badge className="bg-orange-500">Pending</Badge>
                  )}
                </div>
                <StarRating rating={plumber.rating} />
                <p className="text-sm text-muted-foreground">
                  {plumber.reviewCount} reviews · Joined {plumber.joinedDate} ·
                  Last active {plumber.lastActive}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {plumber.city}
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Phone" value={plumber.phone} />
                  <InfoRow label="Email" value={plumber.email} />
                  <InfoRow label="City" value={plumber.city} />
                  <InfoRow
                    label="Languages"
                    value={plumber.languages.join(", ")}
                  />
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Skills</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {plumber.skills.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Registered location</CardTitle>
                  <CardDescription>
                    Approximate service area in {plumber.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PlumberMap
                    lat={plumber.location.lat}
                    lng={plumber.location.lng}
                    name={plumber.name}
                    city={plumber.city}
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                  label="Jobs done"
                  value={String(plumber.stats.jobsDone)}
                />
                <StatCard
                  label="Earnings estimate"
                  value={`₹${plumber.stats.earningsEstimate.toLocaleString("en-IN")}`}
                />
                <StatCard
                  label="Profile views"
                  value={plumber.stats.profileViews.toLocaleString("en-IN")}
                />
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Rating breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {plumber.stats.ratingBreakdown.map((row) => (
                      <div
                        key={row.stars}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-8">{row.stars}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{
                              width: `${(row.count / plumber.reviewCount) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-6 text-muted-foreground">
                          {row.count}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plumber.jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            {job.title}
                          </TableCell>
                          <TableCell>{job.customer}</TableCell>
                          <TableCell>{job.city}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={JOB_STATUS_STYLES[job.status]}
                            >
                              {job.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ₹{job.amount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {job.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <Card>
                <CardContent className="divide-y divide-border p-0">
                  {plumber.invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{inv.number}</p>
                        <p className="text-sm text-muted-foreground">
                          {inv.customer} · {inv.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">
                          ₹{inv.amount.toLocaleString("en-IN")}
                        </p>
                        <Badge
                          variant="secondary"
                          className={INVOICE_STATUS_STYLES[inv.status]}
                        >
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Uploaded documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plumber.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium">{doc.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.fileName} · {doc.uploadedAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{doc.status}</Badge>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="size-3.5" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="size-3.5" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Upload on behalf of plumber
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="size-4" />
                    Choose file
                  </Button>
                  <Input type="file" className="max-w-xs" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ol className="relative space-y-6 border-l border-border pl-6">
                    {plumber.activityLog.map((entry) => (
                      <li key={entry.id} className="relative">
                        <span className="absolute -left-[29px] top-1 flex size-3 rounded-full bg-primary ring-4 ring-background" />
                        <p className="font-medium text-foreground">
                          {entry.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.detail}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {entry.timestamp}
                        </p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Verification status</Label>
                <Select
                  value={verification}
                  onValueChange={(v) => {
                    if (v) setVerification(v as "verified" | "pending");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sms">Send SMS</Label>
                <Textarea
                  id="sms"
                  placeholder="Message to plumber…"
                  rows={3}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                />
                <Button className="w-full gap-2">
                  <Send className="size-4" />
                  Send SMS
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="note">Admin note</Label>
                <Textarea
                  id="note"
                  placeholder="Internal note (saved to DB)…"
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <Button variant="secondary" className="w-full">
                  Save note
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2 text-orange-600">
                  <UserX className="size-4" />
                  Suspend account
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  Reactivate account
                </Button>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="size-4" />
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
