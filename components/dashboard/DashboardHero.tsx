import { cn } from "@/lib/utils";

type DashboardHeroProps = {
  badge: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: "plumber" | "customer";
};

export function DashboardHero({
  badge,
  title,
  subtitle,
  children,
  variant = "plumber",
}: DashboardHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 sm:p-8",
        variant === "plumber"
          ? "border-orange-200/50 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20 dark:border-orange-900/30"
          : "border-blue-200/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg shadow-slate-900/30 dark:border-slate-700"
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-white/5 blur-2xl" />
      <div className="relative">
        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {badge}
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm text-white/85">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
