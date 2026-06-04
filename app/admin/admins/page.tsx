"use client";

import { useState } from "react";
import { Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  CITY_OPTIONS,
  MOCK_ADMIN_ACTIVITY,
  MOCK_ADMINS,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  type AdminRole,
} from "@/lib/admin-settings-mock";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  invited: "bg-blue-100 text-blue-800",
  suspended: "bg-red-100 text-red-800",
};

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("support_agent");
  const [inviteCity, setInviteCity] = useState("Mumbai");
  const [inviteSent, setInviteSent] = useState(false);

  function sendInvite() {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    const newAdmin = {
      id: `adm-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      city: inviteRole === "city_manager" ? inviteCity : null,
      lastLogin: "—",
      status: "invited" as const,
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setInviteEmail("");
    setInviteName("");
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage dashboard access and roles
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(ROLE_LABELS) as AdminRole[]).map((role) => (
          <Card key={role} className="py-3">
            <CardContent className="px-4 py-0">
              <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Current admins</CardTitle>
          {inviteSent && (
            <Badge className="bg-green-600">Invite sent</Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <p className="font-medium">{admin.name}</p>
                    {admin.city && (
                      <p className="text-xs text-muted-foreground">
                        {admin.city}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ROLE_LABELS[admin.role]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.lastLogin}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_STYLES[admin.status]}
                    >
                      {admin.status.charAt(0).toUpperCase() +
                        admin.status.slice(1)}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem>Edit role</DropdownMenuItem>
                        <DropdownMenuItem>Reset password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="size-4" />
            Invite Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-email">Email</Label>
              <Input
                id="inv-email"
                type="email"
                placeholder="admin@plumber-guru.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
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
              <Label>Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => v && setInviteRole(v as AdminRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as AdminRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
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
                    {CITY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button className="mt-4 gap-2" onClick={sendInvite}>
            <Mail className="size-4" />
            Send Invite
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Sends an email with a secure setup link to create their password.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity log</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last 20 admin actions across all admins
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
              {MOCK_ADMIN_ACTIVITY.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.adminName}
                  </TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell className="max-w-[280px] text-sm text-muted-foreground">
                    {entry.detail}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {entry.timestamp}
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
