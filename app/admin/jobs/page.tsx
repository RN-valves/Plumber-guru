"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  GripVertical,
  MoreHorizontal,
  Pin,
  Search,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CITIES_FILTER,
  INITIAL_FEATURED,
  JOB_STATUS_OPTIONS,
  JOB_SUMMARY,
  JOB_TYPES,
  MOCK_JOBS,
  type AdminJob,
  type FeaturedJob,
  type JobStatus,
} from "@/lib/admin-jobs-mock";

const STATUS_STYLES: Record<JobStatus, string> = {
  active: "bg-green-600 hover:bg-green-600",
  filled: "bg-blue-600 hover:bg-blue-600",
  expired: "bg-gray-500 hover:bg-gray-500",
  reported: "bg-red-600 hover:bg-red-600",
};

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  contract: "Contract",
  gig: "Gig",
  emergency: "Emergency",
};

export default function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All cities");
  const [status, setStatus] = useState<string>("all");
  const [jobType, setJobType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [featured, setFeatured] = useState<FeaturedJob[]>(INITIAL_FEATURED);
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (q) {
        const hay = `${job.title} ${job.postedBy}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (city !== "All cities" && job.city !== city) return false;
      if (status !== "all" && job.status !== status) return false;
      if (jobType !== "all" && job.jobType !== jobType) return false;
      if (dateFrom || dateTo) {
        const [d, m, y] = job.postedDate.split("/").map(Number);
        const posted = new Date(y, m - 1, d);
        if (dateFrom && posted < new Date(dateFrom)) return false;
        if (dateTo && posted > new Date(dateTo)) return false;
      }
      return true;
    });
  }, [search, city, status, jobType, dateFrom, dateTo, jobs]);

  function markFilled(id: string) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "filled" as const } : j))
    );
  }

  function toggleFeature(job: AdminJob) {
    setFeatured((prev) => {
      const exists = prev.find((f) => f.id === job.id);
      if (exists) return prev.filter((f) => f.id !== job.id);
      if (prev.length >= 5) return prev;
      return [
        ...prev,
        { id: job.id, title: job.title, city: job.city, salary: job.salary },
      ];
    });
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFeatured((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage job postings across the platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active Jobs"
          value={JOB_SUMMARY.activeJobs.toLocaleString("en-IN")}
          icon={Briefcase}
          className="text-blue-600"
        />
        <SummaryCard
          label="Jobs Filled Today"
          value={String(JOB_SUMMARY.filledToday)}
          icon={TrendingUp}
          className="text-green-600"
        />
        <SummaryCard
          label="Expired Jobs"
          value={String(JOB_SUMMARY.expiredJobs)}
          icon={Calendar}
          className="text-gray-600"
        />
        <SummaryCard
          label="Avg Salary Posted"
          value={`₹${JOB_SUMMARY.avgSalary.toLocaleString("en-IN")}`}
          icon={Briefcase}
          className="text-orange-600"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Pin className="size-4 text-primary" />
            Featured Jobs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag to reorder — max 5, shown first on the public /jobs page
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {featured.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No featured jobs. Use &ldquo;Feature Job&rdquo; from the table
              actions menu.
            </p>
          ) : (
            featured.map((job, index) => (
              <div
                key={job.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex cursor-grab items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 active:cursor-grabbing",
                  dragIndex === index && "opacity-60"
                )}
              >
                <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.city} · ₹{job.salary.toLocaleString("en-IN")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFeatured((f) => f.filter((x) => x.id !== job.id))
                  }
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search & filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or posted by…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <FilterField label="City">
              <Select value={city} onValueChange={(v) => setCity(v ?? city)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES_FILTER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
            <FilterField label="Status">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v ?? "all")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
            <FilterField label="Job type">
              <Select
                value={jobType}
                onValueChange={(v) => setJobType(v ?? "all")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
            <FilterField label="From">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
              />
            </FilterField>
            <FilterField label="To">
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
              />
            </FilterField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Posted By</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="max-w-[180px] font-medium">
                    <span className="line-clamp-2">{job.title}</span>
                    {featured.some((f) => f.id === job.id) && (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{job.postedBy}</TableCell>
                  <TableCell>{job.city}</TableCell>
                  <TableCell>
                    ₹{job.salary.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-[140px] flex-wrap gap-1">
                      {job.skills.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[job.status]}>
                      {job.status.charAt(0).toUpperCase() +
                        job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.postedDate}
                    <span className="mt-0.5 block text-[10px]">
                      {JOB_TYPE_LABELS[job.jobType]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <JobActions
                      job={job}
                      isFeatured={featured.some((f) => f.id === job.id)}
                      onMarkFilled={() => markFilled(job.id)}
                      onFeature={() => toggleFeature(job)}
                    />
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

function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-center justify-between px-4 py-0">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={cn("size-8 opacity-70", className)} />
      </CardContent>
    </Card>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function JobActions({
  isFeatured,
  onMarkFilled,
  onFeature,
}: {
  job: AdminJob;
  isFeatured: boolean;
  onMarkFilled: () => void;
  onFeature: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Job actions" />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onMarkFilled}>Mark Filled</DropdownMenuItem>
        <DropdownMenuItem onClick={onFeature}>
          {isFeatured ? "Unfeature Job" : "Feature Job (pin to top)"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
