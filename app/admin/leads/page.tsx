"use client";

import { useMemo, useState } from "react";
import { Clock, Search, Send, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ASSIGNABLE_PLUMBERS,
  LEAD_STATS,
  MOCK_LEADS,
  type CustomerLead,
  type LeadStatus,
} from "@/lib/admin-jobs-mock";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  assigned: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function CustomerLeadsPage() {
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [assignLead, setAssignLead] = useState<CustomerLead | null>(null);
  const [plumberSearch, setPlumberSearch] = useState("");
  const [selectedPlumberId, setSelectedPlumberId] = useState<string | null>(
    null
  );
  const [assignSuccess, setAssignSuccess] = useState(false);

  const filteredPlumbers = useMemo(() => {
    const q = plumberSearch.trim().toLowerCase();
    if (!q) return ASSIGNABLE_PLUMBERS;
    return ASSIGNABLE_PLUMBERS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [plumberSearch]);

  function openAssignModal(lead: CustomerLead) {
    setAssignLead(lead);
    setPlumberSearch("");
    setSelectedPlumberId(null);
    setAssignSuccess(false);
  }

  function closeAssignModal() {
    setAssignLead(null);
    setAssignSuccess(false);
  }

  function confirmAssign() {
    if (!assignLead || !selectedPlumberId) return;
    const plumber = ASSIGNABLE_PLUMBERS.find((p) => p.id === selectedPlumberId);
    if (!plumber) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === assignLead.id
          ? {
              ...l,
              assignedTo: plumber.name,
              status: "assigned" as const,
            }
          : l
      )
    );
    setAssignSuccess(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Assign plumbers to customer service requests
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New today" value={String(LEAD_STATS.newToday)} />
        <StatCard label="Assigned" value={String(LEAD_STATS.assigned)} />
        <StatCard
          label="Resolved this week"
          value={String(LEAD_STATS.resolvedThisWeek)}
        />
        <StatCard
          label="Avg response time"
          value={LEAD_STATS.avgResponseTime}
          icon={Clock}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="min-w-[200px]">Problem</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const unassigned = !lead.assignedTo && lead.status === "new";
                return (
                  <TableRow
                    key={lead.id}
                    className={cn(unassigned && "bg-yellow-50 dark:bg-yellow-950/20")}
                  >
                    <TableCell className="font-medium">
                      {lead.customerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.phone}
                    </TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell>
                      <span className="line-clamp-2 text-sm">
                        {lead.problem}
                      </span>
                    </TableCell>
                    <TableCell>
                      {lead.urgency === "urgent" ? (
                        <Badge className="bg-red-600 hover:bg-red-600">
                          Urgent
                        </Badge>
                      ) : (
                        <Badge className="bg-green-600 hover:bg-green-600">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{lead.budget}</TableCell>
                    <TableCell>
                      {lead.assignedTo ?? (
                        <span className="text-sm text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={STATUS_STYLES[lead.status]}
                      >
                        {lead.status.charAt(0).toUpperCase() +
                          lead.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.createdAt}
                    </TableCell>
                    <TableCell>
                      {lead.status !== "cancelled" &&
                        lead.status !== "resolved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => openAssignModal(lead)}
                          >
                            <UserPlus className="size-3.5" />
                            Assign
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!assignLead} onOpenChange={(open) => !open && closeAssignModal()}>
        <DialogContent className="sm:max-w-md">
          {assignSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Lead assigned</DialogTitle>
                <DialogDescription>
                  SMS sent to plumber and customer for lead{" "}
                  <strong>{assignLead?.customerName}</strong>.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={closeAssignModal}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Assign to Plumber</DialogTitle>
                <DialogDescription>
                  {assignLead?.customerName} — {assignLead?.city} ·{" "}
                  {assignLead?.problem.slice(0, 60)}…
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search plumbers by name, city, phone…"
                    value={plumberSearch}
                    onChange={(e) => setPlumberSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-1">
                  {filteredPlumbers.map((plumber) => (
                    <li key={plumber.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedPlumberId(plumber.id)}
                        className={cn(
                          "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                          selectedPlumberId === plumber.id &&
                            "bg-primary/10 ring-1 ring-primary"
                        )}
                      >
                        <span className="font-medium">{plumber.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {plumber.city} · {plumber.phone}
                        </span>
                      </button>
                    </li>
                  ))}
                  {filteredPlumbers.length === 0 && (
                    <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                      No plumbers found
                    </li>
                  )}
                </ul>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeAssignModal}>
                  Cancel
                </Button>
                <Button
                  className="gap-2"
                  disabled={!selectedPlumberId}
                  onClick={confirmAssign}
                >
                  <Send className="size-4" />
                  Assign & send SMS
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-center justify-between px-4 py-0">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {Icon && <Icon className="size-7 text-muted-foreground opacity-60" />}
      </CardContent>
    </Card>
  );
}
