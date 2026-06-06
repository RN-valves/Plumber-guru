export type AdminRoleType =
  | "super_admin"
  | "content_manager"
  | "support_agent"
  | "city_manager";

export type AdminStatus = "active" | "invited" | "suspended";

export type AdminPermission =
  | "dashboard.view"
  | "analytics.view"
  | "plumbers.view"
  | "plumbers.verify"
  | "plumbers.reported"
  | "jobs.view"
  | "leads.view"
  | "jobs.reports"
  | "content.training"
  | "content.podcast"
  | "content.blog"
  | "finance.invoices"
  | "finance.gst"
  | "community.forum"
  | "community.reported"
  | "settings.site"
  | "settings.admins"
  | "settings.notifications";

export type AdminAccessProfile = {
  adminRole: AdminRoleType;
  permissions: AdminPermission[];
  assignedCity: string | null;
  adminStatus: AdminStatus;
};

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  adminRole: AdminRoleType;
  permissions: AdminPermission[];
  assignedCity: string | null;
  adminStatus: AdminStatus;
  lastLogin: string | null;
  createdAt: string;
};

export type AdminActivityRecord = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  detail: string;
  createdAt: string;
};
