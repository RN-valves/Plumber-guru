"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MessageCircle, Printer } from "lucide-react";
import { useRequireAuthAction } from "@/lib/requireAuthAction";

type QuoteItem = {
  id: number;
  description: string;
  quantity: number;
  rate: number;
};

function formatCurrency(n: number) {
  if (Number.isNaN(n)) return "₹0";
  return `₹${n.toFixed(2)}`;
}

export function QuotationTemplate() {
  const requireAuthAction = useRequireAuthAction();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [validTill, setValidTill] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
      0,
    );
    return { subtotal };
  }, [items]);

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, description: "", quantity: 1, rate: 0 },
    ]);
  };

  const updateItem = (id: number, patch: Partial<QuoteItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleWhatsApp = () => {
    if (typeof window === "undefined") return;
    const summaryLines = [
      `Quotation for ${customerName || "Customer"}`,
      `Valid till: ${validTill}`,
      ``,
      ...items
        .filter((i) => i.description.trim().length > 0)
        .map(
          (i) =>
            `• ${i.description} — Qty ${i.quantity} × ₹${i.rate} = ₹${(
              (Number(i.quantity) || 0) * (Number(i.rate) || 0)
            ).toFixed(2)}`,
        ),
      ``,
      `Estimated total: ${formatCurrency(totals.subtotal)}`,
    ];

    const text = encodeURIComponent(summaryLines.join("\n"));
    const phone = customerPhone.replace(/[^0-9]/g, "");
    const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
    window.open(`${base}?text=${text}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8">
      {/* Form side */}
      <div className="no-print rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Quotation Template
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Estimate for customers before work starts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Customer name
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Customer phone
            </label>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Quote valid till
            </label>
            <div className="relative mt-1">
              <CalendarDays className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              Items
            </p>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-[11px] font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
            >
              + Add row
            </button>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
            {items.map((item) => {
              const amount =
                (Number(item.quantity) || 0) * (Number(item.rate) || 0);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr] gap-2 items-start rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 md:p-1"
                >
                  <div>
                    <input
                      placeholder="Work description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                  </div>
                  <div className="flex items-center gap-1 md:justify-end">
                    <span className="md:hidden text-[11px] text-gray-500">
                      Qty
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: Number(e.target.value) })
                      }
                      className="w-20 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1.5 text-xs text-right text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                  </div>
                  <div className="flex items-center gap-1 md:justify-end">
                    <span className="md:hidden text-[11px] text-gray-500">
                      Rate
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, { rate: Number(e.target.value) })
                      }
                      className="w-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2 py-1.5 text-xs text-right text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-1">
                    <span className="md:hidden text-[11px] text-gray-500">
                      Amount
                    </span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            This is only an estimate. Final billing depends on actual work.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => requireAuthAction(handlePrint)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
            >
              <Printer className="w-4 h-4" />
              Generate Quote (Print)
            </button>
            <button
              type="button"
              onClick={() => requireAuthAction(handleWhatsApp)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebc59] text-white px-4 py-2.5 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Share Quote on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Preview side */}
      <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm">
        <div className="max-w-lg mx-auto text-[11px]">
          <header className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                QUOTATION
              </h1>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Generated via Plumber Guru
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                For: {customerName || "Customer"}
              </p>
              {customerPhone && (
                <p className="text-gray-600 dark:text-gray-300">{customerPhone}</p>
              )}
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                Valid till: {validTill || "—"}
              </p>
            </div>
          </header>

          <table className="w-full text-[11px] border-collapse mb-4">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-left">
                  Description
                </th>
                <th className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-right">
                  Qty
                </th>
                <th className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-right">
                  Rate
                </th>
                <th className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const amount =
                  (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id}>
                    <td className="border border-gray-200 dark:border-gray-800 px-2 py-1 align-top">
                      {item.description || <span className="text-gray-400">Work item</span>}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-right align-top">
                      {item.quantity || ""}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-right align-top">
                      {item.rate ? `₹${item.rate.toFixed(2)}` : ""}
                    </td>
                    <td className="border border-gray-200 dark:border-gray-800 px-2 py-1 text-right align-top">
                      {amount ? `₹${amount.toFixed(2)}` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex flex-col items-end text-xs mb-4">
            <div className="flex justify-between gap-6 w-full max-w-xs border-t border-gray-200 dark:border-gray-800 pt-1 mt-1">
              <span className="text-gray-800 dark:text-gray-100 font-semibold">
                Estimated total
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            This quotation is based on current material and labour rates. Any change in
            scope or material quality may change the final amount.
          </p>
        </div>
      </div>
    </div>
  );
}

