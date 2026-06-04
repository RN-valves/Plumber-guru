"use client";

import { useEffect, useMemo, useState } from "react";
import { Phone, Plus, Search, Upload, FileDown } from "lucide-react";
import { useRequireAuthAction } from "@/lib/requireAuthAction";

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  lastServiceDate: string;
  notes: string;
};

const STORAGE_KEY = "pg_customer_db_v1";

function parseDate(value: string) {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

export function CustomerDatabase() {
  const requireAuthAction = useRequireAuthAction();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    lastServiceDate: "",
    notes: "",
  });

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Customer[];
      if (Array.isArray(parsed)) {
        setCustomers(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = customers;
    if (q.length > 0) {
      list = list.filter((c) =>
        `${c.name} ${c.phone} ${c.address} ${c.notes}`.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      const da = parseDate(a.lastServiceDate);
      const db = parseDate(b.lastServiceDate);
      return sortDesc ? db - da : da - db;
    });
    return list;
  }, [customers, search, sortDesc]);

  const handleAddCustomer = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const c: Customer = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      lastServiceDate: form.lastServiceDate,
      notes: form.notes.trim(),
    };
    setCustomers((prev) => [c, ...prev]);
    setForm({
      name: "",
      phone: "",
      address: "",
      lastServiceDate: "",
      notes: "",
    });
  };

  const handleExportCsv = () => {
    if (typeof window === "undefined" || customers.length === 0) return;
    const header = [
      "Name",
      "Phone",
      "Address",
      "Last Service Date",
      "Notes",
    ];
    const rows = customers.map((c) => [
      c.name,
      c.phone,
      c.address.replace(/\n/g, " "),
      c.lastServiceDate,
      c.notes.replace(/\n/g, " "),
    ]);
    const csv =
      [header, ...rows]
        .map((r) =>
          r
            .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "plumber-customers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Customer Database
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Save repeat customers and track last service date.
            </p>
          </div>
          <button
            type="button"
            onClick={() => requireAuthAction(handleExportCsv)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Last service date
            </label>
            <input
              type="date"
              value={form.lastServiceDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastServiceDate: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => requireAuthAction(handleAddCustomer)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold text-xs px-4 py-2.5 w-full"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/20">
              <Upload className="w-4 h-4 text-[#F97316]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Saved Customers
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {customers.length} total
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, area..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <button
              type="button"
              onClick={() => setSortDesc((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-[11px] font-semibold text-gray-700 dark:text-gray-200 hover:border-[#F97316] hover:text-[#F97316]"
            >
              Sort by date{" "}
              <span className="text-[10px]">
                {sortDesc ? "↓ Newest" : "↑ Oldest"}
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                  Phone
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                  Area
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">
                  Last service
                </th>
                <th className="px-3 py-2 text-right font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/60"
                >
                  <td className="px-3 py-2 align-top">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {c.name}
                    </div>
                    {c.notes && (
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                        {c.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top text-gray-800 dark:text-gray-100">
                    {c.phone}
                  </td>
                  <td className="px-3 py-2 align-top text-gray-600 dark:text-gray-300">
                    {c.address}
                  </td>
                  <td className="px-3 py-2 align-top text-gray-600 dark:text-gray-300">
                    {c.lastServiceDate || "—"}
                  </td>
                  <td className="px-3 py-2 align-top text-right">
                    <div className="inline-flex gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-[10px] font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          requireAuthAction(() => {
                            // Invoice creation flow can be added after backend integration.
                          });
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-[10px] font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        New Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    No customers saved yet. Add your first customer above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

