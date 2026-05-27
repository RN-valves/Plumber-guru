"use client";

import { useMemo, useState } from "react";
import { Calculator, Ruler, IndianRupee } from "lucide-react";

type WorkType = "Bathroom" | "Kitchen" | "Full house";

function estimateMaterials(length: number, width: number, workType: WorkType) {
  const area = Math.max(length, 0) * Math.max(width, 0); // in m²

  let pipePerSqm = 1.4; // meters of pipe per m² as baseline
  let fittingsPerSqm = 0.9;
  let costPerMeter = 120; // ₹ per meter of pipe + avg fittings cost

  if (workType === "Bathroom") {
    pipePerSqm = 1.6;
    fittingsPerSqm = 1.2;
    costPerMeter = 130;
  } else if (workType === "Kitchen") {
    pipePerSqm = 1.2;
    fittingsPerSqm = 0.8;
    costPerMeter = 115;
  } else if (workType === "Full house") {
    pipePerSqm = 1.8;
    fittingsPerSqm = 1.4;
    costPerMeter = 110;
  }

  const pipes = area * pipePerSqm;
  const fittings = area * fittingsPerSqm;
  const approxCost = pipes * costPerMeter;

  return {
    area,
    pipes,
    fittings,
    approxCost,
  };
}

export function MaterialCalculator() {
  const [length, setLength] = useState(3);
  const [width, setWidth] = useState(3);
  const [workType, setWorkType] = useState<WorkType>("Bathroom");

  const result = useMemo(
    () => estimateMaterials(length || 0, width || 0, workType),
    [length, width, workType],
  );

  return (
    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm space-y-6">
      <div className="flex items-start gap-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-900/20">
          <Calculator className="w-5 h-5 text-[#F97316]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Material Calculator
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Rough estimate of pipes, fittings and cost based on room size.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Length (meters)
          </label>
          <div className="relative mt-1">
            <Ruler className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={0}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Width (meters)
          </label>
          <div className="relative mt-1">
            <Ruler className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min={0}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Work type
          </label>
          <div className="mt-1 flex gap-2">
            {(["Bathroom", "Kitchen", "Full house"] as WorkType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setWorkType(t)}
                className={`flex-1 rounded-xl border px-2 py-2 text-[11px] font-semibold transition-colors ${
                  workType === t
                    ? "border-[#F97316] bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-orange-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Room area
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {result.area.toFixed(1)} m²
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Pipes needed
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {result.pipes.toFixed(1)} m
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Fittings (approx)
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {Math.round(result.fittings)} pcs
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Approx material cost
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white inline-flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />
            {result.approxCost.toFixed(0)}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
        Based on standard plumbing assumptions. Always confirm with actual site
        conditions and material choices.
      </p>
    </div>
  );
}

