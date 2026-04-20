"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { StockStatus } from "@/types/product";

const OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "on_backorder", label: "On Backorder" },
  { value: "on_order", label: "Special Order" },
];

export default function StockToggle({ productId, current }: { productId: string; current: StockStatus }) {
  const [status, setStatus] = useState<StockStatus>(current);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: StockStatus) {
    setSaving(true);
    await fetch("/api/admin/products/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, stock_status: newStatus }),
    });
    setStatus(newStatus);
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as StockStatus)}
        disabled={saving}
        className="text-[11px] border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
    </div>
  );
}
