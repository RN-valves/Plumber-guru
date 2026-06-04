"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  CITIES,
  SKILL_OPTIONS,
  MOCK_PLUMBERS_LIST,
  PLUMBER_TOTAL_COUNT,
  type PlumberListItem,
} from "@/lib/admin-plumbers-mock";

const PAGE_SIZE = 20;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AllPlumbersPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All cities");
  const [verified, setVerified] = useState("all");
  const [available, setAvailable] = useState("all");
  const [skill, setSkill] = useState("All skills");
  const [joinedFrom, setJoinedFrom] = useState("");
  const [joinedTo, setJoinedTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      MOCK_PLUMBERS_LIST.map((p) => [p.id, p.status === "active"])
    )
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_PLUMBERS_LIST.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.phone} ${p.city}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (city !== "All cities" && p.city !== city) return false;
      if (verified === "verified" && p.verified !== "verified") return false;
      if (verified === "pending" && p.verified !== "pending") return false;
      if (available !== "all" && p.available !== available) return false;
      if (
        skill !== "All skills" &&
        !p.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      )
        return false;
      if (joinedFrom || joinedTo) {
        const [d, m, y] = p.joinedDate.split("/").map(Number);
        const joined = new Date(y, m - 1, d);
        if (joinedFrom && joined < new Date(joinedFrom)) return false;
        if (joinedTo && joined > new Date(joinedTo)) return false;
      }
      return true;
    });
  }, [search, city, verified, available, skill, joinedFrom, joinedTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selected.has(p.id));

  function toggleAllPage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      pageItems.forEach((p) => {
        if (checked) next.add(p.id);
        else next.delete(p.id);
      });
      return next;
    });
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleStatus(id: string, active: boolean) {
    setStatusMap((m) => ({ ...m, [id]: active }));
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Plumbers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {PLUMBER_TOTAL_COUNT.toLocaleString("en-IN")} Plumbers
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Plumber Manually
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search & filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, city…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <FilterSelect
              label="City"
              value={city}
              onChange={(v) => {
                setCity(v);
                setPage(1);
              }}
              options={CITIES}
            />
            <FilterSelect
              label="Verified"
              value={verified}
              onChange={(v) => {
                setVerified(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All" },
                { value: "verified", label: "Verified" },
                { value: "pending", label: "Pending" },
              ]}
            />
            <FilterSelect
              label="Available"
              value={available}
              onChange={(v) => {
                setAvailable(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All" },
                { value: "available", label: "Available" },
                { value: "busy", label: "Busy" },
                { value: "offline", label: "Offline" },
              ]}
            />
            <FilterSelect
              label="Skills"
              value={skill}
              onChange={(v) => {
                setSkill(v);
                setPage(1);
              }}
              options={SKILL_OPTIONS}
            />
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Joined from</Label>
              <Input
                type="date"
                value={joinedFrom}
                onChange={(e) => {
                  setJoinedFrom(e.target.value);
                  setPage(1);
                }}
                className="w-[150px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Joined to</Label>
              <Input
                type="date"
                value={joinedTo}
                onChange={(e) => {
                  setJoinedTo(e.target.value);
                  setPage(1);
                }}
                className="w-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium">
            {selected.size} selected
          </span>
          <Button size="sm" variant="secondary">
            Verify All
          </Button>
          <Button size="sm" variant="secondary">
            Send SMS
          </Button>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allPageSelected}
                        onCheckedChange={(c) => toggleAllPage(!!c)}
                        aria-label="Select all on page"
                      />
                    </TableHead>
                    <TableHead>Plumber</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((plumber) => (
                    <PlumberRow
                      key={plumber.id}
                      plumber={plumber}
                      selected={selected.has(plumber.id)}
                      active={statusMap[plumber.id] ?? true}
                      onSelect={(c) => toggleRow(plumber.id, c)}
                      onStatusChange={(a) => toggleStatus(plumber.id, a)}
                    />
                  ))}
                </TableBody>
              </Table>
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} (filtered)
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  {pageNumbers.map((n) => (
                    <Button
                      key={n}
                      variant={n === page ? "default" : "outline"}
                      size="sm"
                      className="min-w-8"
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[] | { value: string; label: string }[];
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v ?? value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function PlumberRow({
  plumber,
  selected,
  active,
  onSelect,
  onStatusChange,
}: {
  plumber: PlumberListItem;
  selected: boolean;
  active: boolean;
  onSelect: (checked: boolean) => void;
  onStatusChange: (active: boolean) => void;
}) {
  return (
    <TableRow data-state={selected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(c) => onSelect(!!c)}
          aria-label={`Select ${plumber.name}`}
        />
      </TableCell>
      <TableCell>
        <Link
          href={`/admin/plumbers/${plumber.id}`}
          className="flex items-center gap-2 hover:text-primary"
        >
          <Avatar size="sm">
            <AvatarFallback className="text-xs">
              {initials(plumber.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{plumber.name}</span>
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{plumber.phone}</TableCell>
      <TableCell>{plumber.city}</TableCell>
      <TableCell>
        <div className="flex max-w-[160px] flex-wrap gap-1">
          {plumber.skills.map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px]">
              {s}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {plumber.verified === "verified" ? (
          <Badge className="bg-green-600 hover:bg-green-600">Verified</Badge>
        ) : (
          <Badge className="bg-orange-500 hover:bg-orange-500">Pending</Badge>
        )}
      </TableCell>
      <TableCell>{plumber.rating}</TableCell>
      <TableCell>{plumber.jobsDone}</TableCell>
      <TableCell className="text-muted-foreground">{plumber.joinedDate}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={active}
            onCheckedChange={onStatusChange}
            aria-label={`Toggle ${plumber.name} status`}
          />
          <span className="text-xs text-muted-foreground">
            {active ? "Active" : "Inactive"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <RowActions plumberId={plumber.id} />
      </TableCell>
    </TableRow>
  );
}

function RowActions({ plumberId }: { plumberId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Row actions" />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`/admin/plumbers/${plumberId}`} className="w-full">
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/admin/plumbers/verify" className="w-full">
            Verify
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Send SMS</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Suspend</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-muted">
        <Users className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No plumbers found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try adjusting your search or filters, or add a plumber manually.
      </p>
      <Button className="mt-4 gap-2">
        <Plus className="size-4" />
        Add Plumber Manually
      </Button>
    </div>
  );
}
