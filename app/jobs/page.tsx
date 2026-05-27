"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  ChevronDown,
  Filter,
  IndianRupee,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type Tab = "find" | "post";
type JobType = "Daily wage" | "Contract" | "Full time";
type Posted = "Today" | "This week" | "This month";

type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  area: string;
  salaryPerDay: number;
  jobType: JobType;
  skills: string[];
  posted: Posted;
  postedAgo: string;
};

type Lead = {
  id: string;
  problem: string;
  city: string;
  area: string;
  urgency: "Urgent" | "Normal";
  budget: string;
};

const ALL_SKILLS = [
  "Pipe fitting",
  "Leak repair",
  "Bathroom fitting",
  "Bore well pump",
  "Valve repair",
  "Water heater",
  "Pressure testing",
  "Electrical basics",
  "Customer service",
];

const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    title: "Pipe Fitter needed for builder site",
    company: "Sharma Builders",
    city: "Delhi",
    area: "Rohini",
    salaryPerDay: 1200,
    jobType: "Contract",
    skills: ["Pipe fitting", "Pressure testing"],
    posted: "Today",
    postedAgo: "2h ago",
  },
  {
    id: "j2",
    title: "Housing project maintenance plumber",
    company: "SeaView Housing",
    city: "Mumbai",
    area: "Andheri West",
    salaryPerDay: 1500,
    jobType: "Full time",
    skills: ["Leak repair", "Bathroom fitting", "Customer service"],
    posted: "This week",
    postedAgo: "1d ago",
  },
  {
    id: "j3",
    title: "Apartment renovation — bathroom fittings",
    company: "GreenLine Contractors",
    city: "Bangalore",
    area: "Whitefield",
    salaryPerDay: 1400,
    jobType: "Contract",
    skills: ["Bathroom fitting", "Valve repair"],
    posted: "This week",
    postedAgo: "3d ago",
  },
  {
    id: "j4",
    title: "Daily wage plumber for repair calls",
    company: "QuickFix Services",
    city: "Pune",
    area: "Kothrud",
    salaryPerDay: 900,
    jobType: "Daily wage",
    skills: ["Leak repair", "Valve repair"],
    posted: "Today",
    postedAgo: "5h ago",
  },
  {
    id: "j5",
    title: "Water heater installation technician",
    company: "WarmHome",
    city: "Hyderabad",
    area: "Kondapur",
    salaryPerDay: 1600,
    jobType: "Full time",
    skills: ["Water heater", "Electrical basics", "Customer service"],
    posted: "This month",
    postedAgo: "10d ago",
  },
  {
    id: "j6",
    title: "Bore well pump helper + plumber",
    company: "AquaLift",
    city: "Chennai",
    area: "Velachery",
    salaryPerDay: 1100,
    jobType: "Contract",
    skills: ["Bore well pump", "Leak repair"],
    posted: "This month",
    postedAgo: "2w ago",
  },
  {
    id: "j7",
    title: "Society plumber — monthly contract",
    company: "SkyNest Apartments",
    city: "Ahmedabad",
    area: "Satellite",
    salaryPerDay: 1300,
    jobType: "Contract",
    skills: ["Leak repair", "Bathroom fitting", "Customer service"],
    posted: "This week",
    postedAgo: "4d ago",
  },
  {
    id: "j8",
    title: "Pipeline testing & commissioning",
    company: "Metro Infra",
    city: "Delhi",
    area: "Dwarka",
    salaryPerDay: 1800,
    jobType: "Contract",
    skills: ["Pressure testing", "Pipe fitting"],
    posted: "This month",
    postedAgo: "12d ago",
  },
  {
    id: "j9",
    title: "Retail plumbing counter technician",
    company: "PipeMart Retail",
    city: "Mumbai",
    area: "Dadar",
    salaryPerDay: 800,
    jobType: "Daily wage",
    skills: ["Customer service", "Leak repair"],
    posted: "Today",
    postedAgo: "7h ago",
  },
  {
    id: "j10",
    title: "Bathroom + kitchen fittings (new flat)",
    company: "HomeFit Projects",
    city: "Bangalore",
    area: "HSR Layout",
    salaryPerDay: 1700,
    jobType: "Contract",
    skills: ["Bathroom fitting", "Pipe fitting", "Valve repair"],
    posted: "This week",
    postedAgo: "2d ago",
  },
];

const MOCK_LEADS: Lead[] = [
  {
    id: "l1",
    problem: "Kitchen sink leak + pipe replacement",
    city: "Delhi",
    area: "Janakpuri",
    urgency: "Urgent",
    budget: "₹800–₹1,200",
  },
  {
    id: "l2",
    problem: "Bathroom tap & shower fitting installation",
    city: "Mumbai",
    area: "Powai",
    urgency: "Normal",
    budget: "₹1,500–₹2,500",
  },
  {
    id: "l3",
    problem: "Low water pressure troubleshooting",
    city: "Bangalore",
    area: "Indiranagar",
    urgency: "Urgent",
    budget: "₹1,000–₹2,000",
  },
  {
    id: "l4",
    problem: "Water heater (geyser) not heating",
    city: "Hyderabad",
    area: "Madhapur",
    urgency: "Normal",
    budget: "₹700–₹1,800",
  },
];

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "orange" | "blue" | "green" | "red";
}) {
  const cls =
    tone === "orange"
      ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
      : tone === "blue"
        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
        : tone === "green"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
          : tone === "red"
            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {children}
    </span>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function JobsPage() {
  const [tab, setTab] = useState<Tab>("find");

  // Filters (Find Jobs)
  const [cityQuery, setCityQuery] = useState("");
  const [jobType, setJobType] = useState<JobType | "All">("All");
  const [skills, setSkills] = useState<string[]>([]);
  const [salary, setSalary] = useState(2000);
  const [posted, setPosted] = useState<Posted | "All">("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(10);

  // Post Job form
  const [postForm, setPostForm] = useState({
    title: "",
    description: "",
    locationCity: "",
    locationArea: "",
    salaryPerDay: "1200",
    requiredSkills: [] as string[],
    contactPhone: "",
    jobType: "Contract" as JobType,
    duration: "",
  });

  const filteredJobs = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    return MOCK_JOBS.filter((j) => {
      const matchesCity = q.length === 0 ? true : `${j.city} ${j.area}`.toLowerCase().includes(q);
      const matchesType = jobType === "All" ? true : j.jobType === jobType;
      const matchesSalary = j.salaryPerDay <= salary;
      const matchesPosted = posted === "All" ? true : j.posted === posted;
      const matchesSkills =
        skills.length === 0 ? true : skills.every((s) => j.skills.includes(s));
      return matchesCity && matchesType && matchesSalary && matchesPosted && matchesSkills;
    });
  }, [cityQuery, jobType, salary, posted, skills]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  const FiltersPanel = (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          City / Area
        </label>
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="City ya area search..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Job Type
        </label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {(["Daily wage", "Contract", "Full time"] as JobType[]).map((t) => (
            <button
              key={t}
              onClick={() => setJobType((prev) => (prev === t ? "All" : t))}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                jobType === t
                  ? "border-[#F97316] bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-orange-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Tap again to clear.</p>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Skills required
        </label>
        <div className="mt-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 max-h-48 overflow-auto">
          <div className="grid grid-cols-1 gap-2">
            {ALL_SKILLS.map((s) => {
              const checked = skills.includes(s);
              return (
                <label key={s} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setSkills((prev) =>
                        e.target.checked ? [...prev, s] : prev.filter((x) => x !== s),
                      );
                    }}
                    className="accent-[#F97316]"
                  />
                  <span className="text-xs">{s}</span>
                </label>
              );
            })}
          </div>
        </div>
        {skills.length > 0 && (
          <button
            onClick={() => setSkills([])}
            className="mt-2 text-xs font-semibold text-[#F97316] hover:underline"
          >
            Clear skills
          </button>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Salary range (₹/day)
        </label>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>₹300</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Up to ₹{salary}
            </span>
            <span>₹2000</span>
          </div>
          <input
            type="range"
            min={300}
            max={2000}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full mt-2 accent-[#F97316]"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Posted
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["Today", "This week", "This month"] as Posted[]).map((p) => (
            <button
              key={p}
              onClick={() => setPosted((prev) => (prev === p ? "All" : p))}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                posted === p
                  ? "border-[#F97316] bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-orange-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => {
            setCityQuery("");
            setJobType("All");
            setSkills([]);
            setSalary(2000);
            setPosted("All");
          }}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1. Page Header + Tabs */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="jobs-grid" x="0" y="0" width="88" height="88" patternUnits="userSpaceOnUse">
                <rect x="32" y="0" width="8" height="88" rx="4" fill="white" />
                <rect x="0" y="32" width="88" height="8" rx="4" fill="white" />
                <circle cx="36" cy="36" r="6" fill="none" stroke="white" strokeWidth="3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jobs-grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/25 via-transparent to-orange-900/20 pointer-events-none" aria-hidden="true" />

        <div className="container-pg relative py-14 sm:py-16">
          <FadeUp>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-white max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300">
                  <Briefcase className="w-4 h-4" />
                  JOBS • CONTRACTORS • LEADS
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                  Jobs &amp; Contractor Marketplace
                </h1>
                <p className="mt-3 text-white/80 text-sm sm:text-base">
                  Rozana new jobs, verified contractors, aur direct customer leads — sab ek jagah.
                </p>
              </div>

              <div className="flex gap-2 bg-white/10 border border-white/15 rounded-2xl p-2 w-full sm:w-auto">
                <button
                  onClick={() => setTab("find")}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    tab === "find"
                      ? "bg-white text-gray-900"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => setTab("post")}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    tab === "post"
                      ? "bg-white text-gray-900"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Post a Job
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Tabs content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          {tab === "find" ? (
            <>
              <FadeUp className="mb-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Find Jobs
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Filter jobs by city, salary, skills and posted time.
                    </p>
                  </div>

                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-orange-300"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#F97316]" />
                    Filters
                  </button>
                </div>
              </FadeUp>

              <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
                {/* Desktop sidebar */}
                <FadeUp className="hidden lg:block">
                  <div className="sticky top-20 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#F97316]" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Filters
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                    {FiltersPanel}
                  </div>
                </FadeUp>

                {/* Mobile drawer */}
                {mobileFiltersOpen && (
                  <div className="lg:hidden fixed inset-0 z-50">
                    <div
                      className="absolute inset-0 bg-black/40"
                      onClick={() => setMobileFiltersOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 top-0 h-full w-[92%] max-w-md bg-white dark:bg-gray-950 shadow-2xl p-6 overflow-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-[#F97316]" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            Filters
                          </span>
                        </div>
                        <button
                          onClick={() => setMobileFiltersOpen(false)}
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900"
                          aria-label="Close filters"
                        >
                          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <div className="mt-5">{FiltersPanel}</div>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="mt-6 w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}

                {/* Listings */}
                <div>
                  <FadeUp className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Showing{" "}
                        <span className="font-bold text-gray-900 dark:text-white">
                          {filteredJobs.length}
                        </span>{" "}
                        jobs
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jobType !== "All" && <Badge tone="orange">{jobType}</Badge>}
                        {posted !== "All" && <Badge tone="blue">{posted}</Badge>}
                        {skills.length > 0 && <Badge tone="green">{skills.length} skills</Badge>}
                        {salary < 2000 && (
                          <Badge tone="neutral">≤ ₹{salary}/day</Badge>
                        )}
                      </div>
                    </div>
                  </FadeUp>

                  <div className="grid grid-cols-1 gap-5">
                    {visibleJobs.map((j, i) => {
                      const isSaved = Boolean(saved[j.id]);
                      return (
                        <FadeUp key={j.id} delay={i * 0.03}>
                          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                  {j.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {j.company}
                                  </span>
                                  <span className="text-gray-300 dark:text-gray-700">•</span>
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {j.city}, {j.area}
                                  </span>
                                  <span className="text-gray-300 dark:text-gray-700">•</span>
                                  <span>{j.postedAgo}</span>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  setSaved((prev) => ({ ...prev, [j.id]: !prev[j.id] }))
                                }
                                className="p-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-orange-300 transition-colors"
                                aria-label={isSaved ? "Unsave job" : "Save job"}
                              >
                                {isSaved ? (
                                  <BookmarkCheck className="w-5 h-5 text-[#F97316]" />
                                ) : (
                                  <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                )}
                              </button>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <Badge tone="orange">
                                <IndianRupee className="w-3.5 h-3.5 mr-1" />
                                {j.salaryPerDay}/day
                              </Badge>
                              <Badge tone="blue">{j.jobType}</Badge>
                              <Badge tone="neutral">{j.posted}</Badge>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {j.skills.map((s) => (
                                <Badge key={s} tone="neutral">
                                  {s}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Tip: Complete your profile to increase selection chances.
                              </p>
                              <div className="flex gap-3">
                                <button className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                                  View Details
                                </button>
                                <button className="rounded-xl bg-[#F97316] hover:bg-[#ea580c] px-5 py-2.5 text-sm font-semibold text-white transition-colors">
                                  Apply Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </FadeUp>
                      );
                    })}
                  </div>

                  {filteredJobs.length === 0 && (
                    <FadeUp className="mt-8">
                      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          No jobs found.
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Try clearing filters or searching another city.
                        </p>
                      </div>
                    </FadeUp>
                  )}

                  {filteredJobs.length > visibleJobs.length && (
                    <FadeUp className="mt-8">
                      <button
                        onClick={() => setVisibleCount((c) => Math.min(c + 10, filteredJobs.length))}
                        className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                      >
                        Load More
                      </button>
                    </FadeUp>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <FadeUp className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Post a Job
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Contractors can post jobs and reach verified plumbers quickly.
                </p>
              </FadeUp>

              <FadeUp>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Job title
                      </label>
                      <input
                        value={postForm.title}
                        onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Bathroom fitting plumber needed"
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Job type
                      </label>
                      <div className="relative mt-2">
                        <select
                          value={postForm.jobType}
                          onChange={(e) =>
                            setPostForm((p) => ({ ...p, jobType: e.target.value as JobType }))
                          }
                          className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                          <option value="Daily wage">Daily wage</option>
                          <option value="Contract">Contract</option>
                          <option value="Full time">Full time</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Description
                      </label>
                      <textarea
                        value={postForm.description}
                        onChange={(e) =>
                          setPostForm((p) => ({ ...p, description: e.target.value }))
                        }
                        placeholder="Work details, timings, required experience..."
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Location (City)
                      </label>
                      <input
                        value={postForm.locationCity}
                        onChange={(e) =>
                          setPostForm((p) => ({ ...p, locationCity: e.target.value }))
                        }
                        placeholder="e.g. Delhi"
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Area / Locality
                      </label>
                      <input
                        value={postForm.locationArea}
                        onChange={(e) =>
                          setPostForm((p) => ({ ...p, locationArea: e.target.value }))
                        }
                        placeholder="e.g. Rohini"
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Salary (₹/day)
                      </label>
                      <div className="relative mt-2">
                        <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          value={postForm.salaryPerDay}
                          onChange={(e) =>
                            setPostForm((p) => ({ ...p, salaryPerDay: e.target.value }))
                          }
                          inputMode="numeric"
                          placeholder="e.g. 1200"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Duration
                      </label>
                      <input
                        value={postForm.duration}
                        onChange={(e) =>
                          setPostForm((p) => ({ ...p, duration: e.target.value }))
                        }
                        placeholder="e.g. 15 days / 3 months / ongoing"
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Required skills
                      </label>
                      <div className="mt-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {ALL_SKILLS.map((s) => {
                            const checked = postForm.requiredSkills.includes(s);
                            return (
                              <label key={s} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    setPostForm((p) => ({
                                      ...p,
                                      requiredSkills: e.target.checked
                                        ? [...p.requiredSkills, s]
                                        : p.requiredSkills.filter((x) => x !== s),
                                    }));
                                  }}
                                  className="accent-[#F97316]"
                                />
                                {s}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Contact phone
                      </label>
                      <div className="relative mt-2">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          value={postForm.contactPhone}
                          onChange={(e) =>
                            setPostForm((p) => ({ ...p, contactPhone: e.target.value }))
                          }
                          placeholder="e.g. +91 9xxxx xxxxx"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      By posting, you agree to follow platform rules and fair wages.
                    </div>
                    <button
                      onClick={() => {
                        // mock submit
                        setPostForm({
                          title: "",
                          description: "",
                          locationCity: "",
                          locationArea: "",
                          salaryPerDay: "1200",
                          requiredSkills: [],
                          contactPhone: "",
                          jobType: "Contract",
                          duration: "",
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      Job Post Karo
                    </button>
                  </div>
                </div>
              </FadeUp>
            </>
          )}
        </div>
      </section>

      {/* 4. Customer Leads (below tabs) */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp>
            <SectionTitle
              title="Direct Customer Leads"
              subtitle="Customers looking for plumbers — accept leads (registered plumbers only)."
            />
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_LEADS.map((l, i) => (
              <FadeUp key={l.id} delay={i * 0.06}>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                      {l.problem}
                    </p>
                    <Badge tone={l.urgency === "Urgent" ? "red" : "blue"}>
                      {l.urgency}
                    </Badge>
                  </div>

                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {l.city}, {l.area}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      Budget: {l.budget}
                    </span>
                  </div>

                  <button className="mt-5 w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 transition-colors">
                    Accept Lead
                  </button>
                  <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                    You&apos;ll be asked to login/register before accepting.
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Connect with Retailers */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp>
            <SectionTitle
              title="Connect with Retailers"
              subtitle="Get better prices, genuine products, and steady work by connecting with verified partners."
            />
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Retailers",
                icon: ShieldCheck,
                desc: "Find trusted local retailers for genuine plumbing parts.",
              },
              {
                title: "Distributors",
                icon: Users,
                desc: "Bulk pricing, brand partnerships and faster availability.",
              },
              {
                title: "Builders",
                icon: Building2,
                desc: "Long-term projects and consistent contractor jobs.",
              },
              {
                title: "Housing Societies",
                icon: MapPin,
                desc: "Annual maintenance contracts for societies & apartments.",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <FadeUp key={c.title} delay={i * 0.06}>
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-7 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="flex items-start justify-between">
                      <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20">
                        <Icon className="w-6 h-6 text-[#F97316]" />
                      </span>
                      <Badge tone="orange">Verified</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-1">
                      {c.desc}
                    </p>
                    <button className="mt-5 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                      Connect
                    </button>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          <FadeUp className="mt-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Want to post jobs regularly?{" "}
              <Link href="/support" className="text-[#F97316] font-semibold hover:underline">
                Talk to support
              </Link>
              .
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

