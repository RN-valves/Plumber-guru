"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Trophy,
  MessageSquare,
  Users,
  GraduationCap,
  BadgeCheck,
  MapPin,
  ChevronRight,
  Star,
  Heart,
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

const FORUM_QUESTIONS = [
  {
    title: "CPVC hot water line mein kaunsa thickness best hai?",
    author: "Ramesh K.",
    replies: 14,
    time: "2h ago",
  },
  {
    title: "Customer advance nahi de raha — kya policy follow karein?",
    author: "Suresh B.",
    replies: 22,
    time: "5h ago",
  },
  {
    title: "Bore well pump tripping — capacitor ya overload?",
    author: "Anita P.",
    replies: 9,
    time: "1d ago",
  },
  {
    title: "Bathroom waterproofing ke baad leakage — root cause?",
    author: "Vikram S.",
    replies: 17,
    time: "1d ago",
  },
  {
    title: "Certification se income badhti hai kya?",
    author: "Deepak M.",
    replies: 31,
    time: "2d ago",
  },
];

const SCHOLARSHIPS = [
  {
    title: "Basic Plumbing Scholarship",
    amount: "₹5,000",
    eligibility: "New plumbers, age 18–35, income proof",
  },
  {
    title: "Women Plumber Grant",
    amount: "₹10,000",
    eligibility: "Women in plumbing trade, training enrollment",
  },
  {
    title: "Advanced Skills Scholarship",
    amount: "₹15,000",
    eligibility: "2+ years experience, certification track",
  },
];

const RECOGNITION_WALL = [
  { name: "Ramesh Kumar", city: "Delhi", cert: "Master Plumber", initials: "RK" },
  { name: "Priya Sharma", city: "Mumbai", cert: "Advanced", initials: "PS" },
  { name: "Suresh Babu", city: "Hyderabad", cert: "Basic+", initials: "SB" },
  { name: "Anand Patil", city: "Pune", cert: "Master Plumber", initials: "AP" },
  { name: "Lakshmi R.", city: "Chennai", cert: "Advanced", initials: "LR" },
  { name: "Imran K.", city: "Bangalore", cert: "Basic+", initials: "IK" },
];

const WHATSAPP_CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Ahmedabad",
  "Kolkata",
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function CommunityPage() {
  const [womenForm, setWomenForm] = useState({ name: "", phone: "", city: "" });
  const [womenSubmitted, setWomenSubmitted] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Community
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
              Plumbers ka apna network — forum, recognition, scholarships aur city groups.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* 1. Plumber of the Month */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp>
            <div className="rounded-3xl border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-950 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-extrabold shrink-0">
                PS
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#F97316] text-white">
                  <Trophy className="w-3.5 h-3.5" />
                  Plumber of the Month
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white">
                  Priya Sharma
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> Mumbai, Andheri
                </p>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                  Achievement: 50+ verified jobs, 4.9 rating, aur women plumber mentorship
                  initiative mein active contribution.
                </p>
                <div className="mt-3 flex justify-center md:justify-start gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2. Forum preview */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#F97316]" />
                Forum Preview
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Latest questions from the community
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#F97316] hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </FadeUp>

          <div className="space-y-3">
            {FORUM_QUESTIONS.map((q, i) => (
              <FadeUp key={q.title} delay={i * 0.04}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-orange-200 dark:hover:border-orange-800 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {q.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {q.author} • {q.time}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#F97316] bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
                    {q.replies} replies
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Women Plumbers */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FadeUp>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Women Plumbers Initiative
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Plumber Guru women plumbers ko support karta hai — training scholarships,
                mentorship, safe job leads, aur community groups. Agar aap interested hain,
                register karein.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" /> Priority training slots
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" /> Women-only WhatsApp group
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" /> Mentorship from certified plumbers
                </li>
              </ul>
            </FadeUp>

            <FadeUp delay={0.06}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setWomenSubmitted(true);
                }}
                className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 space-y-4"
              >
                <p className="font-bold text-gray-900 dark:text-white">
                  Register interest
                </p>
                {womenSubmitted ? (
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 py-4">
                    Thank you! Hum jald contact karenge.
                  </p>
                ) : (
                  <>
                    <input
                      value={womenForm.name}
                      onChange={(e) =>
                        setWomenForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      placeholder="Naam"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                    />
                    <input
                      type="tel"
                      value={womenForm.phone}
                      onChange={(e) =>
                        setWomenForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      required
                      placeholder="Phone"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                    />
                    <input
                      value={womenForm.city}
                      onChange={(e) =>
                        setWomenForm((p) => ({ ...p, city: e.target.value }))
                      }
                      required
                      placeholder="City"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3"
                    >
                      Register karo
                    </button>
                  </>
                )}
              </form>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 4. Scholarships */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#F97316]" />
              Scholarships
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SCHOLARSHIPS.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.05}>
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 h-full flex flex-col">
                  <p className="text-2xl font-extrabold text-[#F97316]">{s.amount}</p>
                  <h3 className="mt-2 font-bold text-gray-900 dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex-1">
                    Eligibility: {s.eligibility}
                  </p>
                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-2.5 text-sm"
                  >
                    Apply
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recognition Wall */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#F97316]" />
              Recognition Wall
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Certified plumbers — verified profiles
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {RECOGNITION_WALL.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.04}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {p.initials}
                  </div>
                  <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{p.city}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3 h-3" />
                    {p.cert}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WhatsApp communities */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              WhatsApp Community — City Groups
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Apne sheher ke plumbers se judein
            </p>
          </FadeUp>

          <div className="flex flex-wrap justify-center gap-3">
            {WHATSAPP_CITIES.map((city, i) => (
              <FadeUp key={city} delay={i * 0.03}>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Join Plumber Guru ${city} group`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-green-500 hover:text-green-600 transition-colors"
                >
                  <WhatsAppIcon className="w-5 h-5 text-green-500" />
                  {city}
                </a>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-10 text-center">
            <Link
              href="/auth/register"
              className="inline-flex rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3"
            >
              Join Plumber Guru — Register
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
