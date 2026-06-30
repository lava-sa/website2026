"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function handleChange(newStatus: string) {
    setSaving(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus(newStatus);
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="text-[11px] border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
      {error && <span className="text-[10px] text-red-600 font-bold">Failed</span>}
    </div>
  );
}
