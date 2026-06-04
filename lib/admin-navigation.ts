import type { LucideIcon } from "lucide-react";
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
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: Home },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "PLUMBERS",
    items: [
      { label: "All Plumbers", href: "/admin/plumbers", icon: Users },
      {
        label: "Verify Plumbers",
        href: "/admin/plumbers/verify",
        icon: Shield,
        badge: 3,
      },
      {
        label: "Reported Plumbers",
        href: "/admin/plumbers/reported",
        icon: Flag,
      },
    ],
  },
  {
    title: "JOBS & LEADS",
    items: [
      { label: "All Jobs", href: "/admin/jobs", icon: Briefcase },
      { label: "Customer Leads", href: "/admin/leads", icon: Target },
      { label: "Job Reports", href: "/admin/jobs/reports", icon: FileText },
    ],
  },
  {
    title: "CONTENT",
    items: [
      {
        label: "Training Videos",
        href: "/admin/training",
        icon: Video,
      },
      {
        label: "Podcast Episodes",
        href: "/admin/podcast",
        icon: Mic,
      },
      {
        label: "Blog / SEO Posts",
        href: "/admin/blog",
        icon: Edit3,
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
      },
      {
        label: "GST Reports",
        href: "/admin/finance/gst",
        icon: Calculator,
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
      },
      {
        label: "Reported Content",
        href: "/admin/community/reported",
        icon: AlertTriangle,
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
      },
      { label: "Admin Users", href: "/admin/admins", icon: UserCog },
      {
        label: "SMS / Notification Logs",
        href: "/admin/notifications",
        icon: Bell,
      },
    ],
  },
];
