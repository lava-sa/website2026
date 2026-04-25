"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function FeaturedToggle({ productId, current }: { productId: string; current: boolean }) {
  const [featured, setFeatured] = useState(current);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    await fetch("/api/admin/products/featured", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, is_featured: !featured }),
    });
    setFeatured(!featured);
    setSaving(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${
        featured ? "bg-secondary" : "bg-gray-300"
      }`}
      title={featured ? "Featured — click to remove" : "Not featured — click to feature"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          featured ? "translate-x-4" : "translate-x-1"
        }`}
      />
      {saving && (
        <Loader2 className="absolute -right-5 top-0.5 h-3.5 w-3.5 animate-spin text-primary" />
      )}
    </button>
  );
}
