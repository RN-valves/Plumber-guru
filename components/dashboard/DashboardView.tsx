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
} from "lucide-react";

type DashboardViewProps = {
  userName: string;
  phone?: string;
  profileComplete: number;
  missingFields: string[];
};

const JOB_ALERTS = [
  {
    title: "Bathroom fitting — 2BHK",
    city: "Delhi, Rohini",
    pay: "₹1,400/day",
    time: "2h ago",
  },
  {
    title: "Pipe leak repair (urgent)",
    city: "Mumbai, Andheri",
    pay: "₹900/day",
    time: "5h ago",
  },
  {
    title: "Water heater installation",
    city: "Bangalore, Whitefield",
    pay: "₹1,600/day",
    time: "1d ago",
  },
  {
    title: "Society maintenance contract",
    city: "Pune, Kothrud",
    pay: "₹1,200/day",
    time: "1d ago",
  },
  {
    title: "Kitchen sink + tap fitting",
    city: "Hyderabad, Kondapur",
    pay: "₹1,100/day",
    time: "2d ago",
  },
];

const INVOICES = [
  { id: "INV-1042", customer: "Ramesh K.", amount: "₹2,450", date: "24 May" },
  { id: "INV-1038", customer: "Sunita M.", amount: "₹1,800", date: "20 May" },
  { id: "INV-1031", customer: "Amit S.", amount: "₹3,200", date: "15 May" },
];

export function DashboardView({
  userName,
  phone,
  profileComplete,
  missingFields,
}: DashboardViewProps) {
  const [available, setAvailable] = useState(true);
  const [location, setLocation] = useState("Delhi, Rohini");

  const stats = [
    { icon: Briefcase, label: "Jobs applied", value: "12" },
    { icon: Eye, label: "Profile views", value: "148" },
    { icon: Star, label: "Rating", value: "4.7" },
    { icon: IndianRupee, label: "Earnings (month)", value: "₹18,400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Namaste, {userName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Plumber Dashboard {phone ? `• ${phone}` : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-5"
            >
              <Icon className="w-5 h-5 text-[#F97316]" />
              <p className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Profile completion */}
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="font-bold text-gray-900 dark:text-white">
            Profile completion
          </p>
          <span className="text-sm font-extrabold text-[#F97316]">
            {profileComplete}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#F97316] transition-all"
            style={{ width: `${profileComplete}%` }}
          />
        </div>
        {missingFields.length > 0 && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Missing: {missingFields.join(", ")}
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
        <p className="font-bold text-gray-900 dark:text-white mb-4">
          Quick actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setAvailable((v) => !v)}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 text-left hover:border-orange-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Availability
              </span>
              {available ? (
                <ToggleRight className="w-8 h-8 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {available ? "Available for jobs" : "Not available"}
            </p>
          </button>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              Update location
            </div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs"
            />
          </div>

          <Link
            href="/training"
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 hover:border-orange-300 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <BadgeCheck className="w-4 h-4 text-[#F97316]" />
              Download certificate
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Training &amp; certification
            </p>
          </Link>
        </div>
      </div>

      {/* Job alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
            Recent job alerts
          </h2>
          <Link href="/jobs" className="text-sm font-semibold text-[#F97316] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {JOB_ALERTS.map((job) => (
            <div
              key={job.title}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-5"
            >
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {job.title}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {job.city} • {job.time}
              </p>
              <p className="mt-2 text-sm font-bold text-[#F97316]">{job.pay}</p>
              <button
                type="button"
                className="mt-3 text-xs font-semibold text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:border-[#F97316] hover:text-[#F97316]"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F97316]" />
            My invoices
          </h2>
          <Link href="/tools" className="text-sm font-semibold text-[#F97316] hover:underline">
            New invoice
          </Link>
        </div>
        <div className="space-y-3">
          {INVOICES.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {inv.id} — {inv.customer}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {inv.amount}
                </span>
                <button
                  type="button"
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#F97316]"
                  aria-label="Download invoice"
                >
                  <FileDown className="w-4 h-4 text-[#F97316]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
