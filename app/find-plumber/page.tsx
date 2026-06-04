"use client";

import Link from "next/link";
import { MapPin, Search, Shield, Star } from "lucide-react";
import { useRequireAuthAction } from "@/lib/requireAuthAction";

const PLUMBERS = [
  {
    name: "Ramesh Kumar",
    city: "Delhi",
    rating: 4.8,
    jobs: 120,
    verified: true,
  },
  {
    name: "Suresh Patil",
    city: "Mumbai",
    rating: 4.6,
    jobs: 89,
    verified: true,
  },
  {
    name: "Venkat Reddy",
    city: "Hyderabad",
    rating: 4.9,
    jobs: 156,
    verified: true,
  },
];

export default function FindPlumberPage() {
  const requireAuthAction = useRequireAuthAction();

  return (
    <main className="pb-16">
      <section className="bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 sm:py-16">
        <div className="container-pg">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Find a Verified Plumber
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
            Search certified plumbers near you. All profiles are verified on
            Plumber Guru.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="City or pincode..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </div>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-[#F97316] text-white font-semibold hover:bg-[#ea580c] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="container-pg py-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Plumbers near you
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLUMBERS.map((p) => (
            <article
              key={p.name}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:border-orange-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {p.name}
                </h3>
                {p.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                {p.city}
              </p>
              <p className="flex items-center gap-1 text-sm text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {p.rating} · {p.jobs} jobs
              </p>
              <button
                type="button"
                onClick={() => {
                  requireAuthAction(() => {
                    // Lead creation comes after auth integration.
                  });
                }}
                className="mt-4 w-full py-2.5 rounded-lg border border-[#F97316] text-[#F97316] font-medium hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
              >
                Contact
              </button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          Are you a plumber?{" "}
          <Link href="/auth/register" className="text-[#F97316] font-medium hover:underline">
            Register on Plumber Guru
          </Link>
        </p>
      </section>
    </main>
  );
}
