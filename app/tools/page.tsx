"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Users, Wrench, Calculator } from "lucide-react";
import { InvoiceGenerator } from "@/components/tools/InvoiceGenerator";
import { QuotationTemplate } from "@/components/tools/QuotationTemplate";
import { CustomerDatabase } from "@/components/tools/CustomerDatabase";
import { MaterialCalculator } from "@/components/tools/MaterialCalculator";

type ToolTab = "invoice" | "quote" | "customers" | "calculator";

export default function ToolsPage() {
  const [tab, setTab] = useState<ToolTab>("invoice");

  const tabs: { id: ToolTab; label: string; icon: React.ElementType }[] = [
    { id: "invoice", label: "Invoice", icon: FileText },
    { id: "quote", label: "Quotation", icon: FileText },
    { id: "customers", label: "Customers", icon: Users },
    { id: "calculator", label: "Calculator", icon: Calculator },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] pb-10">
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container-pg py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20">
                <Wrench className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Digital Tools
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                  Daily ka kaam easy banao — invoices, quotes, customers aur material
                  planning ek hi jagah.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-orange-300 bg-orange-50 dark:bg-orange-900/20 px-4 py-3 flex items-center gap-3">
              <div className="text-xs text-orange-800 dark:text-orange-200">
                <p className="font-semibold">Pro Tools (coming soon)</p>
                <p className="text-[11px]">
                  GST filing, inventory tracking, and income reports — made for plumbers.
                </p>
              </div>
            </div>
          </div>

          {/* Tool tabs */}
          <div className="mt-6 inline-flex rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    active
                      ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  type="button"
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="tools-tab-indicator"
                      className="absolute inset-0 rounded-xl border border-orange-200 dark:border-orange-800 pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-pg space-y-8">
          {tab === "invoice" && <InvoiceGenerator />}
          {tab === "quote" && <QuotationTemplate />}
          {tab === "customers" && <CustomerDatabase />}
          {tab === "calculator" && <MaterialCalculator />}
        </div>
      </section>
    </div>
  );
}

