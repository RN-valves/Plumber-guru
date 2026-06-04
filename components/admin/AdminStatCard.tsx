import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: "blue" | "green" | "orange" | "purple" | "red";
};

const STYLES = {
  blue: {
    bg: "from-blue-500/8 to-transparent",
    icon: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "from-emerald-500/8 to-transparent",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bg: "from-orange-500/8 to-transparent",
    icon: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  purple: {
    bg: "from-violet-500/8 to-transparent",
    icon: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  red: {
    bg: "from-red-500/8 to-transparent",
    icon: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
};

function formatNumber(n: number) {
  return n.toLocaleString("en-IN");
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  accent,
}: AdminStatCardProps) {
  const s = STYLES[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
      <div className={cn("absolute inset-0 bg-gradient-to-br", s.bg)} />
      <div className="relative flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatNumber(value)}
          </p>
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            s.icon
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
