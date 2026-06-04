"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, TrendingUp, Users, Eye, Briefcase } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ANALYTICS_SUMMARY,
  ANALYTICS_TRAFFIC,
} from "@/lib/admin-misc-mock";

const STATS = [
  { label: "Page views (30d)", value: ANALYTICS_SUMMARY.pageViews, icon: Eye },
  { label: "Unique visitors", value: ANALYTICS_SUMMARY.uniqueVisitors, icon: Users },
  { label: "New signups", value: ANALYTICS_SUMMARY.signups, icon: TrendingUp },
  { label: "Job applications", value: ANALYTICS_SUMMARY.jobApplications, icon: Briefcase },
];

function formatNum(n: number) {
  return n.toLocaleString("en-IN");
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics"
        description="Traffic, signups, and platform engagement"
      >
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Export report
        </Button>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="py-4">
              <CardContent className="flex items-center justify-between px-4 py-0">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{formatNum(s.value)}</p>
                </div>
                <Icon className="size-8 text-muted-foreground/40" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion rate</CardTitle>
          <CardDescription>Visitor → signup</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {ANALYTICS_SUMMARY.conversionRate}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic & signups</CardTitle>
          <CardDescription>Last 8 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_TRAFFIC}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
                <Line type="monotone" dataKey="signups" stroke="#f97316" name="Signups" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signups by day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_TRAFFIC}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="signups" fill="#f97316" name="Signups" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
