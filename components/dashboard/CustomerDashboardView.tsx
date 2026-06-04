"use client";

import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Star,
  Wrench,
  ArrowRight,
  Clock,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ModernStatCard } from "@/components/dashboard/ModernStatCard";

type CustomerDashboardViewProps = {
  userName: string;
  phone?: string;
};

const RECENT_PLUMBERS = [
  { name: "Ramesh Kumar", city: "Delhi, Rohini", rating: 4.8, jobs: 124, available: true },
  { name: "Vikram Singh", city: "Delhi, Pitampura", rating: 4.6, jobs: 89, available: true },
  { name: "Suresh Patel", city: "Gurgaon, Sec 14", rating: 4.9, jobs: 210, available: false },
];

const QUICK_LINKS = [
  { label: "Find Plumber", href: "/find-plumber", icon: Search, color: "from-orange-500 to-amber-500" },
  { label: "Post a Job", href: "/jobs", icon: Wrench, color: "from-blue-500 to-cyan-500" },
  { label: "Community", href: "/community", icon: MessageCircle, color: "from-violet-500 to-purple-500" },
  { label: "Support", href: "/support", icon: Phone, color: "from-emerald-500 to-teal-500" },
];

export function CustomerDashboardView({
  userName,
  phone,
}: CustomerDashboardViewProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <DashboardHero
        badge="Customer Dashboard"
        title={`Namaste, ${userName} 👋`}
        subtitle={
          phone
            ? `${phone} · Book verified plumbers in minutes`
            : "Trusted plumbers near you"
        }
        variant="customer"
      >
        <Link
          href="/find-plumber"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-orange-50"
        >
          <Search className="size-4 text-[#F97316]" />
          Find a plumber
        </Link>
        <LogoutButton className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20" />
      </DashboardHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ModernStatCard label="Saved plumbers" value="3" icon={Star} accent="amber" />
        <ModernStatCard label="Jobs posted" value="2" icon={Wrench} accent="blue" />
        <ModernStatCard label="Avg response" value="2h" icon={Clock} accent="green" />
        <ModernStatCard label="Support tickets" value="0" icon={Shield} accent="purple" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
            >
              <div
                className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${link.color} text-white shadow-md`}
              >
                <Icon className="size-5" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {link.label}
              </p>
              <ArrowRight className="mt-2 size-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#F97316]" />
            </Link>
          );
        })}
      </div>

      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recommended plumbers
            </h2>
            <p className="text-sm text-gray-500">Near your area</p>
          </div>
          <Link
            href="/find-plumber"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#F97316] hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {RECENT_PLUMBERS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-5 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-lg font-bold text-[#F97316]">
                  {p.name.charAt(0)}
                </div>
                <span className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  <Star className="size-3 fill-current" />
                  {p.rating}
                </span>
              </div>
              <p className="mt-4 font-semibold text-gray-900 dark:text-white">
                {p.name}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="size-3 text-[#F97316]" />
                {p.city}
              </p>
              <p className="mt-2 text-xs text-gray-500">{p.jobs} jobs done</p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={
                    p.available
                      ? "text-xs font-medium text-emerald-600"
                      : "text-xs font-medium text-gray-400"
                  }
                >
                  {p.available ? "● Available now" : "Busy"}
                </span>
                <Link
                  href="/find-plumber"
                  className="text-xs font-semibold text-[#F97316] hover:underline"
                >
                  Contact →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center gap-4 rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-white p-6 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-gray-950">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
          <Shield className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            Verified &amp; background-checked
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Every plumber on Plumber Guru is verified before listing.
          </p>
        </div>
      </section>
    </div>
  );
}
