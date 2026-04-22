"use client";

import { useState, useMemo } from "react";
import { Download, Search, Mail, Star, Users, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type SortKey = "name" | "email" | "city" | "total_spent" | "order_count" | "points_balance" | "last_order_date";
type SortDir = "asc" | "desc";

interface Customer {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  city?: string | null;
  province?: string | null;
  total_spent?: number | null;
  order_count?: number | null;
  points_balance?: number | null;
  is_vip?: boolean | null;
  marketing_opt_in?: boolean | null;
  registered_at?: string | null;
  last_order_date?: string | null;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function exportCSV(rows: Customer[], newsletterOnly: boolean) {
  const data = newsletterOnly ? rows.filter((r) => r.marketing_opt_in !== false) : rows;

  const headers = ["Email", "First Name", "Last Name", "Phone", "City", "Province",
                   "Total Spent (R)", "Orders", "Points Balance", "VIP", "Last Order"];

  const lines = [
    headers.join(","),
    ...data.map((r) => [
      r.email,
      r.first_name ?? "",
      r.last_name  ?? "",
      r.phone      ?? "",
      r.billing_city  ?? r.city     ?? "",
      r.billing_state ?? r.province ?? "",
      r.total_spent   ?? 0,
      r.order_count   ?? 0,
      r.points_balance ?? 0,
      r.is_vip ? "Yes" : "No",
      fmtDate(r.last_order_date),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = newsletterOnly ? "lava-sa-newsletter-list.csv" : "lava-sa-all-customers.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const [search,        setSearch]        = useState("");
  const [vipOnly,       setVipOnly]       = useState(false);
  const [marketingOnly, setMarketingOnly] = useState(false);
  const [sortKey,       setSortKey]       = useState<SortKey>("total_spent");
  const [sortDir,       setSortDir]       = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-30 inline ml-1" />;
    return sortDir === "asc"
      ? <ChevronUp   className="h-3 w-3 text-primary inline ml-1" />
      : <ChevronDown className="h-3 w-3 text-primary inline ml-1" />;
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = customers.filter((c) => {
      if (vipOnly       && !c.is_vip)                      return false;
      if (marketingOnly && c.marketing_opt_in === false)   return false;
      if (!q) return true;
      return (
        c.email?.toLowerCase().includes(q) ||
        c.first_name?.toLowerCase().includes(q) ||
        c.last_name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        (c.billing_city ?? c.city ?? "").toLowerCase().includes(q)
      );
    });

    rows = [...rows].sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sortKey === "name") {
        av = `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim().toLowerCase();
        bv = `${b.first_name ?? ""} ${b.last_name ?? ""}`.trim().toLowerCase();
      } else if (sortKey === "email") {
        av = a.email?.toLowerCase() ?? "";
        bv = b.email?.toLowerCase() ?? "";
      } else if (sortKey === "city") {
        av = (a.billing_city ?? a.city ?? "").toLowerCase();
        bv = (b.billing_city ?? b.city ?? "").toLowerCase();
      } else if (sortKey === "total_spent") {
        av = a.total_spent ?? 0; bv = b.total_spent ?? 0;
      } else if (sortKey === "order_count") {
        av = a.order_count ?? 0; bv = b.order_count ?? 0;
      } else if (sortKey === "points_balance") {
        av = a.points_balance ?? 0; bv = b.points_balance ?? 0;
      } else if (sortKey === "last_order_date") {
        av = a.last_order_date ? new Date(a.last_order_date).getTime() : 0;
        bv = b.last_order_date ? new Date(b.last_order_date).getTime() : 0;
      }
      if (typeof av === "string") {
        return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      }
      return sortDir === "asc" ? av - (bv as number) : (bv as number) - av;
    });

    return rows;
  }, [customers, search, vipOnly, marketingOnly, sortKey, sortDir]);

  const newsletterCount = customers.filter((c) => c.marketing_opt_in !== false).length;
  const vipCount        = customers.filter((c) => c.is_vip).length;
  const totalSpent      = customers.reduce((s, c) => s + (c.total_spent ?? 0), 0);

  return (
    <div className="max-w-7xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{customers.length.toLocaleString("en-ZA")} total customers</p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCSV(filtered, false)}
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-xs font-bold px-4 py-2.5 hover:border-primary hover:text-primary transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export All ({filtered.length})
          </button>
          <button
            onClick={() => exportCSV(customers, true)}
            className="flex items-center gap-2 bg-secondary text-white text-xs font-bold px-4 py-2.5 hover:bg-secondary/90 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Export Newsletter List ({newsletterCount})
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: customers.length.toLocaleString("en-ZA"), icon: Users, color: "text-primary" },
          { label: "Newsletter Opt-in", value: newsletterCount.toLocaleString("en-ZA"), icon: Mail, color: "text-secondary" },
          { label: "VIP Customers", value: vipCount.toLocaleString("en-ZA"), icon: Star, color: "text-amber-500" },
          { label: "Total Customer Value", value: fmt(totalSpent), icon: Download, color: "text-emerald-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, city…"
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
          <input type="checkbox" checked={vipOnly} onChange={(e) => setVipOnly(e.target.checked)}
            className="accent-secondary" />
          VIP only
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
          <input type="checkbox" checked={marketingOnly} onChange={(e) => setMarketingOnly(e.target.checked)}
            className="accent-secondary" />
          Newsletter opt-in only
        </label>
        {(search || vipOnly || marketingOnly) && (
          <button onClick={() => { setSearch(""); setVipOnly(false); setMarketingOnly(false); }}
            className="text-xs text-gray-400 hover:text-primary transition-colors">
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} shown</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-primary transition-colors">
                    Customer <SortIcon col="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => handleSort("city")} className="flex items-center gap-1 hover:text-primary transition-colors">
                    Location <SortIcon col="city" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => handleSort("total_spent")} className="flex items-center justify-end gap-1 w-full hover:text-primary transition-colors">
                    Spent <SortIcon col="total_spent" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => handleSort("order_count")} className="flex items-center justify-end gap-1 w-full hover:text-primary transition-colors">
                    Orders <SortIcon col="order_count" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => handleSort("points_balance")} className="flex items-center justify-end gap-1 w-full hover:text-primary transition-colors">
                    Points <SortIcon col="points_balance" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => handleSort("last_order_date")} className="flex items-center gap-1 hover:text-primary transition-colors">
                    Last Order <SortIcon col="last_order_date" />
                  </button>
                </th>
                <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, 200).map((c, i) => (
                <tr key={`${c.email}-${i}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">
                      {[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {[c.billing_city ?? c.city, c.billing_state ?? c.province].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {c.total_spent ? fmt(c.total_spent) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{c.order_count ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {c.points_balance ? c.points_balance.toLocaleString("en-ZA") : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(c.last_order_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {c.is_vip && (
                        <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-700 px-1.5 py-0.5">VIP</span>
                      )}
                      {c.marketing_opt_in !== false && (
                        <span className="text-[9px] font-black uppercase bg-secondary/10 text-secondary px-1.5 py-0.5">Newsletter</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 200 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
            Showing first 200 of {filtered.length}. Use Export to get the full list.
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">No customers match your filters.</div>
        )}
      </div>

    </div>
  );
}
