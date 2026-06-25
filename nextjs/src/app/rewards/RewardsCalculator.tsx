"use client";

import { calculatePointsEarned, POINTS_PROGRAM_SUMMARY } from "@/lib/rewards-config";

export default function RewardsCalculator() {
  return (
    <div className="bg-white border border-border p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-secondary mb-3">
        Earnings Calculator
      </p>
      <p className="text-sm text-copy-muted mb-2">
        Enter a <strong>full-price</strong> product amount (Rand) to see what you&apos;d earn from 1 July 2026:
      </p>
      <p className="text-xs text-copy-muted mb-4">{POINTS_PROGRAM_SUMMARY}</p>
      <input
        type="number"
        placeholder="e.g. 11000"
        defaultValue="0"
        onChange={(e) => {
          const val = parseFloat(e.target.value) || 0;
          const points = calculatePointsEarned(val);
          const value = points * 0.05;
          const el = e.target.nextElementSibling as HTMLElement | null;
          if (el) el.textContent = points.toLocaleString("en-ZA") + " points (R" + value.toFixed(2) + ")";
        }}
        className="w-full border border-border px-4 py-2 mb-3 text-sm"
      />
      <div className="text-sm font-bold text-primary">
        0 points (R0.00)
      </div>
    </div>
  );
}
