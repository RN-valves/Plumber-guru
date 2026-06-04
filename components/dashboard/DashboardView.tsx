"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  Eye,
  Star,
  IndianRupee,
  MapPin,
  ToggleLeft,
  ToggleRight,
  FileDown,
  BadgeCheck,
  FileText,
  Shield,
  Wrench,
  GraduationCap,
  Calculator,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ModernStatCard } from "@/components/dashboard/ModernStatCard";
import { cn } from "@/lib/utils";

type DashboardViewProps = {
  userName: string;
  phone?: string;
  role?: string;
  profileComplete: number;
  missingFields: string[];
};

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "profile", label: "Profile" },
  { id: "jobs", label: "Jobs" },
  { id: "invoices", label: "Invoices" },
];

const JOB_ALERTS = [
  { title: "Bathroom fitting — 2BHK", city: "Delhi, Rohini", pay: "₹1,400/day", time: "2h ago", urgent: false },
  { title: "Pipe leak repair (urgent)", city: "Mumbai, Andheri", pay: "₹900/day", time: "5h ago", urgent: true },
  { title: "Water heater installation", city: "Bangalore", pay: "₹1,600/day", time: "1d ago", urgent: false },
  { title: "Society maintenance", city: "Pune, Kothrud", pay: "₹1,200/day", time: "1d ago", urgent: false },
];

const INVOICES = [
  { id: "INV-1042", customer: "Ramesh K.", amount: "₹2,450", date: "24 May" },
  { id: "INV-1038", customer: "Sunita M.", amount: "₹1,800", date: "20 May" },
  { id: "INV-1031", customer: "Amit S.", amount: "₹3,200", date: "15 May" },
];

const TOOLS = [
  { label: "Invoice Generator", href: "/tools", icon: FileText, desc: "GST bills" },
  { label: "Material Calculator", href: "/tools", icon: Calculator, desc: "Estimate cost" },
  { label: "Training", href: "/training", icon: GraduationCap, desc: "Learn & certify" },
  { label: "Browse Jobs", href: "/jobs", icon: Wrench, desc: "Find work" },
];

export function DashboardView({
  userName,
  phone,
  role,
  profileComplete,
  missingFields,
}: DashboardViewProps) {
  const [available, setAvailable] = useState(true);
  const [location, setLocation] = useState("Delhi, Rohini");
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <aside className="lg:w-52 lg:shrink-0">
          <nav className="sticky top-24 flex gap-2 overflow-x-auto rounded-2xl border border-gray-200/80 bg-white/80 p-1.5 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 lg:flex-col lg:overflow-visible">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                  activeSection === item.id
                    ? "bg-[#F97316] text-white shadow-md shadow-orange-500/25"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-8">
          <section id="overview" className="scroll-mt-28 space-y-6">
            <DashboardHero
              badge="Plumber Dashboard"
              title={`Namaste, ${userName} 👋`}
              subtitle={
                phone
                  ? `${phone} · ${available ? "You're visible to customers" : "Hidden from job search"}`
                  : "Complete your profile to unlock more jobs"
              }
              variant="plumber"
            >
              {role === "admin" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
                >
                  <Shield className="size-4" />
                  Admin Panel
                </Link>
              ) : null}
              <LogoutButton className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20" />
            </DashboardHero>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <ModernStatCard label="Jobs applied" value="12" icon={Briefcase} accent="orange" trend="+3 this week" />
              <ModernStatCard label="Profile views" value="148" icon={Eye} accent="blue" trend="+24% vs last month" />
              <ModernStatCard label="Rating" value="4.7" icon={Star} accent="amber" />
              <ModernStatCard label="Earnings" value="₹18.4k" icon={IndianRupee} accent="green" trend="This month" />
            </div>
          </section>

          <section id="profile" className="scroll-mt-28 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile</h2>
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10">
                    <Sparkles className="size-6 text-[#F97316]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Profile strength
                    </p>
                    <p className="text-sm text-gray-500">
                      {missingFields.length
                        ? `Add: ${missingFields.join(", ")}`
                        : "Looking great!"}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#F97316]">
                  {profileComplete}%
                </span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                  style={{ width: `${profileComplete}%` }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setAvailable((v) => !v)}
                className="rounded-2xl border border-gray-200/80 bg-white p-5 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Availability</span>
                  {available ? (
                    <ToggleRight className="size-9 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="size-9 text-gray-400" />
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {available ? "Open for new jobs" : "Paused"}
                </p>
              </button>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-[#F97316]" />
                  Location
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <Link
                href="/training"
                className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
              >
                <BadgeCheck className="size-5 text-[#F97316]" />
                <p className="mt-2 text-sm font-semibold">Certificate</p>
                <p className="text-xs text-gray-500">Training hub →</p>
              </Link>
            </div>
          </section>

          <section id="jobs" className="scroll-mt-28">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Job alerts
              </h2>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#F97316] hover:underline"
              >
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {JOB_ALERTS.map((job) => (
                <div
                  key={job.title}
                  className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </p>
                    {job.urgent ? (
                      <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                        Urgent
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {job.city} · {job.time}
                  </p>
                  <p className="mt-3 text-lg font-bold text-[#F97316]">{job.pay}</p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white transition group-hover:bg-[#F97316] dark:bg-gray-800"
                  >
                    Apply now
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section id="invoices" className="scroll-mt-28">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Invoices
              </h2>
              <Link href="/tools" className="text-sm font-semibold text-[#F97316] hover:underline">
                + New invoice
              </Link>
            </div>
            <div className="space-y-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-5">
              {INVOICES.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {inv.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {inv.customer} · {inv.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{inv.amount}</span>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-200 p-2.5 hover:border-[#F97316] dark:border-gray-700"
                      aria-label="Download"
                    >
                      <FileDown className="size-4 text-[#F97316]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Tools
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.label}
                    href={tool.href}
                    className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316] transition group-hover:bg-[#F97316] group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-3 font-semibold text-gray-900 dark:text-white">
                      {tool.label}
                    </p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
