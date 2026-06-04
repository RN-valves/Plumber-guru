"use client";

import { useMemo, useState } from "react";
import { Calendar, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CITY_OPTIONS,
  MOCK_NOTIFICATION_LOGS,
  MOCK_SMS_LOGS,
  SKILL_OPTIONS,
  type SmsLog,
} from "@/lib/admin-settings-mock";

const SMS_CHAR_LIMIT = 160;

const TARGET_OPTIONS = [
  { value: "all", label: "All Plumbers" },
  { value: "city", label: "By City" },
  { value: "skill", label: "By Skill" },
  { value: "custom", label: "Custom list upload" },
];

const SMS_STATUS_STYLES: Record<SmsLog["status"], string> = {
  delivered: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  pending: "bg-orange-100 text-orange-800",
};

export default function NotificationLogsPage() {
  const [target, setTarget] = useState("all");
  const [city, setCity] = useState("Mumbai");
  const [skill, setSkill] = useState("Pipe fitting");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [scheduleAt, setScheduleAt] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const charCount = message.length;
  const overLimit = charCount > SMS_CHAR_LIMIT;

  const filteredSms = useMemo(() => {
    return MOCK_SMS_LOGS.filter((log) => {
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      return true;
    });
  }, [statusFilter]);

  const previewTarget = useMemo(() => {
    if (target === "city") return `${city} plumbers`;
    if (target === "skill") return `${skill} skill group`;
    if (target === "custom") return "Custom CSV list";
    return "All plumbers (12,450)";
  }, [target, city, skill]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          SMS & Notification Logs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send bulk SMS and review delivery history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Send Bulk SMS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Target audience</Label>
              <Select
                value={target}
                onValueChange={(v) => v && setTarget(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={language}
                onValueChange={(v) => v && setLanguage(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {target === "city" && (
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={city} onValueChange={(v) => v && setCity(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {target === "skill" && (
              <div className="space-y-2">
                <Label>Skill</Label>
                <Select value={skill} onValueChange={(v) => v && setSkill(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {target === "custom" && (
              <div className="space-y-2 md:col-span-2">
                <Label>Upload phone list (CSV)</Label>
                <Input type="file" accept=".csv" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-msg">Message</Label>
              <span
                className={cn(
                  "text-xs",
                  overLimit ? "font-medium text-red-600" : "text-muted-foreground"
                )}
              >
                {charCount}/{SMS_CHAR_LIMIT}
              </span>
            </div>
            <Textarea
              id="sms-msg"
              rows={3}
              placeholder="Type your SMS message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule (optional)</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setPreviewOpen(true)}
              disabled={!message.trim()}
            >
              <Eye className="size-4" />
              Preview SMS
            </Button>
            <Button className="gap-2" disabled={!message.trim() || overLimit}>
              <Send className="size-4" />
              Send Now
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              disabled={!message.trim() || overLimit || !scheduleAt}
            >
              <Calendar className="size-4" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sms">
        <TabsList>
          <TabsTrigger value="sms">SMS logs</TabsTrigger>
          <TabsTrigger value="notifications">Notification logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => v && setStatusFilter(v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Message Preview</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSms.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground">
                        {log.sentAt}
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.messagePreview}
                      </TableCell>
                      <TableCell>
                        {log.countSent.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={SMS_STATUS_STYLES[log.status]}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.cost > 0
                          ? `₹${log.cost.toLocaleString("en-IN")}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Read count</TableHead>
                    <TableHead>Read rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_NOTIFICATION_LOGS.map((log) => {
                    const rate = Math.round(
                      (log.readCount / log.recipientCount) * 100
                    );
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {log.type === "push" ? "Push" : "In-app"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.sentAt}
                        </TableCell>
                        <TableCell>
                          {log.recipientCount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {log.readCount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>{rate}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SMS Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">To:</span> {previewTarget}
            </p>
            <p>
              <span className="text-muted-foreground">Language:</span> {language}
            </p>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              {message || "(empty message)"}
            </div>
            <p className="text-xs text-muted-foreground">
              {charCount} characters · Est. cost ₹
              {Math.ceil(charCount / SMS_CHAR_LIMIT) * 0.5} per recipient (mock)
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
