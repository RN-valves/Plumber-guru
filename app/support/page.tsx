"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useRequireAuthAction } from "@/lib/requireAuthAction";
import {
  Phone,
  Droplets,
  Gauge,
  Wrench,
  ShowerHead,
  MessageCircle,
  ChevronDown,
  Play,
  Upload,
  MapPin,
  Send,
  Headphones,
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

const QUICK_HELP = [
  {
    icon: Droplets,
    title: "Leak Emergency",
    desc: "Pipe ya tap se pani leak ho raha hai — turant steps aur expert help.",
    color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300",
  },
  {
    icon: Gauge,
    title: "Pressure Issue",
    desc: "Kam pressure, air lock, ya pump problem — diagnose aur fix guide.",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
  },
  {
    icon: Wrench,
    title: "Valve Problem",
    desc: "Valve leak, jam, ya washer issue — safe repair checklist.",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  },
  {
    icon: ShowerHead,
    title: "Faucet Repair",
    desc: "Mixer, tap, shower fitting — common faults aur replacement tips.",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
];

const FAQS = [
  {
    q: "Pipe leak turant kaise band karein?",
    a: "Main supply valve band karein, leak point pe temporary clamp/tape lagayein, aur photo bhej kar expert se confirm karein.",
  },
  {
    q: "Geyser se pani nahi garam ho raha — kya check karein?",
    a: "Power supply, thermostat setting, aur heating element check karein. Agar smell ya spark ho to turant band karein.",
  },
  {
    q: "Low water pressure ke common reasons kya hain?",
    a: "Clogged filter, air lock, leaking line, ya municipal supply issue. Pressure gauge se test karna helpful hota hai.",
  },
  {
    q: "Fake plumbing products kaise pehchanein?",
    a: "Hologram, batch code, weight, aur authorized dealer se purchase karein. Bahut sasta = risk.",
  },
  {
    q: "Bathroom mein bad smell ka reason?",
    a: "Dry trap, blocked vent, ya sewer line issue ho sakta hai. Trap mein pani check karein.",
  },
  {
    q: "Customer payment delay ho to kya karein?",
    a: "Written estimate, advance policy, aur invoice share karein. Platform par verified job record rakhein.",
  },
  {
    q: "PVC aur CPVC pipe mein difference?",
    a: "CPVC hot water ke liye better hai; PVC mostly cold water/drainage. Temperature rating check karein.",
  },
  {
    q: "Bore well pump baar-baar trip kyu karta hai?",
    a: "Dry run, voltage fluctuation, ya jammed impeller. Amp meter aur flow check karein.",
  },
  {
    q: "Safety gear minimum kya hona chahiye?",
    a: "Gloves, goggles, non-slip shoes, aur height par harness. Chemical work par mask zaroori.",
  },
  {
    q: "Customer ko quote kaise dena chahiye?",
    a: "Scope clear likhein, material + labour alag, validity date, aur terms Hindi/English mein simple rakhein.",
  },
];

const TROUBLE_VIDEOS = [
  { title: "Kitchen sink leak fix", duration: "6:12", topic: "Leak" },
  { title: "Low pressure troubleshooting", duration: "8:40", topic: "Pressure" },
  { title: "Valve washer replacement", duration: "5:55", topic: "Valve" },
  { title: "Mixer tap repair basics", duration: "7:20", topic: "Faucet" },
  { title: "Geyser not heating — checks", duration: "9:05", topic: "Geyser" },
  { title: "Bore well pump tripping", duration: "10:18", topic: "Pump" },
];

export default function SupportPage() {
  const requireAuthAction = useRequireAuthAction();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    problem: "",
    city: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1. Helpline banner */}
      <section className="bg-red-600 text-white">
        <div className="container-pg py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              <p className="text-lg sm:text-xl font-extrabold tracking-tight">
                24×7 Helpline:{" "}
                <a href="tel:18000000000" className="underline underline-offset-4">
                  1800-XXX-XXXX
                </a>
              </p>
            </div>
            <p className="text-sm text-white/90">Emergency technical support — Hindi mein</p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Emergency Technical Support
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Site par problem? Quick help, videos, FAQ, aur expert se baat — sab ek jagah.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 2. Quick help cards */}
      <section className="pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUICK_HELP.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeUp key={card.title} delay={i * 0.05}>
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 h-full flex flex-col shadow-sm">
                    <span
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${card.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-1">
                      {card.desc}
                    </p>
                    <button
                      type="button"
                      className="mt-5 w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-2.5 text-sm transition-colors"
                    >
                      Get Help
                    </button>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Live chat placeholder */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp>
            <div className="rounded-3xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white">
                  <MessageCircle className="w-7 h-7" />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    Expert se baat karo
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Live chat widget — jaldi launch ho raha hai
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    2 experts online
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 transition-colors shrink-0"
              >
                Chat shuru karein
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg max-w-3xl">
          <FadeUp className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              FAQ — Common Questions
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Hindi mein quick answers
            </p>
          </FadeUp>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <FadeUp key={faq.q} delay={i * 0.03}>
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Video troubleshooting */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Video Troubleshooting
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Problem-specific short guides
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TROUBLE_VIDEOS.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.05}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
                    <Play className="w-10 h-10 text-[#F97316]" />
                    <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full bg-black/60 text-white">
                      {v.topic}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {v.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{v.duration}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-6 text-center">
            <Link
              href="/training"
              className="text-sm font-semibold text-[#F97316] hover:underline"
            >
              Aur videos dekhein → Training page
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 6. Ask a Question form */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg max-w-2xl">
          <FadeUp className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Ask a Question
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Apni problem likho — expert reply karenge
            </p>
          </FadeUp>

          <FadeUp>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requireAuthAction(() => setSubmitted(true));
              }}
              className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8 shadow-sm space-y-4"
            >
              {submitted ? (
                <p className="text-center text-emerald-700 dark:text-emerald-300 font-semibold py-8">
                  Dhanyavaad! Aapka sawaal receive ho gaya. Hum jald contact karenge.
                </p>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Problem description
                    </label>
                    <textarea
                      value={form.problem}
                      onChange={(e) => setForm((p) => ({ ...p, problem: e.target.value }))}
                      rows={4}
                      required
                      placeholder="Problem detail mein likho..."
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Photo upload
                    </label>
                    <div className="mt-1 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Photo upload — coming soon
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Abhi ke liye description mein details likhein
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        City
                      </label>
                      <div className="relative mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          value={form.city}
                          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                          required
                          placeholder="e.g. Delhi"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Phone
                      </label>
                      <div className="relative mt-1">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          required
                          placeholder="Apna number daalo"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Question bhejo
                  </button>
                </>
              )}
            </form>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
