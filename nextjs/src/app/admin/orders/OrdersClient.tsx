"use client";

import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

const STATUS_COLOURS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  paid:       "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
  refunded:   "bg-gray-100 text-gray-600",
};

const ALL_STATUSES = ["pending","paid","processing","shipped","delivered","cancelled","refunded"];

type Order = {
  id: string; order_number: string;
  first_name: string; last_name: string; email: string;
  total: number; status: string; created_at: string;
  payment_method?: string | null;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 }).format(n);
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}
function exportCSV(rows: Order[]) {
  const headers = ["Order #","Customer","Email","Date","Total","Status","Payment Method"];
  const lines = [
    headers.join(","),
    ...rows.map((o) => [
      o.order_number, `${o.first_name} ${o.last_name}`, o.email,
      fmtDate(o.created_at), o.total, o.status, o.payment_method ?? "payfast"
    ].map((v) => `"${String(v).replace(/"/g,'""')}"`).join(","))
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = "lava-sa-orders.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState("all");
  const [sortBy,    setSortBy]    = useState<"date_desc"|"date_asc"|"total_desc"|"total_asc">("date_desc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!q) return true;
      return (
        o.order_number?.toLowerCase().includes(q) ||
        o.first_name?.toLowerCase().includes(q)  ||
        o.last_name?.toLowerCase().includes(q)   ||
        o.email?.toLowerCase().includes(q)
      );
    });
    rows = [...rows].sort((a, b) => {
      if (sortBy === "date_desc")  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "date_asc")   return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "total_desc") return b.total - a.total;
      if (sortBy === "total_asc")  return a.total - b.total;
      return 0;
    });
    return rows;
  }, [orders, search, status, sortBy]);

  const revenue = filtered
    .filter((o) => !["cancelled","refunded"].includes(o.status))
    .reduce((s, o) => s + (o.total ?? 0), 0);

  // Status counts for filter pills
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: orders.length };
    orders.forEach((o) => { m[o.status] = (m[o.status] ?? 0) + 1; });
    return m;
  }, [orders]);

  const selectCls = "border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} orders shown · Revenue: {fmt(revenue)}
          </p>
        </div>
        <button onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-xs font-bold px-4 py-2.5 hover:border-primary hover:text-primary transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV ({filtered.length})
        </button>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...ALL_STATUSES].map((s) => (
          counts[s] !== undefined && (
            <button key={s} onClick={() => setStatus(s)}
              className={`text-xs font-bold px-3 py-1.5 transition-colors capitalize ${
                status === s
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              }`}>
              {s === "all" ? "All" : s} ({counts[s] ?? 0})
            </button>
          )
        ))}
      </div>

      {/* Search + Sort */}
      <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name or email…"
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className={selectCls}>
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="total_desc">Highest value first</option>
          <option value="total_asc">Lowest value first</option>
        </select>
        {(search || status !== "all") && (
          <button onClick={() => { setSearch(""); setStatus("all"); }}
            className="text-xs text-gray-400 hover:text-primary transition-colors">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Order #","Customer","Date","Total","Payment","Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs font-bold text-primary">{o.order_number ?? o.id.slice(0,8).toUpperCase()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{o.first_name} {o.last_name}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{fmtDate(o.created_at)}</td>
                  <td className="px-5 py-4 font-bold text-gray-900">{fmt(o.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                      o.payment_method === "bank_transfer"
                        ? "bg-petrol-50 text-primary border border-petrol-100"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {o.payment_method === "bank_transfer" ? "EFT" : "PayFast"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 self-start ${STATUS_COLOURS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {o.status}
                      </span>
                      <OrderStatusSelect orderId={o.id} current={o.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">No orders match your search.</div>
        )}
      </div>
    </div>
  );
}
