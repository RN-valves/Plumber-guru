import type {
  AdminAccessProfile,
  AdminPermission,
  AdminRoleType,
} from "@/types/admin-permissions";

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] = [
  "dashboard.view",
  "analytics.view",
  "plumbers.view",
  "plumbers.verify",
  "plumbers.reported",
  "jobs.view",
  "leads.view",
  "jobs.reports",
  "content.training",
  "content.podcast",
  "content.blog",
  "finance.invoices",
  "finance.gst",
  "community.forum",
  "community.reported",
  "settings.site",
  "settings.admins",
  "settings.notifications",
];

export const ADMIN_PERMISSION_GROUPS: {
  id: string;
  label: string;
  permissions: { key: AdminPermission; label: string; description: string }[];
}[] = [
  {
    id: "overview",
    label: "Overview",
    permissions: [
      {
        key: "dashboard.view",
        label: "Dashboard",
        description: "View platform stats and quick actions",
      },
      {
        key: "analytics.view",
        label: "Analytics",
        description: "View traffic and signup reports",
      },
    ],
  },
  {
    id: "plumbers",
    label: "Plumbers",
    permissions: [
      {
        key: "plumbers.view",
        label: "All Plumbers",
        description: "Browse and manage plumber profiles",
      },
      {
        key: "plumbers.verify",
        label: "Verify Plumbers",
        description: "Approve or reject verification requests",
      },
      {
        key: "plumbers.reported",
        label: "Reported Plumbers",
        description: "Review customer complaints",
      },
    ],
  },
  {
    id: "jobs",
    label: "Jobs & Leads",
    permissions: [
      {
        key: "jobs.view",
        label: "All Jobs",
        description: "Manage job listings",
      },
      {
        key: "leads.view",
        label: "Customer Leads",
        description: "Assign and track customer leads",
      },
      {
        key: "jobs.reports",
        label: "Job Reports",
        description: "View job analytics",
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    permissions: [
      {
        key: "content.training",
        label: "Training Videos",
        description: "Manage training content",
      },
      {
        key: "content.podcast",
        label: "Podcast Episodes",
        description: "Manage podcast episodes",
      },
      {
        key: "content.blog",
        label: "Blog / SEO Posts",
        description: "Manage blog and SEO posts",
      },
    ],
  },
  {
    id: "finance",
    label: "Tools & Finance",
    permissions: [
      {
        key: "finance.invoices",
        label: "Invoice Logs",
        description: "View plumber invoice logs",
      },
      {
        key: "finance.gst",
        label: "GST Reports",
        description: "View GST summaries",
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    permissions: [
      {
        key: "community.forum",
        label: "Forum Posts",
        description: "Moderate forum posts",
      },
      {
        key: "community.reported",
        label: "Reported Content",
        description: "Review flagged community content",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    permissions: [
      {
        key: "settings.site",
        label: "Site Settings",
        description: "Edit SEO, homepage, and payment settings",
      },
      {
        key: "settings.admins",
        label: "Admin Users",
        description: "Invite sub-admins and manage access",
      },
      {
        key: "settings.notifications",
        label: "SMS / Notifications",
        description: "Send bulk SMS and view notification logs",
      },
    ],
  },
];

export const ADMIN_ROLE_LABELS: Record<AdminRoleType, string> = {
  super_admin: "Super Admin",
  content_manager: "Content Manager",
  support_agent: "Support Agent",
  city_manager: "City Manager",
};

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRoleType, string> = {
  super_admin: "Full access to all admin features",
  content_manager: "Training, podcast, and blog content",
  support_agent: "Support tickets and community moderation",
  city_manager: "Plumbers and jobs in assigned city only",
};

export const ADMIN_ROLE_PRESETS: Record<AdminRoleType, AdminPermission[]> = {
  super_admin: ALL_ADMIN_PERMISSIONS,
  content_manager: [
    "dashboard.view",
    "content.training",
    "content.podcast",
    "content.blog",
  ],
  support_agent: [
    "dashboard.view",
    "community.forum",
    "community.reported",
    "settings.notifications",
  ],
  city_manager: [
    "dashboard.view",
    "plumbers.view",
    "plumbers.verify",
    "plumbers.reported",
    "jobs.view",
    "leads.view",
    "jobs.reports",
  ],
};

/** Route prefix → required permission (most specific match wins). */
export const ADMIN_ROUTE_PERMISSIONS = [
  { prefix: "/admin/analytics", permission: "analytics.view" },
  { prefix: "/admin/plumbers/verify", permission: "plumbers.verify" },
  { prefix: "/admin/plumbers/reported", permission: "plumbers.reported" },
  { prefix: "/admin/plumbers", permission: "plumbers.view" },
  { prefix: "/admin/leads", permission: "leads.view" },
  { prefix: "/admin/jobs/reports", permission: "jobs.reports" },
  { prefix: "/admin/jobs", permission: "jobs.view" },
  { prefix: "/admin/training", permission: "content.training" },
  { prefix: "/admin/podcast", permission: "content.podcast" },
  { prefix: "/admin/blog", permission: "content.blog" },
  { prefix: "/admin/finance/invoices", permission: "finance.invoices" },
  { prefix: "/admin/finance/gst", permission: "finance.gst" },
  { prefix: "/admin/community/forum", permission: "community.forum" },
  { prefix: "/admin/community/reported", permission: "community.reported" },
  { prefix: "/admin/settings", permission: "settings.site" },
  { prefix: "/admin/admins", permission: "settings.admins" },
  { prefix: "/admin/notifications", permission: "settings.notifications" },
  { prefix: "/admin/access-denied", permission: "dashboard.view" },
  { prefix: "/admin", permission: "dashboard.view" },
] as const satisfies { prefix: string; permission: AdminPermission }[];

export function isSuperAdmin(access: Pick<AdminAccessProfile, "adminRole">): boolean {
  return access.adminRole === "super_admin";
}

export function hasAdminPermission(
  access: Pick<AdminAccessProfile, "adminRole" | "permissions">,
  permission: AdminPermission
): boolean {
  if (access.adminRole === "super_admin") return true;
  return access.permissions.includes(permission);
}

export function getRoutePermission(pathname: string): AdminPermission {
  const sorted = [...ADMIN_ROUTE_PERMISSIONS].sort(
    (a, b) => b.prefix.length - a.prefix.length
  );
  const match = sorted.find(
    (entry) =>
      pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  );
  return match?.permission ?? "dashboard.view";
}

export function canAccessAdminRoute(
  access: Pick<AdminAccessProfile, "adminRole" | "permissions">,
  pathname: string
): boolean {
  if (pathname === "/admin/access-denied") return true;
  const permission = getRoutePermission(pathname);
  return hasAdminPermission(access, permission);
}

export function getFirstAllowedAdminRoute(
  access: Pick<AdminAccessProfile, "adminRole" | "permissions">
): string {
  for (const entry of [...ADMIN_ROUTE_PERMISSIONS].reverse()) {
    if (hasAdminPermission(access, entry.permission)) {
      return entry.prefix === "/admin/access-denied" ? "/admin" : entry.prefix;
    }
  }
  return "/admin/access-denied";
}

export function sanitizePermissions(
  permissions: AdminPermission[] | undefined,
  adminRole: AdminRoleType
): AdminPermission[] {
  if (adminRole === "super_admin") return ALL_ADMIN_PERMISSIONS;
  const allowed = new Set(ALL_ADMIN_PERMISSIONS);
  const unique = Array.from(new Set(permissions ?? [])).filter((p) =>
    allowed.has(p)
  );
  return unique.length > 0 ? unique : ADMIN_ROLE_PRESETS[adminRole];
}

export function formatAdminRoleLabel(adminRole: AdminRoleType): string {
  return ADMIN_ROLE_LABELS[adminRole] ?? adminRole;
}

export function filterAdminNav<T extends { permission: AdminPermission }>(
  items: T[],
  access: Pick<AdminAccessProfile, "adminRole" | "permissions">
): T[] {
  return items.filter((item) => hasAdminPermission(access, item.permission));
}
