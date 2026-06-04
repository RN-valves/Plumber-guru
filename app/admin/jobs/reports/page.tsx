"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
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
import {
  JOBS_BY_CITY,
  JOBS_PER_DAY,
  SKILL_DEMAND,
} from "@/lib/admin-jobs-mock";

export default function JobReportsPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  function exportPdf() {
    if (typeof window === "undefined") return;
    const prevTitle = document.title;
    document.title = "Plumber Guru — Job Reports";
    window.print();
    document.title = prevTitle;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analytics and demand insights for job postings
          </p>
        </div>
        <Button className="gap-2" onClick={exportPdf}>
          <Download className="size-4" />
          Export all charts as PDF
        </Button>
      </div>

      <div ref={reportRef} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Jobs posted per day</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={JOBS_PER_DAY}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Jobs posted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs by city</CardTitle>
            <CardDescription>Top 10 cities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={JOBS_BY_CITY}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="city"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="jobs"
                    name="Jobs"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most in-demand skills</CardTitle>
            <CardDescription>
              Based on active and filled job postings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill name</TableHead>
                  <TableHead>Job count</TableHead>
                  <TableHead>% of total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SKILL_DEMAND.map((row) => (
                  <TableRow key={row.skill}>
                    <TableCell className="font-medium">{row.skill}</TableCell>
                    <TableCell>{row.jobCount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {row.percent}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
