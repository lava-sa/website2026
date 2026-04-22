"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, ArrowLeft } from "lucide-react";

type Category = { id: string; name: string; slug: string };

export default function ProductNewForm({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name:              "",
    sku:               "",
    category_id:       "",
    regular_price:     "",
    stock_status:      "in_stock",
    is_published:      false,
    short_description: "",
    description:       "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setForm((p) => ({ ...p, [field]: value }));
    };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.regular_price || Number(form.regular_price) <= 0) { setError("A valid price is required."); return; }

    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        regular_price: Number(form.regular_price),
        category_id:   form.category_id || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      router.push(`/admin/products/${data.product.id}/edit`);
    } else {
      setError(data.error ?? "Failed to create product. Please try again.");
    }
  }

  return (
    <div className="max-w-2xl">

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Products
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-black text-gray-900">Add New Product</h1>
        </div>
        <button
          form="new-product-form"
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
          ) : (
            <><Save className="h-4 w-4" /> Create Product</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form id="new-product-form" onSubmit={handleCreate} className="space-y-5">

        <section className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Product Details</h2>

          <div>
            <label className={labelCls}>Product Name *</label>
            <input type="text" value={form.name} onChange={set("name")} required
              placeholder="e.g. LAVA V.300 Premium X" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>SKU</label>
              <input type="text" value={form.sku} onChange={set("sku")}
                placeholder="e.g. V300-PREM-X" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category_id} onChange={set("category_id")} className={inputCls}>
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Short Description</label>
            <textarea value={form.short_description} onChange={set("short_description")} rows={2}
              placeholder="One-sentence summary shown on product cards"
              className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className={labelCls}>Full Description</label>
            <textarea value={form.description} onChange={set("description")} rows={5}
              placeholder="Full product description"
              className={`${inputCls} resize-y`} />
          </div>
        </section>

        <section className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Pricing & Status</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Regular Price (ZAR) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">R</span>
                <input type="number" value={form.regular_price} onChange={set("regular_price")}
                  required min="1" step="1" placeholder="0"
                  className={`${inputCls} pl-7`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Stock Status</label>
              <select value={form.stock_status} onChange={set("stock_status")} className={inputCls}>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="on_backorder">On Backorder</option>
                <option value="on_order">Special Order</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900">Publish immediately</p>
              <p className="text-xs text-gray-500">Make visible on the website now</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.is_published}
                onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
                className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-checked:bg-emerald-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>
        </section>

        <p className="text-xs text-gray-400">
          After creating the product you&apos;ll be taken to the full edit page to add images, SEO, and more details.
        </p>

      </form>
    </div>
  );
}
