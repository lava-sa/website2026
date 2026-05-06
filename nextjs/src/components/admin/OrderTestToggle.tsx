"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderTestToggle({ orderId, initial }: { orderId: string; initial: boolean }) {
  const router = useRouter();
  const [isTest, setIsTest] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function onChange(next: boolean) {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders/test", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, is_test: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update test flag");
      }
      setIsTest(next);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update test flag");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      disabled={saving}
      onClick={() => onChange(!isTest)}
      className={`text-xs font-bold px-3 py-2 border transition-colors disabled:opacity-60 ${
        isTest
          ? "border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100"
          : "border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-700"
      }`}
    >
      {saving ? "Saving..." : isTest ? "Marked Test Order" : "Mark as Test Order"}
    </button>
  );
}
