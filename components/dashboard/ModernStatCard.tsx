import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ModernStatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  accent?: "orange" | "blue" | "green" | "purple" | "amber";
  className?: string;
};

const ACCENT = {
  orange: {
    icon: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    ring: "ring-orange-500/20",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
  },
  green: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  purple: {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/20",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
  },
};

export function ModernStatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "orange",
  className,
}: ModernStatCardProps) {
  const a = ACCENT[accent];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>
          {trend ? (
            <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
            a.icon,
            a.ring
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
