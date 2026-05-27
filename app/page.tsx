"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Wrench,
  Briefcase,
  GraduationCap,
  Phone,
  MapPin,
  Shield,
  AlertTriangle,
  Play,
  Users,
  Building2,
  Headphones,
  Globe,
  ChevronRight,
} from "lucide-react";

/* ─── Animation helpers ─────────────────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
const STATS = [
  { icon: Users, value: "50,000+", label: "Plumbers" },
  { icon: Building2, value: "500+", label: "Cities" },
  { icon: Headphones, value: "24×7", label: "Support" },
  { icon: Globe, value: "6", label: "Languages" },
];

const PROBLEMS = [
  {
    title: "Delayed Payments",
    desc: "Customers delay or refuse payment after work is done.",
  },
  {
    title: "No Proper Training",
    desc: "No access to certified skill-development programs.",
  },
  {
    title: "Fake / Low-Quality Products",
    desc: "Suppliers sell counterfeit parts at premium prices.",
  },
  {
    title: "Low & Irregular Wages",
    desc: "Inconsistent work leads to unstable monthly income.",
  },
  {
    title: "No Customer Trust",
    desc: "Lack of verified profile makes it hard to get leads.",
  },
];

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Training & Certification",
    desc: "Industry-recognised courses to upgrade your skills.",
    href: "/training",
  },
  {
    icon: Briefcase,
    title: "Jobs & Leads",
    desc: "Daily local job alerts and direct customer leads.",
    href: "/jobs",
  },
  {
    icon: Wrench,
    title: "Digital Tools",
    desc: "Calculators, guides and product catalogues.",
    href: "/tools",
  },
  {
    icon: Phone,
    title: "Emergency Support",
    desc: "24×7 helpline for urgent on-site problems.",
    href: "/support",
  },
  {
    icon: MapPin,
    title: "Find Plumber",
    desc: "Customers discover verified plumbers nearby.",
    href: "/find-plumber",
  },
  {
    icon: Shield,
    title: "Health & Insurance",
    desc: "Affordable health cover and accident protection.",
    href: "/insurance",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Register",
    desc: "Create your free plumber profile in 2 minutes.",
  },
  {
    number: "02",
    title: "Complete Profile",
    desc: "Add skills, certifications and your service area.",
  },
  {
    number: "03",
    title: "Get Jobs & Training",
    desc: "Receive leads, attend courses and grow your income.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Kumar",
    city: "Delhi",
    initials: "RK",
    quote: "Plumber Guru ne meri zindagi badal di — ab mujhe kaam dhoondna nahi padta.",
    translation:
      "Plumber Guru changed my life — I no longer have to search for work.",
  },
  {
    name: "Suresh Babu",
    city: "Hyderabad",
    initials: "SB",
    quote: "Training certificate mile aur salary bhi 40% badh gayi. Bahut shukriya!",
    translation:
      "Got the training certificate and my salary increased by 40%. Very thankful!",
  },
  {
    name: "Anand Patil",
    city: "Pune",
    initials: "AP",
    quote: "Ab customers mujh par trust karte hain. Verified badge ne sab badal diya.",
    translation:
      "Now customers trust me. The verified badge changed everything.",
  },
];

const EPISODES = [
  {
    ep: "EP 12",
    title: "GST aur Plumbers — Kya jaanna zaroori hai?",
    duration: "28 min",
  },
  {
    ep: "EP 11",
    title: "Certification se income kaise badhayein",
    duration: "34 min",
  },
  {
    ep: "EP 10",
    title: "Customer complaints handle karne ke tips",
    duration: "22 min",
  },
];

const LANGUAGES = [
  { label: "हिंदी", code: "hi", flag: "🇮🇳" },
  { label: "తెలుగు", code: "te", flag: "🌐" },
  { label: "தமிழ்", code: "ta", flag: "🌐" },
  { label: "ಕನ್ನಡ", code: "kn", flag: "🌐" },
  { label: "मराठी", code: "mr", flag: "🌐" },
  { label: "বাংলা", code: "bn", flag: "🌐" },
];

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center bg-gray-950 overflow-hidden">
        {/* Decorative pipe SVG pattern */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="pipes" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect x="30" y="0" width="8" height="80" rx="4" fill="white" />
                <rect x="0" y="30" width="80" height="8" rx="4" fill="white" />
                <circle cx="34" cy="34" r="6" fill="none" stroke="white" strokeWidth="3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pipes)" />
          </svg>
        </div>
        {/* Orange gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-transparent to-orange-900/20 pointer-events-none" aria-hidden="true" />

        <div className="container-pg relative z-10 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 tracking-wider uppercase">
              India&apos;s #1 Plumber Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              India ke Plumbers ka{" "}
              <span className="text-[#F97316]">Apna Platform</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Training, Jobs, Tools aur Support — sab ek jagah
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold text-base transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Register as Plumber
              </Link>
              <Link
                href="/find-plumber"
                className="px-8 py-4 rounded-xl border-2 border-white/40 hover:border-[#F97316] text-white hover:text-[#F97316] font-semibold text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Find Plumber Near Me
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm"
        >
          <div className="container-pg py-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 text-[#F97316] mb-1" />
                  <span className="text-2xl font-extrabold text-white">{value}</span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 2. PROBLEMS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Plumbers ki Problems —{" "}
              <span className="text-[#F97316]">Hum Samajhte Hain</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              We built Plumber Guru because we heard these struggles, every day.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {PROBLEMS.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.08}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Plumber Guru <span className="text-[#F97316]">kya deta hai?</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Everything a plumber needs to grow — in one platform.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <Link
                  href={f.href}
                  className="group block bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-sm hover:border-[#F97316] hover:shadow-lg transition-all duration-200 h-full"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 mb-4 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
                    <f.icon className="w-6 h-6 text-[#F97316]" />
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-medium text-[#F97316] gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Kaise Kaam Karta Hai?
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start in 3 simple steps — totally free.
            </p>
          </FadeUp>

          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-0 items-start justify-center max-w-4xl mx-auto">
            {/* Dashed connector line — desktop only */}
            <div
              className="hidden lg:block absolute top-10 left-[calc(16.7%+2rem)] right-[calc(16.7%+2rem)] border-t-2 border-dashed border-orange-300 dark:border-orange-800"
              aria-hidden="true"
            />

            {STEPS.map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.15} className="flex-1 flex flex-col items-center text-center px-6">
                <span className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-[#F97316] text-white font-extrabold text-2xl shadow-lg shadow-orange-300/40 mb-5">
                  {step.number}
                </span>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4} className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-300/30 hover:-translate-y-0.5"
            >
              Get Started Free <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Plumbers Ki <span className="text-[#F97316]">Kahaniyan</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Real stories from real plumbers across India.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400">{t.city}</p>
                    </div>
                    {/* Star rating */}
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <span className="font-medium">English:</span> {t.translation}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PODCAST ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-950">
        <div className="container-pg">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                NEW EPISODES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Plumber Guru <span className="text-[#F97316]">Podcast</span>
              </h2>
              <p className="text-gray-400 mt-1 text-sm">
                Plumbing ki duniya ki asli baatein — Hindi mein
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1aa34a] text-white text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                Spotify
              </a>
              <a
                href="https://www.jiosaavn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                JioSaavn
              </a>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {EPISODES.map((ep, i) => (
              <FadeUp key={ep.title} delay={i * 0.1}>
                <div className="group bg-gray-800/60 hover:bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/40 transition-all cursor-pointer flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">
                      {ep.ep}
                    </span>
                    <span className="text-xs text-gray-500">{ep.duration}</span>
                  </div>
                  <p className="text-sm font-medium text-white leading-snug flex-1">
                    {ep.title}
                  </p>
                  <button className="flex items-center gap-2 text-xs font-medium text-[#F97316] group-hover:gap-3 transition-all">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F97316]/10 group-hover:bg-[#F97316]/20 transition-colors">
                      <Play className="w-3.5 h-3.5" />
                    </span>
                    Play Episode
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. LANGUAGE BANNER ────────────────────────────────────────── */}
      <section className="py-16 bg-orange-50 dark:bg-gray-900">
        <div className="container-pg text-center">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Available in{" "}
              <span className="text-[#F97316]">6 Languages</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
              Choose your preferred language and get the full experience.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className="px-6 py-3 rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold text-base hover:border-[#F97316] hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-[#F97316] transition-all shadow-sm hover:shadow-md"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. FINAL CTA BANNER ───────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden bg-[#F97316]">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id="cta-pipes" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect x="26" y="0" width="6" height="60" rx="3" fill="white" />
                <rect x="0" y="26" width="60" height="6" rx="3" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pipes)" />
          </svg>
        </div>

        <div className="container-pg relative z-10 text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Aaj hi join karo —
              <br />
              <span className="opacity-90">
                India ke 50,000 plumbers ke saath
              </span>
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Free registration. Instant access to jobs, training and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-10 py-4 rounded-xl bg-white text-[#F97316] font-bold text-base hover:bg-orange-50 transition-all shadow-xl shadow-orange-900/30 hover:-translate-y-0.5"
              >
                Register as Plumber — Free
              </Link>
              <Link
                href="/find-plumber"
                className="px-10 py-4 rounded-xl border-2 border-white/60 text-white hover:border-white hover:bg-white/10 font-semibold text-base transition-all hover:-translate-y-0.5"
              >
                Find a Plumber
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
