"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function PublishToggle({ productId, current }: { productId: string; current: boolean }) {
  const [published, setPublished] = useState(current);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    await fetch("/api/admin/products/publish", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, is_published: !published }),
    });
    setPublished(!published);
    setSaving(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${
        published ? "bg-emerald-500" : "bg-gray-300"
      }`}
      title={published ? "Published — click to unpublish" : "Hidden — click to publish"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          published ? "translate-x-4" : "translate-x-1"
        }`}
      />
      {saving && (
        <Loader2 className="absolute -right-5 top-0.5 h-3.5 w-3.5 animate-spin text-primary" />
      )}
    </button>
  );
}
