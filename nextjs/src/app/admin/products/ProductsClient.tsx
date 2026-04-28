"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, ImageOff, AlertTriangle } from "lucide-react";
import Link from "next/link";
import StockToggle from "@/components/admin/StockToggle";
import PublishToggle from "@/components/admin/PublishToggle";
import FeaturedToggle from "@/components/admin/FeaturedToggle";
import type { StockStatus } from "@/types/product";

const STOCK_COLOURS: Record<StockStatus, string> = {
  in_stock:     "bg-emerald-100 text-emerald-700",
  out_of_stock: "bg-red-100 text-red-700",
  on_backorder: "bg-amber-100 text-amber-700",
  on_order:     "bg-blue-100 text-blue-700",
};
const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock:     "In Stock",
  out_of_stock: "Out of Stock",
  on_backorder: "On Backorder",
  on_order:     "Special Order",
};

type ProductRow = {
  id: string; name: string; slug: string; sku: string | null;
  regular_price: number; sale_price: number | null;
  stock_status: StockStatus; is_published: boolean; is_featured: boolean;
  sort_order: number; categories: { name: string } | null;
  primary_image_url: string | null;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 }).format(n);
}

export default function ProductsClient({
  products, categories,
}: {
  products: ProductRow[];
  categories: string[];
}) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [stock,    setStock]    = useState("all");
  const [pubFilter,setPubFilter]= useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [imageFilter, setImageFilter] = useState<"all"|"missing">("all");
  const [sortBy,   setSortBy]   = useState<"sort_order"|"name_asc"|"name_desc"|"price_asc"|"price_desc">("sort_order");

  const missingImageCount = useMemo(
    () => products.filter((p) => !p.primary_image_url).length,
    [products],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = products.filter((p) => {
      if (category !== "all" && (p.categories?.name ?? "") !== category) return false;
      if (stock    !== "all" && p.stock_status !== stock)                 return false;
      if (pubFilter === "published"   && !p.is_published) return false;
      if (pubFilter === "unpublished" &&  p.is_published) return false;
      if (featuredFilter === "featured" && !p.is_featured) return false;
      if (featuredFilter === "not_featured" && p.is_featured) return false;
      if (imageFilter === "missing" && p.primary_image_url) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        (p.categories?.name ?? "").toLowerCase().includes(q)
      );
    });

    rows = [...rows].sort((a, b) => {
      if (sortBy === "sort_order")  return a.sort_order - b.sort_order;
      if (sortBy === "name_asc")    return a.name.localeCompare(b.name);
      if (sortBy === "name_desc")   return b.name.localeCompare(a.name);
      if (sortBy === "price_asc")   return a.regular_price - b.regular_price;
      if (sortBy === "price_desc")  return b.regular_price - a.regular_price;
      return 0;
    });
    return rows;
  }, [products, search, category, stock, pubFilter, featuredFilter, imageFilter, sortBy]);

  const selectCls = "border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors";
  const hasFilters =
    search ||
    category !== "all" ||
    stock !== "all" ||
    pubFilter !== "all" ||
    featuredFilter !== "all" ||
    imageFilter !== "all";

  return (
    <div className="max-w-6xl">

      {/* Missing-image banner */}
      {missingImageCount > 0 && (
        <div className="mb-4 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-amber-900">
            <p className="font-bold">
              {missingImageCount} {missingImageCount === 1 ? "product is" : "products are"} missing a primary image
            </p>
            <p className="text-xs mt-0.5 text-amber-800">
              Without a primary image, these products fall back to the default V.300 banner when shared on WhatsApp, Facebook or Google. Upload an image to fix the social preview.
            </p>
          </div>
          <button
            onClick={() => setImageFilter(imageFilter === "missing" ? "all" : "missing")}
            className="shrink-0 text-xs font-bold uppercase tracking-wide bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 transition-colors"
          >
            {imageFilter === "missing" ? "Show all" : "Show only these"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} of {products.length} products
          </p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or SKU…"
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>

        {/* Category */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Stock status */}
        <select value={stock} onChange={(e) => setStock(e.target.value)} className={selectCls}>
          <option value="all">All stock statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="on_backorder">On Backorder</option>
          <option value="on_order">Special Order</option>
        </select>

        {/* Published */}
        <select value={pubFilter} onChange={(e) => setPubFilter(e.target.value)} className={selectCls}>
          <option value="all">Published &amp; unpublished</option>
          <option value="published">Published only</option>
          <option value="unpublished">Unpublished only</option>
        </select>

        {/* Featured */}
        <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)} className={selectCls}>
          <option value="all">Featured &amp; non-featured</option>
          <option value="featured">Featured only</option>
          <option value="not_featured">Non-featured only</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className={selectCls}>
          <option value="sort_order">Sort order</option>
          <option value="name_asc">Name A → Z</option>
          <option value="name_desc">Name Z → A</option>
          <option value="price_asc">Price low → high</option>
          <option value="price_desc">Price high → low</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
              setStock("all");
              setPubFilter("all");
              setFeaturedFilter("all");
              setImageFilter("all");
            }}
            className="text-xs text-gray-400 hover:text-primary transition-colors whitespace-nowrap">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Product","SKU","Category","Price","Featured Order","Stock","Published","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 leading-snug">{p.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {p.is_featured && (
                        <span className="text-[9px] font-bold uppercase bg-secondary/10 text-secondary px-1.5 py-0.5 inline-block">
                          Featured
                        </span>
                      )}
                      {!p.primary_image_url && (
                        <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 inline-flex items-center gap-1">
                          <ImageOff className="h-3 w-3" /> No image
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-mono text-xs">{p.sku ?? "—"}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{p.categories?.name ?? "—"}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">{fmt(p.regular_price)}</p>
                    {p.sale_price && (
                      <p className="text-xs text-emerald-600 font-semibold">Sale: {fmt(p.sale_price)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {p.is_featured ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">#{p.sort_order}</span>
                        <FeaturedToggle productId={p.id} current={p.is_featured} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">—</span>
                        <FeaturedToggle productId={p.id} current={p.is_featured} />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 block w-fit mb-1 ${STOCK_COLOURS[p.stock_status]}`}>
                      {STOCK_LABELS[p.stock_status]}
                    </span>
                    <StockToggle productId={p.id} current={p.stock_status} />
                  </td>
                  <td className="px-5 py-4">
                    <PublishToggle productId={p.id} current={p.is_published} />
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors border border-gray-200 px-3 py-1.5 hover:border-primary">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">No products match your filters.</div>
        )}
      </div>
    </div>
  );
}
