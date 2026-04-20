"use client";

export default function RewardsCalculator() {
  return (
    <div className="bg-white border border-border p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-secondary mb-3">
        Earnings Calculator
      </p>
      <p className="text-sm text-copy-muted mb-4">
        Enter any product price to see what you&apos;d earn:
      </p>
      <input
        type="number"
        placeholder="e.g. 1900"
        defaultValue="0"
        onChange={(e) => {
          const val = parseFloat(e.target.value) || 0;
          const points = Math.floor(val / 5);
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
