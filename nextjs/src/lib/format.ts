/**
 * Centralised formatting utilities for currency, dates, and numbers.
 * Used across admin dashboard, order tables, and product pages.
 */

/** Format a ZAR amount: R1,234 (no decimals by default) */
export function formatZAR(n: number, opts?: { decimals?: number }) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: opts?.decimals ?? 0,
    maximumFractionDigits: opts?.decimals ?? 0,
  }).format(n);
}

/** Compact ZAR for charts: R1.2k, R3.4M */
export function formatZARCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `R${(n / 1_000).toFixed(1)}k`;
  return `R${Math.round(n)}`;
}

/** Format a date: 18 Apr 2026 */
export function formatDate(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Short month label for charts: Jan, Feb, etc */
export function formatMonthShort(date: Date) {
  return date.toLocaleDateString("en-ZA", { month: "short" });
}

/** Month + year: Jan 2026 */
export function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-ZA", { month: "short", year: "numeric" });
}

/** Format a number with commas: 1,234 */
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-ZA").format(n);
}

/** Format percentage: 4.98 -> "4.98%" */
export function formatPercent(n: number, decimals = 1) {
  return `${n.toFixed(decimals)}%`;
}
