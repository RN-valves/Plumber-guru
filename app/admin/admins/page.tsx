"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, MoreHorizontal, Phone, UserPlus } from "lucide-react";
import { AdminPermissionsEditor } from "@/components/admin/AdminPermissionsEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CITY_OPTIONS } from "@/lib/admin-settings-mock";
import {
  ADMIN_ROLE_DESCRIPTIONS,
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_PRESETS,
  formatAdminRoleLabel,
} from "@/lib/admin-permissions";
import type {
  AdminActivityRecord,
  AdminPermission,
  AdminRoleType,
  AdminStatus,
  AdminUserRecord,
} from "@/types/admin-permissions";

const STATUS_STYLES: Record<AdminStatus, string> = {
  active: "bg-green-100 text-green-800",
  invited: "bg-blue-100 text-blue-800",
  suspended: "bg-red-100 text-red-800",
};

const ROLE_OPTIONS = Object.keys(ADMIN_ROLE_LABELS) as AdminRoleType[];

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.adminRole === "super_admin";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admins, setAdmins] = useState<AdminUserRecord[]>([]);
  const [activity, setActivity] = useState<AdminActivityRecord[]>([]);

  const [inviteName, setInviteName] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRoleType>("support_agent");
  const [inviteCity, setInviteCity] = useState("Mumbai");
  const [invitePermissions, setInvitePermissions] = useState<AdminPermission[]>(
    ADMIN_ROLE_PRESETS.support_agent
  );

  const [editOpen, setEditOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRecord | null>(null);
  const [editPermissions, setEditPermissions] = useState<AdminPermission[]>([]);
  const [editRole, setEditRole] = useState<AdminRoleType>("support_agent");
  const [editCity, setEditCity] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<AdminStatus>("active");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load admins");
      setAdmins(data.admins ?? []);
      setActivity(data.activity ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  useEffect(() => {
    setInvitePermissions(ADMIN_ROLE_PRESETS[inviteRole]);
  }, [inviteRole]);

  function openEditDialog(admin: AdminUserRecord) {
    setEditingAdmin(admin);
    setEditRole(admin.adminRole);
    setEditPermissions(admin.permissions);
    setEditCity(admin.assignedCity);
    setEditStatus(admin.adminStatus);
    setEditOpen(true);
  }

  async function createAdmin() {
    if (!inviteName.trim() || !invitePhone.trim()) {
      setError("Name and phone are required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          phone: invitePhone,
          email: inviteEmail,
          adminRole: inviteRole,
          assignedCity: inviteRole === "city_manager" ? inviteCity : null,
          permissions: invitePermissions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setInviteName("");
      setInvitePhone("");
      setInviteEmail("");
      setInviteRole("support_agent");
      setSuccess("Sub-admin access granted. They can log in with OTP on this phone number.");
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setSaving(false);
    }
  }

  async function saveAdminAccess() {
    if (!editingAdmin) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminRole: editRole,
          permissions: editPermissions,
          assignedCity: editRole === "city_manager" ? editCity : null,
          adminStatus: editStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update admin");

      setEditOpen(false);
      setSuccess("Admin access updated.");
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update admin");
    } finally {
      setSaving(false);
    }
  }

  async function quickUpdateStatus(admin: AdminUserRecord, adminStatus: AdminStatus) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update admin");
      setSuccess(`Admin ${adminStatus === "suspended" ? "suspended" : "activated"}.`);
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update admin");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Super admins can invite sub-admins and control which sections they can
          access.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ROLE_OPTIONS.map((role) => (
          <Card key={role} className="py-3">
            <CardContent className="px-4 py-0">
              <p className="text-sm font-medium">{ADMIN_ROLE_LABELS[role]}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {ADMIN_ROLE_DESCRIPTIONS[role]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Current admins</CardTitle>
          {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                {isSuperAdmin && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <p className="font-medium">{admin.name}</p>
                    {admin.assignedCity && (
                      <p className="text-xs text-muted-foreground">
                        City: {admin.assignedCity}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatAdminRoleLabel(admin.adminRole)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[220px] text-xs text-muted-foreground">
                    {admin.adminRole === "super_admin"
                      ? "Full access"
                      : `${admin.permissions.length} sections`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.lastLogin ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_STYLES[admin.adminStatus]}
                    >
                      {admin.adminStatus.charAt(0).toUpperCase() +
                        admin.adminStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Admin actions"
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(admin)}>
                            Edit access
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {admin.adminStatus === "suspended" ? (
                            <DropdownMenuItem
                              onClick={() => quickUpdateStatus(admin, "active")}
                            >
                              Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => quickUpdateStatus(admin, "suspended")}
                            >
                              Suspend
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="size-4" />
              Add Sub-Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inv-name">Name</Label>
                <Input
                  id="inv-name"
                  placeholder="Full name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-phone">Phone</Label>
                <Input
                  id="inv-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-email">Email (optional)</Label>
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="admin@plumber-guru.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role template</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(v) => v && setInviteRole(v as AdminRoleType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.filter((role) => role !== "super_admin").map(
                      (role) => (
                        <SelectItem key={role} value={role}>
                          {ADMIN_ROLE_LABELS[role]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              {inviteRole === "city_manager" && (
                <div className="space-y-2">
                  <Label>Assigned city</Label>
                  <Select
                    value={inviteCity}
                    onValueChange={(v) => v && setInviteCity(v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CITY_OPTIONS.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <AdminPermissionsEditor
              adminRole={inviteRole}
              permissions={invitePermissions}
              onChange={setInvitePermissions}
            />

            <Button className="gap-2" onClick={createAdmin} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Phone className="size-4" />
              )}
              Grant admin access
            </Button>
            <p className="text-xs text-muted-foreground">
              Sub-admin will log in with OTP on the phone number above. You can
              fine-tune section access before saving.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity log</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent admin actions across the panel
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.adminName}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell className="max-w-[280px] text-sm text-muted-foreground">
                    {entry.detail}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {entry.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit admin access</DialogTitle>
          </DialogHeader>
          {editingAdmin && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">{editingAdmin.name}</p>
                  <p className="text-xs text-muted-foreground">{editingAdmin.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(v) => v && setEditStatus(v as AdminStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role template</Label>
                  <Select
                    value={editRole}
                    onValueChange={(v) => v && setEditRole(v as AdminRoleType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ADMIN_ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {editRole === "city_manager" && (
                  <div className="space-y-2">
                    <Label>Assigned city</Label>
                    <Select
                      value={editCity ?? ""}
                      onValueChange={(v) => v && setEditCity(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CITY_OPTIONS.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <AdminPermissionsEditor
                adminRole={editRole}
                permissions={editPermissions}
                onChange={setEditPermissions}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveAdminAccess} disabled={saving}>
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  Save access
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
