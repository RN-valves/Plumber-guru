"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Printer, MessageCircle } from "lucide-react";

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  rate: number;
};

function formatCurrency(n: number) {
  if (Number.isNaN(n)) return "₹0";
  return `₹${n.toFixed(2)}`;
}

export function InvoiceGenerator() {
  const [plumberName, setPlumberName] = useState("Plumber Guru Partner");
  const [plumberPhone, setPlumberPhone] = useState("+91-9xxxx-xxxxx");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [gstRegistered, setGstRegistered] = useState(true);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
      0,
    );
    const gst = gstRegistered ? subtotal * 0.18 : 0;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  }, [items, gstRegistered]);

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeRow = (id: number) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((i) => i.id !== id)));
  };

  const updateItem = (id: number, patch: Partial<InvoiceItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleWhatsApp = () => {
    if (typeof window === "undefined") return;
    const summaryLines = [
      `Invoice for ${customerName || "Customer"}`,
      `Date: ${invoiceDate}`,
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
      `Subtotal: ${formatCurrency(totals.subtotal)}`,
      gstRegistered ? `GST (18%): ${formatCurrency(totals.gst)}` : "",
      `Total: ${formatCurrency(totals.total)}`,
    ].filter(Boolean);

    const text = encodeURIComponent(summaryLines.join("\n"));
    const phone = customerPhone.replace(/[^0-9]/g, "");
    const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
    window.open(`${base}?text=${text}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8">
      {/* Form */}
      <div className="no-print rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Invoice Generator
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Quick invoice tool — best viewed on tablet or desktop when printing.
          </p>
        </div>

        {/* Plumber header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Plumber name
            </label>
            <input
              value={plumberName}
              onChange={(e) => setPlumberName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Plumber phone
            </label>
            <input
              value={plumberPhone}
              onChange={(e) => setPlumberPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        {/* Customer + date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
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
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Address
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Invoice date
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </div>

        {/* GST toggle */}
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              GST
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              18% GST will be added when registered.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGstRegistered((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
              gstRegistered
                ? "bg-[#F97316] border-[#F97316]"
                : "bg-gray-300 border-gray-300"
            }`}
            aria-pressed={gstRegistered}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                gstRegistered ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Items table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              Line items
            </p>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-[11px] font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add row
            </button>
          </div>

          <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-2">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
            <span />
          </div>

          <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
            {items.map((item) => {
              const amount =
                (Number(item.quantity) || 0) * (Number(item.rate) || 0);
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr_auto] gap-2 items-start rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 md:p-1"
                >
                  <div className="md:px-1">
                    <input
                      placeholder="Work description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                  </div>
                  <div className="flex items-center md:justify-end gap-1 md:px-1">
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
                  <div className="flex items-center md:justify-end gap-1 md:px-1">
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
                  <div className="flex items-center justify-between md:justify-end gap-1 md:px-1">
                    <span className="md:hidden text-[11px] text-gray-500">
                      Amount
                    </span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Tip: Use desktop or landscape mode on mobile for better print layout.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-[#F97316] hover:text-[#F97316]"
            >
              <Printer className="w-4 h-4" />
              Download PDF (Print)
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebc59] text-white px-4 py-2.5 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm print:w-full print:border-none print:shadow-none">
        <div className="max-w-lg mx-auto print:max-w-full print:text-black">
          <header className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                TAX INVOICE
              </h1>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Generated via Plumber Guru Digital Tools
              </p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-gray-900 dark:text-white">{plumberName}</p>
              <p className="text-gray-600 dark:text-gray-300">{plumberPhone}</p>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-4 text-xs mb-4">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                Bill To:
              </p>
              <p className="mt-1 text-gray-800 dark:text-gray-100">
                {customerName || "Customer name"}
              </p>
              {customerPhone && (
                <p className="text-gray-600 dark:text-gray-300">{customerPhone}</p>
              )}
              {customerAddress && (
                <p className="mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {customerAddress}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                Invoice Date
              </p>
              <p className="mt-1 text-gray-800 dark:text-gray-100">
                {invoiceDate || "—"}
              </p>
              <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                GST Registered: {gstRegistered ? "Yes (18%)" : "No"}
              </p>
            </div>
          </section>

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

          <div className="flex flex-col items-end text-xs gap-1 mb-4">
            <div className="flex justify-between gap-6 w-full max-w-xs">
              <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
            {gstRegistered && (
              <div className="flex justify-between gap-6 w-full max-w-xs">
                <span className="text-gray-600 dark:text-gray-300">GST 18%</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(totals.gst)}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-6 w-full max-w-xs border-t border-gray-200 dark:border-gray-800 pt-1 mt-1">
              <span className="text-gray-800 dark:text-gray-100 font-semibold">
                Total
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Note: This is a simple invoice generated by Plumber Guru tools. Please
            confirm local tax rules with your accountant.
          </p>
        </div>
      </div>
    </div>
  );
}

