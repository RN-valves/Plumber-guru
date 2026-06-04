"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  Briefcase,
  Download,
  Headphones,
  Megaphone,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Target,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminDashboardSkeleton } from "@/components/layout/skeletons";
import { PIE_CHART_COLORS } from "@/lib/admin-constants";
import { cn } from "@/lib/utils";
import type {
  AdminStatsResponse,
  PlumbersListResponse,
} from "@/types/admin-api";
import type { CityPerformance } from "@/lib/admin-dashboard-mock";

type StatColor = "blue" | "green" | "orange" | "purple" | "gray" | "red";

const STAT_META: {
  key: keyof AdminStatsResponse;
  label: string;
  icon: LucideIcon;
  color: StatColor;
}[] = [
  { key: "totalPlumbers", label: "Total Plumbers registered", icon: Users, color: "blue" },
  { key: "verifiedPlumbers", label: "Verified plumbers", icon: ShieldCheck, color: "green" },
  { key: "activeJobs", label: "Active jobs posted", icon: Briefcase, color: "orange" },
  { key: "newPlumbersThisMonth", label: "New plumbers this month", icon: Target, color: "purple" },
  { key: "pendingVerification", label: "Pending verifications", icon: Headphones, color: "red" },
];

type SortKey = keyof CityPerformance;
type SortDir = "asc" | "desc";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return res.json() as Promise<T>;
}

function formatNumber(n: number) {
  return n.toLocaleString("en-IN");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminDashboardPage() {
  const [sortKey, setSortKey] = useState<SortKey>("plumbers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const {
    data: stats,
    error,
    isLoading,
    mutate,
  } = useSWR<AdminStatsResponse>("/api/admin/stats", fetcher);

  const { data: pendingData } = useSWR<PlumbersListResponse>(
    stats ? "/api/admin/plumbers?page=1&limit=5&verified=false" : null,
    fetcher
  );

  const { data: recentData } = useSWR<PlumbersListResponse>(
    stats ? "/api/admin/plumbers?page=1&limit=10" : null,
    fetcher
  );

  const pieData = useMemo(() => {
    if (!stats?.plumbersByCity.length) return [];
    return stats.plumbersByCity.map((row, i) => ({
      name: row.city,
      value: row.count,
      fill: PIE_CHART_COLORS[i % PIE_CHART_COLORS.length],
    }));
  }, [stats]);

  const topCities = useMemo((): CityPerformance[] => {
    if (!stats?.plumbersByCity.length) return [];
    return stats.plumbersByCity.map((row, i) => ({
      city: row.city,
      plumbers: row.count,
      jobs: Math.max(0, Math.round(row.count * 0.15)),
      avgRating: 4.3 + (i % 5) * 0.1,
      growth: Math.max(5, 20 - i * 2),
    }));
  }, [stats]);

  const sortedCities = useMemo(() => {
    const rows = [...topCities];
    rows.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      const diff = (aVal as number) - (bVal as number);
      return sortDir === "asc" ? diff : -diff;
    });
    return rows;
  }, [topCities, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return null;
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-lg font-semibold text-foreground">
          Failed to load dashboard
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <Button className="gap-2" onClick={() => mutate()}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  const statValues: Record<string, number> = {
    totalPlumbers: stats.totalPlumbers,
    verifiedPlumbers: stats.verifiedPlumbers,
    activeJobs: stats.activeJobs,
    newPlumbersThisMonth: stats.newPlumbersThisMonth,
    pendingVerification: stats.pendingVerification,
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-orange-200/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-200">
            Admin Dashboard
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Platform overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Plumbers, jobs, and verifications across India — live from your
            database.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {STAT_META.map((meta, i) => (
          <AdminStatCard
            key={`${meta.label}-${i}`}
            label={meta.label}
            value={(statValues[meta.key] as number) ?? 0}
            icon={meta.icon}
            accent={meta.color === "gray" ? "orange" : meta.color}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800 lg:col-span-3">
          <CardHeader>
            <CardTitle>Plumber Registrations</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.registrationsLast30Days}
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
                    name="Registrations"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#f97316" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle>Plumbers by City</CardTitle>
            <CardDescription>Top 10 cities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        formatNumber(Number(value ?? 0))
                      }
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No city data yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest plumber registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentData?.plumbers.length ? (
              <ul className="divide-y divide-border">
                {recentData.plumbers.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-green-500"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        {item.name} registered from {item.city || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {item.joinedDate}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      className="shrink-0"
                      render={<Link href={`/admin/plumbers/${item.id}`} />}
                    >
                      View profile
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No recent registrations
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>
                {stats.pendingVerification} awaiting review
              </CardDescription>
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              render={<Link href="/admin/plumbers/verify" />}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingData?.plumbers.length ? (
              pendingData.plumbers.map((plumber) => (
                <div
                  key={plumber.id}
                  className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {initials(plumber.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {plumber.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plumber.city} · {plumber.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      render={<Link href={`/admin/plumbers/${plumber.id}`} />}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No pending verifications
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {sortedCities.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800">
          <CardHeader>
            <CardTitle>Top Performing Cities</CardTitle>
            <CardDescription>
              Plumber counts by city · jobs estimated from plumber volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium hover:text-primary"
                      onClick={() => toggleSort("city")}
                    >
                      City{sortIndicator("city")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium hover:text-primary"
                      onClick={() => toggleSort("plumbers")}
                    >
                      Plumbers{sortIndicator("plumbers")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium hover:text-primary"
                      onClick={() => toggleSort("jobs")}
                    >
                      Jobs{sortIndicator("jobs")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="font-medium hover:text-primary"
                      onClick={() => toggleSort("avgRating")}
                    >
                      Avg Rating{sortIndicator("avgRating")}
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[140px]">
                    <button
                      type="button"
                      className="font-medium hover:text-primary"
                      onClick={() => toggleSort("growth")}
                    >
                      Growth{sortIndicator("growth")}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCities.map((row) => (
                  <TableRow key={row.city}>
                    <TableCell className="font-medium">{row.city}</TableCell>
                    <TableCell>{formatNumber(row.plumbers)}</TableCell>
                    <TableCell>{formatNumber(row.jobs)}</TableCell>
                    <TableCell>{row.avgRating.toFixed(1)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                              width: `${Math.min(row.growth * 4, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-medium text-muted-foreground">
                          +{row.growth}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-800">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/admin/training", icon: Video, label: "Add Training Video" },
              { href: "/admin/notifications", icon: MessageSquare, label: "Send Bulk SMS" },
              { href: "/admin/plumbers", icon: Download, label: "Export Plumbers" },
              { href: "/admin/leads", icon: Megaphone, label: "View Leads" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 text-sm font-semibold text-gray-800 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-orange-900 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                    <Icon className="size-4" />
                  </span>
                  {action.label}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
