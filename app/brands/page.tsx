"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Factory,
  Globe,
  Headphones,
  Map,
  Megaphone,
  Package,
  Phone,
  Rocket,
  Sparkles,
  Store,
  Users,
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
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatBox({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
      <Icon className="w-5 h-5 text-sky-200" />
      <p className="mt-3 text-2xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/70 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function PriceCard({
  title,
  price,
  badge,
  features,
  highlight = false,
}: {
  title: string;
  price: string;
  badge: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-7 shadow-sm h-full flex flex-col ${
        highlight
          ? "border-sky-300 bg-white"
          : "border-gray-100 bg-white dark:bg-gray-950 dark:border-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs font-semibold inline-flex items-center px-3 py-1 rounded-full border ${
              highlight
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {badge}
          </p>
          <h3
            className={`mt-4 text-lg font-extrabold ${
              highlight ? "text-gray-900" : "text-gray-900 dark:text-white"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-2 text-3xl font-extrabold ${
              highlight ? "text-sky-700" : "text-[#F97316]"
            }`}
          >
            {price}
          </p>
        </div>
        <Sparkles className={highlight ? "w-6 h-6 text-sky-500" : "w-6 h-6 text-[#F97316]"} />
      </div>

      <ul className="mt-6 space-y-2.5 text-sm text-gray-700 dark:text-gray-200 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`mt-7 w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
          highlight
            ? "bg-sky-700 hover:bg-sky-800 text-white"
            : "bg-[#F97316] hover:bg-[#ea580c] text-white"
        }`}
      >
        Get Started
      </button>
      <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
        Our team will contact you within 24 hours.
      </p>
    </div>
  );
}

export default function BrandsPage() {
  type Inquiry = {
    companyName: string;
    brand: string;
    contactPerson: string;
    phone: string;
    email: string;
    requirement: string;
  };

  const [inquiry, setInquiry] = useState<Inquiry>({
    companyName: "",
    brand: "",
    contactPerson: "",
    phone: "",
    email: "",
    requirement: "",
  });

  const [trainingInquiry, setTrainingInquiry] = useState({
    company: "",
    productCategory: "",
    languages: "Hindi, Telugu, Tamil, Kannada",
    notes: "",
  });

  const [dealerInquiry, setDealerInquiry] = useState({
    businessName: "",
    city: "",
    phone: "",
    brands: "",
  });

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-[#071a33]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="blue-grid" x="0" y="0" width="92" height="92" patternUnits="userSpaceOnUse">
                <rect x="32" y="0" width="8" height="92" rx="4" fill="white" />
                <rect x="0" y="32" width="92" height="8" rx="4" fill="white" />
                <circle cx="36" cy="36" r="6" fill="none" stroke="white" strokeWidth="3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blue-grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/15 via-transparent to-indigo-500/10 pointer-events-none" aria-hidden="true" />

        <div className="container-pg relative py-16 sm:py-20">
          <FadeUp>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90">
                  <Megaphone className="w-4 h-4 text-sky-200" />
                  Brand Partnerships
                </span>
                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Apne Brand ko{" "}
                  <span className="text-sky-200">India ke 50,000 Plumbers</span>{" "}
                  tak pahunchao
                </h1>
                <p className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed">
                  Faucet, pipe, valve, pump aur plumbing brands ke liye: targeted reach,
                  trust-building training, and measurable lead generation.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Partner with us
                  </a>
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center rounded-xl border border-white/25 text-white hover:bg-white/10 font-semibold px-6 py-3 transition-colors"
                  >
                    Talk to support
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                <StatBox icon={Users} value="50,000+" label="Plumbers" />
                <StatBox icon={Building2} value="500+" label="Cities" />
                <StatBox icon={Globe} value="6" label="Languages" />
                <StatBox icon={Headphones} value="24×7" label="Active" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2. Why Advertise */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Why advertise on Plumber Guru?
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              We connect brands with working plumbers through learning, tools, and
              job demand — not just impressions.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: BarChart3, title: "High-intent reach", desc: "Plumbers actively using tools, training & jobs." },
              { icon: Rocket, title: "Faster adoption", desc: "Training + field demos accelerate product usage." },
              { icon: Package, title: "Product trust", desc: "Verified listings reduce counterfeit risk." },
              { icon: Factory, title: "Dealer connects", desc: "Connect with distributors, retailers & builders." },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <FadeUp key={b.title} delay={i * 0.06}>
                  <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-900/20">
                      <Icon className="w-6 h-6 text-sky-700 dark:text-sky-300" />
                    </span>
                    <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {b.desc}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Partnership options */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Partnership Options
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Choose a plan that fits your launch or growth goals.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FadeUp>
              <PriceCard
                title="Basic"
                price="Free"
                badge="Starter"
                features={[
                  "Brand listing",
                  "Logo on directory",
                  "Basic analytics (views)",
                  "Email support",
                ]}
              />
            </FadeUp>
            <FadeUp delay={0.05}>
              <PriceCard
                title="Standard"
                price="₹9,999 / month"
                badge="Most popular"
                highlight
                features={[
                  "Banner ads",
                  "Training video branding",
                  "Priority listing",
                  "Monthly performance report",
                ]}
              />
            </FadeUp>
            <FadeUp delay={0.1}>
              <PriceCard
                title="Premium"
                price="₹24,999 / month"
                badge="Growth"
                features={[
                  "Dedicated brand page",
                  "Lead generation",
                  "Warranty integration",
                  "Quarterly co-marketing plan",
                ]}
              />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 4. Training Partnership */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Your product ki training hum karein
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Create professional product trainings in multiple languages and reach plumbers at scale.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-7">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Company
                  </label>
                  <input
                    value={trainingInquiry.company}
                    onChange={(e) => setTrainingInquiry((p) => ({ ...p, company: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                    placeholder="e.g. ABC Pipes Pvt Ltd"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Product category
                  </label>
                  <input
                    value={trainingInquiry.productCategory}
                    onChange={(e) => setTrainingInquiry((p) => ({ ...p, productCategory: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                    placeholder="Faucets / Pipes / Valves / Pumps"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Languages
                  </label>
                  <input
                    value={trainingInquiry.languages}
                    onChange={(e) => setTrainingInquiry((p) => ({ ...p, languages: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Notes
                  </label>
                  <textarea
                    value={trainingInquiry.notes}
                    onChange={(e) => setTrainingInquiry((p) => ({ ...p, notes: e.target.value }))}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm resize-none"
                    placeholder="Training scope, product SKUs, desired outcomes..."
                  />
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    We’ll share a training plan + timeline within 48 hours.
                  </p>
                  <button
                    type="button"
                    className="rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Submit inquiry
                  </button>
                </div>
              </form>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 5. Dealer & Distributor Connect */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Dealer &amp; Distributor Connect
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Register your dealership and connect with plumber demand in your city.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <FadeUp>
              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm h-full">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-3">
                  <Map className="w-5 h-5 text-[#F97316]" />
                  Map (placeholder)
                </div>
                <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <div className="text-center">
                    <p className="font-semibold">India map preview</p>
                    <p className="text-xs opacity-70 mt-1">
                      Dealer pins coming soon
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.05}>
              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Store className="w-5 h-5 text-[#F97316]" />
                  <p className="font-extrabold text-gray-900 dark:text-white">
                    Register your dealership
                  </p>
                </div>
                <form className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Business name
                    </label>
                    <input
                      value={dealerInquiry.businessName}
                      onChange={(e) => setDealerInquiry((p) => ({ ...p, businessName: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                      placeholder="e.g. Gupta Sanitary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      City
                    </label>
                    <input
                      value={dealerInquiry.city}
                      onChange={(e) => setDealerInquiry((p) => ({ ...p, city: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                      placeholder="e.g. Jaipur"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Phone
                    </label>
                    <input
                      value={dealerInquiry.phone}
                      onChange={(e) => setDealerInquiry((p) => ({ ...p, phone: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                      placeholder="+91..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Brands you stock
                    </label>
                    <input
                      value={dealerInquiry.brands}
                      onChange={(e) => setDealerInquiry((p) => ({ ...p, brands: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm"
                      placeholder="Brand A, Brand B..."
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Register dealership
                  </button>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 6. Contact form */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-950">
        <div className="container-pg">
          <FadeUp className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Contact for Partnerships
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Share your requirement — listings, ads, training partnerships, dealer network, or warranty integration.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-7">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                  { key: "companyName", label: "Company name", icon: Building2, placeholder: "Company Pvt Ltd" },
                  { key: "brand", label: "Brand", icon: Package, placeholder: "Brand name" },
                  { key: "contactPerson", label: "Contact person", icon: Users, placeholder: "Name" },
                  { key: "phone", label: "Phone", icon: Phone, placeholder: "+91..." },
                  { key: "email", label: "Email", icon: Globe, placeholder: "name@company.com" },
                ] as Array<{
                  key: Exclude<keyof Inquiry, "requirement">;
                  label: string;
                  icon: React.ElementType;
                  placeholder: string;
                }>
                ).map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {f.label}
                      </label>
                      <div className="relative mt-1">
                        <Icon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          value={inquiry[f.key]}
                          onChange={(e) => setInquiry((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-11 pr-4 py-3 text-sm"
                          placeholder={f.placeholder}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Requirement
                  </label>
                  <textarea
                    value={inquiry.requirement}
                    onChange={(e) => setInquiry((p) => ({ ...p, requirement: e.target.value }))}
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm resize-none"
                    placeholder="What are you looking for? (Ads / Training / Lead gen / Warranty / Dealer connect...)"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Prefer WhatsApp? Mention your number and best time to call.
                  </p>
                  <button
                    type="button"
                    className="rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold px-7 py-3 transition-colors"
                  >
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

