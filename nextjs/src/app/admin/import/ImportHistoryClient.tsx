"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Play, Search } from "lucide-react";

export default function ImportHistoryClient() {
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState<"dry" | "import" | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");

  async function run(dryRun: boolean) {
    setBusy(dryRun ? "dry" : "import");
    setError("");
    setResult(null);
    const res = await fetch("/api/admin/order-history/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dryRun, csv }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "Request failed");
      setResult(data);
      return;
    }
    setResult(data);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Import order history</h1>
        <p className="text-sm text-gray-500 mt-1">
          Load past sales into <strong>order_history</strong> (WooCommerce exports or the template below).
          Same <code className="text-xs bg-gray-100 px-1">wp_order_id</code> updates existing rows — safe to re-run.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 flex gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Before you import</p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-amber-900/90">
            <li>Each row needs a numeric order id — we accept <strong>order_id</strong> or <strong>wp_order_id</strong> (Woo) — unique key.</li>
            <li><strong>order_date</strong>: ISO or Woo format (e.g. <code className="text-xs">2026-04-26 12:38:42</code>) is fine.</li>
            <li>Wide Woo exports: <strong>status</strong> values like <code className="text-xs">processing</code> are normalised to <code className="text-xs">wc-processing</code>. <strong>Product Item 1…N</strong> columns are mapped into line items for dashboard top products.</li>
            <li>Optional <strong>items</strong> column: JSON array of line items (or rely on Product Item columns).</li>
            <li>Run <strong>Validate</strong> first; then <strong>Import</strong>.</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/api/admin/order-history/template"
          className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-800 text-xs font-bold px-4 py-2.5 hover:border-primary transition-colors"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Download CSV template
        </a>
        <Link
          href="/admin/order-history"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary border border-primary/30 px-4 py-2.5 hover:bg-primary/5"
        >
          View imported history
        </Link>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
          Paste CSV (including header row)
        </label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={14}
          placeholder="wp_order_id,order_date,total,..."
          className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null || !csv.trim()}
          onClick={() => run(true)}
          className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-800 text-sm font-bold px-5 py-2.5 hover:border-primary disabled:opacity-50"
        >
          {busy === "dry" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Validate (dry run)
        </button>
        <button
          type="button"
          disabled={busy !== null || !csv.trim()}
          onClick={() => run(false)}
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 hover:bg-primary/90 disabled:opacity-50"
        >
          {busy === "import" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Import to database
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {result && (
        <pre className="bg-gray-900 text-emerald-200 text-xs p-4 overflow-x-auto rounded border border-gray-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {result && typeof result === "object" && result !== null && "dryRun" in result && (result as { dryRun?: boolean }).dryRun === false && "inserted" in result && (
        <p className="text-sm text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Import finished. Open the dashboard to refresh charts.
        </p>
      )}
    </div>
  );
}
