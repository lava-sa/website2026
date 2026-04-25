"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatZAR, formatNumber } from "@/lib/format";
import type { DashboardStats } from "@/lib/admin-dashboard-stats";

const POLL_MS = 60_000;

export default function DisplayClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [err, setErr] = useState("");
  const [at, setAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/stats", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error ?? "Could not load stats");
      setStats(null);
      return;
    }
    setErr("");
    setStats(data as DashboardStats);
    setAt(new Date());
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  if (err && !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-300 font-bold mb-4">{err}</p>
        <Link href="/admin/login" className="text-secondary underline text-sm">
          Admin login
        </Link>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/60 text-lg font-bold">
        Loading…
      </div>
    );
  }

  const tiles = [
    { label: "Total revenue (all-time)", value: formatZAR(stats.totalRevenue), accent: "from-emerald-500/30" },
    { label: "This month", value: formatZAR(stats.revenueThisMonth), sub: `${stats.ordersThisMonth} orders`, accent: "from-secondary/30" },
    { label: "Orders (all)", value: formatNumber(stats.totalOrders), accent: "from-sky-500/20" },
    { label: "Customers", value: formatNumber(stats.customerCount), sub: `Avg order ${formatZAR(stats.avgOrderValue)}`, accent: "from-amber-500/20" },
    { label: "2026 YTD", value: formatZAR(stats.revenue2026), accent: "from-primary/40" },
    { label: "2025", value: formatZAR(stats.revenue2025), accent: "from-white/10" },
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary mb-2">Lava-SA</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Live numbers</h1>
          <p className="text-xs text-white/45 mt-1">
            Refreshes every minute · {at ? at.toLocaleString("en-ZA") : "—"}
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-white/50 hover:text-white border border-white/15 px-3 py-2"
        >
          Full admin →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1">
        {tiles.map((t) => (
          <div
            key={t.label}
            className={`rounded-2xl bg-gradient-to-br ${t.accent} to-white/[0.04] border border-white/10 p-6 md:p-8 flex flex-col justify-center min-h-[140px]`}
          >
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
              {t.label}
            </p>
            <p className="text-3xl md:text-5xl font-black tabular-nums tracking-tight text-white">{t.value}</p>
            {t.sub && <p className="text-sm text-white/45 mt-2 font-medium">{t.sub}</p>}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-white/30 mt-8 text-center">
        Revenue includes paid / completed current orders plus wc-completed, wc-processing, wc-on-hold historical rows.
      </p>
    </div>
  );
}
