"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
  Wrench,
  Search,
  Play,
  Clock,
  Eye,
  Filter,
  ChevronDown,
  FileDown,
  BadgeCheck,
  GraduationCap,
  ShieldCheck,
  Trophy,
  HelpCircle,
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
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type Lang = "all" | "Hindi" | "Telugu" | "Tamil" | "Kannada";
type Level = "all" | "Beginner" | "Intermediate" | "Advanced";
type Topic =
  | "all"
  | "Leak Fix"
  | "Pipe Fitting"
  | "Bathroom"
  | "Bore Well"
  | "Electrical";

type Tutorial = {
  id: string;
  titleHi: string;
  language: Exclude<Lang, "all">;
  duration: string;
  level: Exclude<Level, "all">;
  topic: Exclude<Topic, "all">;
  views: string;
};

const TUTORIALS: Tutorial[] = [
  {
    id: "t1",
    titleHi: "Pipe leak ka permanent fix kaise karein?",
    language: "Hindi",
    duration: "08:42",
    level: "Beginner",
    topic: "Leak Fix",
    views: "1.2L",
  },
  {
    id: "t2",
    titleHi: "Bathroom fitting: tap, shower aur mixer installation",
    language: "Hindi",
    duration: "12:10",
    level: "Intermediate",
    topic: "Bathroom",
    views: "86K",
  },
  {
    id: "t3",
    titleHi: "Bore well pump troubleshooting (basic checks)",
    language: "Telugu",
    duration: "10:05",
    level: "Intermediate",
    topic: "Bore Well",
    views: "54K",
  },
  {
    id: "t4",
    titleHi: "Valve repair: washer, spindle aur leak control",
    language: "Kannada",
    duration: "07:55",
    level: "Beginner",
    topic: "Leak Fix",
    views: "39K",
  },
  {
    id: "t5",
    titleHi: "Water heater install: safety aur wiring basics",
    language: "Tamil",
    duration: "14:30",
    level: "Advanced",
    topic: "Electrical",
    views: "62K",
  },
  {
    id: "t6",
    titleHi: "Pressure testing: joints aur pipeline leak detect",
    language: "Hindi",
    duration: "09:18",
    level: "Advanced",
    topic: "Pipe Fitting",
    views: "71K",
  },
  {
    id: "t7",
    titleHi: "Fake products ko kaise pehchanein? (quick checklist)",
    language: "Hindi",
    duration: "06:20",
    level: "Beginner",
    topic: "Pipe Fitting",
    views: "1.0L",
  },
  {
    id: "t8",
    titleHi: "Safety gear: gloves, goggles aur on-site precautions",
    language: "Telugu",
    duration: "05:45",
    level: "Beginner",
    topic: "Bathroom",
    views: "28K",
  },
];

const GUIDE_PDFS = [
  { title: "How to fix pipe leak", href: "/guides/how-to-fix-pipe-leak.pdf" },
  { title: "Bathroom fitting guide", href: "/guides/bathroom-fitting-guide.pdf" },
  { title: "Valve repair checklist", href: "/guides/valve-repair-checklist.pdf" },
  { title: "Pressure testing SOP", href: "/guides/pressure-testing-sop.pdf" },
  { title: "Safety gear essentials", href: "/guides/safety-gear-essentials.pdf" },
  { title: "Fake product identification", href: "/guides/fake-product-identification.pdf" },
];

const CERTS = [
  {
    title: "Basic Plumber Certificate",
    price: "Free",
    meta: "10 videos • Quiz",
    duration: "2–3 days",
    icon: BadgeCheck,
    syllabus: ["Leak basics", "Tools overview", "Joints & fittings", "Customer safety"],
    cta: "Enroll Free",
  },
  {
    title: "Advanced Plumber Certificate",
    price: "₹499",
    meta: "25 videos • Practical test",
    duration: "1–2 weeks",
    icon: GraduationCap,
    syllabus: ["Bathroom fitting", "Pressure testing", "Material selection", "Quality checks"],
    cta: "Enroll ₹499",
  },
  {
    title: "Master Plumber Certificate",
    price: "₹999",
    meta: "50 videos • Live assessment",
    duration: "2–4 weeks",
    icon: Trophy,
    syllabus: ["Large projects", "Team workflows", "Advanced troubleshooting", "Service excellence"],
    cta: "Enroll ₹999",
  },
];

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "orange" | "blue" | "green";
}) {
  const cls =
    tone === "orange"
      ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
      : tone === "blue"
        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
        : tone === "green"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
          : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {children}
    </span>
  );
}

export default function TrainingPage() {
  const [language, setLanguage] = useState<Lang>("all");
  const [level, setLevel] = useState<Level>("all");
  const [topic, setTopic] = useState<Topic>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TUTORIALS.filter((t) => {
      const matchesLang = language === "all" ? true : t.language === language;
      const matchesLevel = level === "all" ? true : t.level === level;
      const matchesTopic = topic === "all" ? true : t.topic === topic;
      const matchesQuery = q.length === 0 ? true : t.titleHi.toLowerCase().includes(q);
      return matchesLang && matchesLevel && matchesTopic && matchesQuery;
    });
  }, [language, level, topic, query]);

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1. Page Header */}
      <section className="relative overflow-hidden bg-[#F97316]">
        <div className="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="wrench-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="6" fill="white" />
                <path
                  d="M84 24c0 7.732-6.268 14-14 14-1.287 0-2.533-.174-3.715-.5l-6.79 6.79a3 3 0 0 0-.879 2.121V74a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V61.385a3 3 0 0 1 .879-2.121l6.79-6.79A13.95 13.95 0 0 1 41 48c0-7.732 6.268-14 14-14 2.052 0 3.999.44 5.754 1.232l-5.89 5.89 6.014 6.014 5.89-5.89C83.56 20.001 84 21.948 84 24Z"
                  fill="white"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wrench-grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-transparent to-orange-900/25 pointer-events-none" aria-hidden="true" />

        <div className="container-pg relative py-16 sm:py-20">
          <FadeUp className="text-white">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                  Training &amp; Certification
                </h1>
                <p className="mt-3 text-white/90 text-base sm:text-lg">
                  Professional plumber bano — free videos, guides aur certificates
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="w-28 h-28 rounded-3xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center">
                  <Wrench className="w-12 h-12 text-white" strokeWidth={2.2} />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
        <div className="container-pg py-6">
          <FadeUp>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Filter className="w-4 h-4 text-[#F97316]" />
                Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                <div className="relative">
                  <label className="sr-only" htmlFor="lang">
                    Language
                  </label>
                  <select
                    id="lang"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Lang)}
                    className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="all">Language: All</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <label className="sr-only" htmlFor="level">
                    Level
                  </label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="all">Level: All</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <label className="sr-only" htmlFor="topic">
                    Topic
                  </label>
                  <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as Topic)}
                    className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="all">Topic: All</option>
                    <option value="Leak Fix">Leak Fix</option>
                    <option value="Pipe Fitting">Pipe Fitting</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Bore Well">Bore Well</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <label className="sr-only" htmlFor="search">
                    Search
                  </label>
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Video ya topic dhundo..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span>{" "}
              tutorials
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 3. Video Tutorials Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Video Tutorials
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Short, practical videos — mobile-friendly and easy to follow.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((t, i) => (
              <FadeUp key={t.id} delay={i * 0.05}>
                <div className="group rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/10" />
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur border border-white/60 dark:border-gray-700">
                      <Play className="w-5 h-5 text-[#F97316]" />
                    </span>
                    <div className="absolute top-3 left-3">
                      <Badge tone="orange">{t.language}</Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
                      {t.titleHi}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <Badge tone={t.level === "Beginner" ? "green" : t.level === "Intermediate" ? "blue" : "orange"}>
                        {t.level}
                      </Badge>
                      <Badge>{t.topic}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {t.views} views
                      </span>
                    </div>

                    <button className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                      Watch Now
                    </button>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeUp className="mt-10">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
                <p className="text-gray-700 dark:text-gray-200 font-semibold">
                  No tutorials found.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Try changing filters or search keywords.
                </p>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* 4. Certification Programs */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Certification Programs
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Earn verified certificates and improve trust + income.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CERTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <FadeUp key={c.title} delay={i * 0.08}>
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                              <Icon className="w-5 h-5 text-[#F97316]" />
                            </span>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                {c.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {c.meta} • {c.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-[#F97316] whitespace-nowrap">
                          {c.price}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3">
                        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            Syllabus preview
                          </p>
                          <ul className="space-y-1.5">
                            {c.syllabus.map((s) => (
                              <li key={s} className="text-xs text-gray-600 dark:text-gray-300 inline-flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            Certificate preview
                          </p>
                          <div className="aspect-[16/10] rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Preview Image
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="mt-5 w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 transition-colors">
                        {c.cta}
                      </button>
                      <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                        Certificate will show on your profile after passing.
                      </p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Step-by-step Guides */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Step-by-step Guides (PDF)
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Quick references you can keep offline on your phone.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GUIDE_PDFS.map((g, i) => (
              <FadeUp key={g.href} delay={i * 0.05}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {g.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF Download
                      </p>
                    </div>
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                      <FileDown className="w-5 h-5 text-[#F97316]" />
                    </span>
                  </div>

                  <a
                    href={g.href}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                    download
                  >
                    <FileDown className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Troubleshooting Support */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp>
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-orange-50 via-white to-white dark:from-orange-900/15 dark:via-gray-900 dark:to-gray-900 p-8 sm:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                    <HelpCircle className="w-4 h-4" />
                    TROUBLESHOOTING SUPPORT
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Koi problem hai? <span className="text-[#F97316]">Expert se pucho</span>
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Send a question, photos, or a short video — our support team will guide you.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Ask Support
                    <Wrench className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] font-semibold px-6 py-3 transition-colors"
                  >
                    View Help Center
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

