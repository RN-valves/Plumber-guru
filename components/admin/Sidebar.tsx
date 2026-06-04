"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin-navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SidebarProps = {
  adminName: string;
  adminRole: string;
  onNavigate?: () => void;
  className?: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  adminName,
  adminRole,
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-gray-200/80 bg-white/95 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95",
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 px-5 dark:border-gray-800">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30">
          <Wrench className="size-5" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
            Plumber Guru
          </p>
          <p className="text-[11px] font-medium text-gray-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {ADMIN_NAV.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-white" : "opacity-70"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <Badge
                          className={cn(
                            "h-5 min-w-5 px-1.5 text-[10px] font-bold",
                            active
                              ? "bg-white/25 text-white hover:bg-white/25"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {adminName}
          </p>
          <p className="text-xs capitalize text-gray-500">{adminRole}</p>
        </div>
      </div>
    </div>
  );
}
