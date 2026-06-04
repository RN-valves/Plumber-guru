"use client";

import Link from "next/link";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Globe,
  Headphones,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShieldCheck,
  Users,
  Wrench,
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
  const inView = useInView(ref, { once: true, margin: "-90px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value]);

  useEffect(() => {
    const unsub = mv.on("change", (latest) => {
      if (!ref.current) return;
      ref.current.textContent = `${Math.round(latest).toLocaleString("en-IN")}${suffix}`;
    });
    return () => unsub();
  }, [mv, suffix]);

  return <span ref={ref} />;
}

const PROBLEMS = [
  {
    title: "Delayed payments",
    before: "Kaam khatam, paisa late ya kabhi kabhi milta hi nahi.",
    after: "Transparent invoices + better customer trust with verified profile.",
  },
  {
    title: "No training",
    before: "Skill upgrade ke liye proper guide/certificate nahi milta.",
    after: "Free videos, step-by-step guides, aur certification programs.",
  },
  {
    title: "Fake products",
    before: "Counterfeit parts se quality down, reputation down.",
    after: "Trusted partners + product awareness and checks.",
  },
  {
    title: "Low wages",
    before: "Kaam irregular, earning unstable, growth slow.",
    after: "Jobs marketplace + leads to increase daily income.",
  },
  {
    title: "No customer trust",
    before: "Naye customers ko trust nahi, repeat work kam.",
    after: "Verified identity + reviews + profile credentials.",
  },
];

const TIMELINE = [
  { year: "2024", title: "Launch", desc: "Plumber Guru platform goes live." },
  { year: "2025", title: "10k plumbers", desc: "Community growth across major cities." },
  { year: "2027", title: "1 lakh plumbers", desc: "Training + jobs becomes a nationwide engine." },
  { year: "2030", title: "All India", desc: "Largest plumber network across India." },
];

const TEAM = [
  { name: "Founder Name 1", role: "CEO & Community", initials: "F1" },
  { name: "Founder Name 2", role: "Product & Engineering", initials: "F2" },
  { name: "Founder Name 3", role: "Partnerships", initials: "F3" },
  { name: "Founder Name 4", role: "Operations", initials: "F4" },
];

export default function AboutPage() {
  const stats = useMemo(
    () => [
      { icon: Users, label: "Plumbers registered", value: 50000, suffix: "+" },
      { icon: Building2, label: "Cities covered", value: 500, suffix: "+" },
      { icon: ShieldCheck, label: "Jobs completed", value: 120000, suffix: "+" },
      { icon: BadgeCheck, label: "Certifications issued", value: 18000, suffix: "+" },
    ],
    [],
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1) Mission statement banner */}
      <section className="relative overflow-hidden bg-[#F97316]">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="mission-pipes" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
                <rect x="28" y="0" width="8" height="64" rx="4" fill="white" />
                <rect x="0" y="28" width="64" height="8" rx="4" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mission-pipes)" />
          </svg>
        </div>

        <div className="container-pg relative py-14 sm:py-16">
          <FadeUp>
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white">
                <Wrench className="w-4 h-4" />
                Our Mission
              </span>
              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                “Plumber ki dignity aur income — dono badhe.”
              </h1>
              <p className="mt-4 text-white/90 text-sm sm:text-base leading-relaxed">
                Plumber Guru exists to make plumbing work more respected, more skilled,
                and more financially stable — through training, jobs, tools, and trust.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2) Problems we solve */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Problems we solve
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Real-life plumber problems — and how Plumber Guru improves outcomes.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PROBLEMS.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.06}>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Before → After
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-900/20">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Before
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {p.before}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center justify-center pt-6">
                      <ArrowRight className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div className="rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/15 p-4">
                      <p className="text-xs font-semibold text-orange-800 dark:text-orange-200">
                        After
                      </p>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                        {p.after}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 3) Vision + timeline */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              2030 tak India ka sabse bada plumber network
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Our journey is built on community + skills + trust.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {TIMELINE.map((t, i) => (
              <FadeUp key={t.year} delay={i * 0.06}>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/15 dark:text-orange-200">
                      <Calendar className="w-4 h-4" />
                      {t.year}
                    </span>
                    <Globe className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <h3 className="mt-4 font-extrabold text-gray-900 dark:text-white">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4) Team placeholder */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Team
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Built by people who respect the work and the workers.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <FadeUp key={m.name} delay={i * 0.06}>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold">
                    {m.initials}
                  </div>
                  <p className="mt-4 font-extrabold text-gray-900 dark:text-white">
                    {m.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {m.role}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 5) Press mentions */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Press mentions
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Placeholder logos — real press kit coming soon.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <FadeUp key={n} delay={n * 0.05}>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Newspaper className="w-8 h-8 mx-auto" />
                    <p className="mt-3 font-semibold">Newspaper Logo</p>
                    <p className="text-xs mt-1">Press mention #{n}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 6) Stats counter section (animated) */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Impact so far
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Numbers update as the community grows.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeUp key={s.label} delay={i * 0.06}>
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                    <Icon className="w-5 h-5 text-[#F97316]" />
                    <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                      <AnimatedNumber value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7) Contact */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Contact
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Reach out for partnerships, press, support, or community programs.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
            <FadeUp>
              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-7 shadow-sm">
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-[#F97316] mt-0.5" />
                    <span>
                      Plumber Guru (HQ) — Address placeholder, India
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-[#F97316] mt-0.5" />
                    <span>support@plumber-guru.com</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-[#F97316] mt-0.5" />
                    <span>+91 99999 99999</span>
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Contact Support
                  </Link>
                  <a
                    href="https://instagram.com/plumberguru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] font-semibold px-6 py-3 transition-colors"
                  >
                    Social links
                  </a>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.06}>
              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-7 shadow-sm">
                <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                  Quick links
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { href: "/training", label: "Training & Certification", icon: BadgeCheck },
                    { href: "/jobs", label: "Jobs Marketplace", icon: Users },
                    { href: "/tools", label: "Digital Tools", icon: Wrench },
                    { href: "/brands", label: "Brand Partnerships", icon: Building2 },
                    { href: "/support", label: "Support", icon: Headphones },
                    { href: "/", label: "Home", icon: Globe },
                  ].map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center justify-between gap-3 hover:border-orange-300 transition-colors"
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          <Icon className="w-4 h-4 text-[#F97316]" />
                          {l.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
}

