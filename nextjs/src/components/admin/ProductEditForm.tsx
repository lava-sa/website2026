"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, CheckCircle, ArrowLeft, ExternalLink, Trash2, Monitor, Smartphone } from "lucide-react";
import type { StockStatus } from "@/types/product";
import ImageUploader from "@/components/admin/ImageUploader";
import { parseFunnelConfig, type FunnelStepConfig } from "@/lib/funnel";

type Category = { id: string; name: string; slug: string };
type ProductChoice = { id: string; name: string; slug: string; categories?: { name?: string } | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductEditForm({
  product,
  categories,
  productChoices,
}: {
  product: any;
  categories: Category[];
  productChoices: ProductChoice[];
}) {
  const router = useRouter();
  const initialFunnelConfig = parseFunnelConfig(product.specs?.funnel_config);

  const [form, setForm] = useState({
    name:              product.name ?? "",
    sku:               product.sku ?? "",
    short_description: product.short_description ?? "",
    description:       product.description ?? "",
    regular_price:     product.regular_price ?? 0,
    sale_price:        product.sale_price ?? "",
    stock_status:      (product.stock_status ?? "in_stock") as StockStatus,
    stock_quantity:    product.stock_quantity ?? "",
    is_published:      product.is_published ?? false,
    is_featured:       product.is_featured ?? false,
    category_id:       product.category_id ?? "",
    seo_title:         product.seo_title ?? "",
    seo_description:   product.seo_description ?? "",
    weight_kg:         product.weight_kg ?? "",
    sort_order:        product.sort_order ?? 0,
    funnel_enabled:    initialFunnelConfig.enabled,
    funnel_steps:      initialFunnelConfig.steps,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  /** Per funnel step: true = narrow mobile-style preview */
  const [funnelPreviewMobile, setFunnelPreviewMobile] = useState<Record<number, boolean>>({});

  function applyMarkdown(percent: 10 | 15 | 20 | 25) {
    const regular = Number(form.regular_price);
    if (!regular || regular <= 0) return;
    const discounted = Math.round(regular * (1 - percent / 100));
    setForm((prev) => ({ ...prev, sale_price: discounted }));
    setSaved(false);
  }

  function setStepCount(stepCount: number) {
    setForm((prev) => {
      const existing = prev.funnel_steps;
      const nextSteps = Array.from({ length: stepCount }, (_, idx) => (
        existing[idx] ?? ({ title: `Step ${idx + 1} Offer`, description: "", productIds: [], discountPercent: 10 } as FunnelStepConfig)
      ));
      return { ...prev, funnel_steps: nextSteps };
    });
    setSaved(false);
  }

  function updateStepTitle(index: number, title: string) {
    setForm((prev) => ({
      ...prev,
      funnel_steps: prev.funnel_steps.map((step, i) =>
        i === index ? { ...step, title } : step
      ),
    }));
    setSaved(false);
  }

  function updateStepDescription(index: number, description: string) {
    setForm((prev) => ({
      ...prev,
      funnel_steps: prev.funnel_steps.map((step, i) =>
        i === index ? { ...step, description } : step
      ),
    }));
    setSaved(false);
  }

  function updateStepDiscount(index: number, discount: 10 | 15 | 20 | 25) {
    setForm((prev) => ({
      ...prev,
      funnel_steps: prev.funnel_steps.map((step, i) =>
        i === index ? { ...step, discountPercent: discount } : step
      ),
    }));
    setSaved(false);
  }

  function toggleStepProduct(index: number, productId: string) {
    setForm((prev) => {
      const nextSteps = prev.funnel_steps.map((step, i) => {
        if (i !== index) return step;
        const exists = step.productIds.includes(productId);
        if (exists) {
          return { ...step, productIds: step.productIds.filter((id) => id !== productId) };
        }
        if (step.productIds.length >= 3) return step;
        return { ...step, productIds: [...step.productIds, productId] };
      });
      return { ...prev, funnel_steps: nextSteps };
    });
    setSaved(false);
  }

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setForm((p) => ({ ...p, [field]: value }));
      setSaved(false);
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      regular_price: Number(form.regular_price),
      sale_price:    form.sale_price === "" ? null : Number(form.sale_price),
      stock_quantity: form.stock_quantity === "" ? null : Number(form.stock_quantity),
      weight_kg:     form.weight_kg === "" ? null : Number(form.weight_kg),
      sort_order:    Number(form.sort_order),
      category_id:   form.category_id || null,
      specs: {
        ...(product.specs ?? {}),
        funnel_config: JSON.stringify({
          enabled: form.funnel_enabled,
          steps: form.funnel_steps,
        }),
      },
    };

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed. Please try again.");
    }
  }

  const inputCls = "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Products
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-black text-gray-900 truncate max-w-sm">{product.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/products/${product.slug}`} target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary border border-gray-200 px-3 py-2 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> View
          </Link>
          <button
            form="product-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle className="h-4 w-4" /> Saved!</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form id="product-form" onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Main content ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Core details */}
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Product Name *</label>
                  <input type="text" value={form.name} onChange={set("name")} required className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>SKU</label>
                    <input type="text" value={form.sku} onChange={set("sku")} placeholder="e.g. V300-PREM-X" className={inputCls} />
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
                    placeholder="One-sentence summary shown in product cards"
                    className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Full Description</label>
                  <textarea value={form.description} onChange={set("description")} rows={8}
                    placeholder="Full product description (supports plain text)"
                    className={`${inputCls} resize-y`} />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Regular Price (ZAR) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">R</span>
                    <input type="number" value={form.regular_price} onChange={set("regular_price")}
                      required min="0" step="1" className={`${inputCls} pl-7`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Sale Price (ZAR) <span className="text-gray-400 normal-case font-normal">optional</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">R</span>
                    <input type="number" value={form.sale_price} onChange={set("sale_price")}
                      min="0" step="1" placeholder="Leave blank for no sale"
                      className={`${inputCls} pl-7`} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Quick markdown</span>
                    {[10, 15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyMarkdown(pct as 10 | 15 | 20 | 25)}
                        className="border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                      >
                        -{pct}%
                      </button>
                    ))}
                  </div>
                  {form.sale_price !== "" && Number(form.sale_price) > 0 && Number(form.sale_price) < Number(form.regular_price) && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      Saving: R{(Number(form.regular_price) - Number(form.sale_price)).toLocaleString()} ({Math.round((1 - Number(form.sale_price) / Number(form.regular_price)) * 100)}% off)
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* SEO */}
            <section className="bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>SEO Title <span className="text-gray-400 normal-case font-normal">(leave blank to use product name)</span></label>
                  <input type="text" value={form.seo_title} onChange={set("seo_title")}
                    placeholder="e.g. LAVA V.300 Premium X Vacuum Sealer — South Africa"
                    className={inputCls} />
                  <p className="text-xs text-gray-400 mt-1">{form.seo_title.length}/60 characters</p>
                </div>
                <div>
                  <label className={labelCls}>SEO Description</label>
                  <textarea value={form.seo_description} onChange={set("seo_description")} rows={2}
                    placeholder="Short summary for Google search results (150–160 characters)"
                    className={`${inputCls} resize-none`} />
                  <p className="text-xs text-gray-400 mt-1">{form.seo_description.length}/160 characters</p>
                </div>
              </div>
            </section>

          </div>

          {/* ── Right: Sidebar ─────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Status */}
            <section className="bg-white border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Stock Status *</label>
                  <select value={form.stock_status} onChange={set("stock_status")} className={inputCls}>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="on_backorder">On Backorder</option>
                    <option value="on_order">Special Order</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Stock Quantity <span className="text-gray-400 normal-case font-normal">optional</span></label>
                  <input type="number" value={form.stock_quantity} onChange={set("stock_quantity")}
                    min="0" placeholder="e.g. 5" className={inputCls} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Published</p>
                    <p className="text-xs text-gray-500">Visible on website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.is_published}
                      onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
                      className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-emerald-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Featured</p>
                    <p className="text-xs text-gray-500">
                      Include in homepage featured slider
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.is_featured}
                      onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                      className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-secondary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Funnel Enabled</p>
                    <p className="text-xs text-gray-500">Open post-add funnel journey for this product</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.funnel_enabled}
                      onChange={(e) => setForm((p) => ({ ...p, funnel_enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
              </div>
            </section>

            {form.funnel_enabled && (
              <section className="bg-white border border-gray-200 p-5">
                <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Funnel Setup</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Number of Steps</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setStepCount(count)}
                          className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
                            form.funnel_steps.length === count
                              ? "border-primary bg-primary text-white"
                              : "border-gray-200 text-gray-700 hover:border-primary"
                          }`}
                        >
                          {count} Step{count > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.funnel_steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="border border-gray-200 p-4">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                        Step {stepIndex + 1}
                      </p>
                      <div className="mb-3">
                        <label className={labelCls}>Step Title</label>
                        <input
                          type="text"
                          value={step.title ?? ""}
                          onChange={(e) => updateStepTitle(stepIndex, e.target.value)}
                          placeholder={`Step ${stepIndex + 1} Offer`}
                          className={inputCls}
                        />
                      </div>
                      <div className="mb-3">
                        <label className={labelCls}>Step Subtitle / Description</label>
                        <textarea
                          value={step.description ?? ""}
                          onChange={(e) => updateStepDescription(stepIndex, e.target.value)}
                          placeholder="Optional persuasive copy shown under the title"
                          rows={2}
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                      <div className="mb-3 border border-dashed border-gray-300 bg-gray-50 px-3 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">
                            Preview
                          </p>
                          <div className="inline-flex rounded border border-gray-200 bg-white p-0.5 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() =>
                                setFunnelPreviewMobile((prev) => ({ ...prev, [stepIndex]: false }))
                              }
                              className={`inline-flex items-center gap-1 rounded px-2 py-1 transition-colors ${
                                !(funnelPreviewMobile[stepIndex] ?? false)
                                  ? "bg-primary text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <Monitor className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              Desktop
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFunnelPreviewMobile((prev) => ({ ...prev, [stepIndex]: true }))
                              }
                              className={`inline-flex items-center gap-1 rounded px-2 py-1 transition-colors ${
                                funnelPreviewMobile[stepIndex]
                                  ? "bg-primary text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <Smartphone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              Mobile
                            </button>
                          </div>
                        </div>
                        <div
                          className={`mx-auto rounded border border-gray-200 bg-white px-3 py-3 transition-[max-width] duration-200 ${
                            funnelPreviewMobile[stepIndex]
                              ? "max-w-[min(100%,20rem)] shadow-sm"
                              : "max-w-2xl"
                          }`}
                        >
                          <h3
                            className={`font-black text-primary leading-tight mb-1 ${
                              funnelPreviewMobile[stepIndex] ? "text-base" : "text-lg"
                            }`}
                          >
                            {step.title?.trim() || `Step ${stepIndex + 1} Offer`}
                          </h3>
                          <p
                            className={`text-gray-600 leading-relaxed ${
                              funnelPreviewMobile[stepIndex] ? "text-xs" : "text-sm"
                            }`}
                          >
                            {step.description?.trim() || "Optional persuasive copy will appear here."}
                          </p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className={labelCls}>Discount Percentage</label>
                        <select
                          value={step.discountPercent}
                          onChange={(e) =>
                            updateStepDiscount(stepIndex, Number(e.target.value) as 10 | 15 | 20 | 25)
                          }
                          className={inputCls}
                        >
                          <option value={10}>10%</option>
                          <option value={15}>15%</option>
                          <option value={20}>20%</option>
                          <option value={25}>25%</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Step Products (up to 3)</label>
                        <div className="max-h-44 overflow-y-auto border border-gray-200">
                          {productChoices.map((choice) => {
                            const selected = step.productIds.includes(choice.id);
                            return (
                              <button
                                key={choice.id}
                                type="button"
                                onClick={() => toggleStepProduct(stepIndex, choice.id)}
                                className={`w-full text-left px-3 py-2 border-b border-gray-100 text-sm transition-colors ${
                                  selected ? "bg-primary/5 text-primary" : "hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                <span className="font-semibold">{choice.name}</span>
                                <span className="text-xs text-gray-500 ml-2">{choice.categories?.name ?? "No category"}</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Selected: {step.productIds.length}/3</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Shipping */}
            <section className="bg-white border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Shipping</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Weight (kg)</label>
                  <input type="number" value={form.weight_kg} onChange={set("weight_kg")}
                    min="0" step="0.1" placeholder="e.g. 4.5" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={set("sort_order")}
                    min="0" step="1" className={inputCls} />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower number = shown first (including featured slider order on homepage).
                  </p>
                </div>
              </div>
            </section>

            {/* Product images — drag & drop uploader */}
            <ImageUploader
              productId={product.id}
              initialImages={product.product_images ?? []}
            />

            {/* Danger zone */}
            <section className="bg-white border border-red-200 p-5">
              <h2 className="font-bold text-red-700 mb-3 text-xs uppercase tracking-wide">Danger Zone</h2>
              <p className="text-xs text-gray-500 mb-3">Unpublishing hides this product from the website without deleting it.</p>
              <button type="button"
                onClick={() => setForm((p) => ({ ...p, is_published: false }))}
                className="flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 px-3 py-2 hover:bg-red-50 transition-colors w-full justify-center">
                <Trash2 className="h-3.5 w-3.5" /> Unpublish Product
              </button>
            </section>

          </div>
        </div>
      </form>

    </div>
  );
}
