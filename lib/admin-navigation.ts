import type { LucideIcon } from "lucide-react";
import type { AdminPermission } from "@/types/admin-permissions";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  Calculator,
  Edit3,
  FileText,
  Flag,
  Home,
  MessageSquare,
  Mic,
  Receipt,
  Settings,
  Shield,
  Target,
  UserCog,
  Users,
  Video,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  permission: AdminPermission;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: Home, permission: "dashboard.view" },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        permission: "analytics.view",
      },
    ],
  },
  {
    title: "PLUMBERS",
    items: [
      {
        label: "All Plumbers",
        href: "/admin/plumbers",
        icon: Users,
        permission: "plumbers.view",
      },
      {
        label: "Verify Plumbers",
        href: "/admin/plumbers/verify",
        icon: Shield,
        badge: 3,
        permission: "plumbers.verify",
      },
      {
        label: "Reported Plumbers",
        href: "/admin/plumbers/reported",
        icon: Flag,
        permission: "plumbers.reported",
      },
    ],
  },
  {
    title: "JOBS & LEADS",
    items: [
      {
        label: "All Jobs",
        href: "/admin/jobs",
        icon: Briefcase,
        permission: "jobs.view",
      },
      {
        label: "Customer Leads",
        href: "/admin/leads",
        icon: Target,
        permission: "leads.view",
      },
      {
        label: "Job Reports",
        href: "/admin/jobs/reports",
        icon: FileText,
        permission: "jobs.reports",
      },
    ],
  },
  {
    title: "CONTENT",
    items: [
      {
        label: "Training Videos",
        href: "/admin/training",
        icon: Video,
        permission: "content.training",
      },
      {
        label: "Podcast Episodes",
        href: "/admin/podcast",
        icon: Mic,
        permission: "content.podcast",
      },
      {
        label: "Blog / SEO Posts",
        href: "/admin/blog",
        icon: Edit3,
        permission: "content.blog",
      },
    ],
  },
  {
    title: "TOOLS & FINANCE",
    items: [
      {
        label: "Invoice Logs",
        href: "/admin/finance/invoices",
        icon: Receipt,
        permission: "finance.invoices",
      },
      {
        label: "GST Reports",
        href: "/admin/finance/gst",
        icon: Calculator,
        permission: "finance.gst",
      },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      {
        label: "Forum Posts",
        href: "/admin/community/forum",
        icon: MessageSquare,
        badge: 7,
        permission: "community.forum",
      },
      {
        label: "Reported Content",
        href: "/admin/community/reported",
        icon: AlertTriangle,
        permission: "community.reported",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        label: "Site Settings",
        href: "/admin/settings",
        icon: Settings,
        permission: "settings.site",
      },
      {
        label: "Admin Users",
        href: "/admin/admins",
        icon: UserCog,
        permission: "settings.admins",
      },
      {
        label: "SMS / Notification Logs",
        href: "/admin/notifications",
        icon: Bell,
        permission: "settings.notifications",
      },
    ],
  },
];
