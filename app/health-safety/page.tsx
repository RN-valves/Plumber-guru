"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  HardHat,
  Shield,
  Wrench,
  FlaskConical,
  ArrowUpFromLine,
  FileDown,
  Heart,
  Activity,
  Umbrella,
  Phone,
  Brain,
  Wallet,
  Scale,
  BadgeCheck,
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

const SAFETY_CHECKLIST = [
  {
    icon: HardHat,
    title: "PPE Gear",
    items: ["Helmet", "Gloves", "Goggles", "Safety shoes"],
  },
  {
    icon: Wrench,
    title: "Tool Safety",
    items: ["Insulated tools", "Proper grip", "Power off before work"],
  },
  {
    icon: FlaskConical,
    title: "Chemical Handling",
    items: ["Ventilation", "No mixing chemicals", "MSDS awareness"],
  },
  {
    icon: ArrowUpFromLine,
    title: "Height Work",
    items: ["Harness + anchor", "Stable ladder", "No overreach"],
  },
];

const INJURY_PDFS = [
  { title: "On-site first aid basics", pages: "12 pages" },
  { title: "Electrical safety for plumbers", pages: "8 pages" },
  { title: "Chemical exposure response", pages: "6 pages" },
  { title: "Ladder & height work SOP", pages: "10 pages" },
];

const INSURANCE_PLANS = [
  {
    name: "Accident Cover",
    price: "₹299/mo",
    cover: "₹5 Lakh",
    features: ["Hospitalization", "Disability benefit", "24×7 claim helpline"],
  },
  {
    name: "Health Insurance",
    price: "₹499/mo",
    cover: "₹3 Lakh",
    features: ["OPD + IPD", "Family add-on", "Cashless network"],
    highlight: true,
  },
  {
    name: "Life Insurance",
    price: "₹199/mo",
    cover: "₹10 Lakh",
    features: ["Term life", "Nominee benefit", "Simple documentation"],
  },
];

const WELLNESS_TIPS = [
  {
    icon: Brain,
    title: "Stress management",
    desc: "Break lo, paani piyo, aur kaam ka schedule realistic rakho.",
  },
  {
    icon: Wallet,
    title: "Financial planning",
    desc: "Emergency fund + monthly savings — chhoti rakam bhi matter karti hai.",
  },
  {
    icon: Scale,
    title: "Work-life balance",
    desc: "Family time fix karo; burnout se quality aur income dono down hote hain.",
  },
];

export default function HealthSafetyPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="container-pg relative py-14 sm:py-16">
          <FadeUp className="flex flex-col sm:flex-row sm:items-center gap-6 text-white">
            <span className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur border border-white/30">
              <HardHat className="w-10 h-10" />
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Apni Safety Pehle
              </h1>
              <p className="mt-3 text-white/90 text-sm sm:text-base max-w-xl">
                Health, safety, insurance aur mental wellness — plumber ke liye practical
                resources.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2. Safety checklist */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Safety Checklist
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Har job se pehle ye points check karein
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SAFETY_CHECKLIST.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeUp key={card.title} delay={i * 0.05}>
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 h-full">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/20">
                      <Icon className="w-6 h-6 text-amber-600 dark:text-amber-300" />
                    </span>
                    <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                      {card.title}
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {card.items.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2"
                        >
                          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Injury prevention PDFs */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Injury Prevention Guides
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              PDF download — offline padh sakte ho
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INJURY_PDFS.map((pdf, i) => (
              <FadeUp key={pdf.title} delay={i * 0.05}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5 flex flex-col h-full">
                  <FileDown className="w-8 h-8 text-[#F97316]" />
                  <p className="mt-3 font-semibold text-sm text-gray-900 dark:text-white flex-1">
                    {pdf.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {pdf.pages}
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Insurance */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Insurance Awareness
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Compare plans — apne parivar ke liye protection
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {INSURANCE_PLANS.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.06}>
                <div
                  className={`rounded-3xl border p-7 h-full flex flex-col ${
                    plan.highlight
                      ? "border-[#F97316] bg-white dark:bg-gray-950 shadow-lg"
                      : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {plan.name.includes("Accident") && (
                      <Activity className="w-5 h-5 text-[#F97316]" />
                    )}
                    {plan.name.includes("Health") && (
                      <Heart className="w-5 h-5 text-[#F97316]" />
                    )}
                    {plan.name.includes("Life") && (
                      <Umbrella className="w-5 h-5 text-[#F97316]" />
                    )}
                    <h3 className="font-extrabold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#F97316]">
                    {plan.price}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cover up to {plan.cover}
                  </p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2"
                      >
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-[#F97316] hover:bg-[#ea580c] text-white"
                        : "border border-gray-200 dark:border-gray-700 hover:border-[#F97316] hover:text-[#F97316]"
                    }`}
                  >
                    Get Free Quote
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="flex flex-wrap items-center justify-center gap-6 py-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
              {["Partner A", "Partner B", "Partner C", "Partner D"].map((p) => (
                <div
                  key={p}
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400"
                >
                  {p} Insurance
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 5. Mental wellness */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Mental Wellness
            </h2>
          </FadeUp>

          <FadeUp>
            <div className="rounded-3xl bg-indigo-600 text-white p-6 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">Akele mat socho</h3>
                  <p className="mt-2 text-indigo-100 text-sm">
                    Stress, tension, ya financial worry — baat karna theek hai.
                  </p>
                </div>
                <a
                  href="tel:18005990099"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 font-bold px-5 py-3 shrink-0"
                >
                  <Phone className="w-5 h-5" />
                  Helpline: 1800-599-0099
                </a>
              </div>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WELLNESS_TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <FadeUp key={tip.title} delay={i * 0.05}>
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
                    <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                      {tip.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {tip.desc}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          <FadeUp className="mt-8 text-center">
            <Link
              href="/support"
              className="text-sm font-semibold text-[#F97316] hover:underline"
            >
              Emergency support chahiye? → Support page
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
