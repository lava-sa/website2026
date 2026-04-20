export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import StockToggle from "@/components/admin/StockToggle";
import PublishToggle from "@/components/admin/PublishToggle";
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

async function getProducts() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, sku, regular_price, sale_price, stock_status, stock_quantity, is_published, is_featured, sort_order, categories(name)")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  regular_price: number;
  sale_price: number | null;
  stock_status: StockStatus;
  stock_quantity: number | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  categories: { name: string } | null;
};

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 }).format(n);
}

export default async function AdminProductsPage() {
  const products = await getProducts() as ProductRow[];

  return (
    <AdminShell>
      <div className="max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} products total</p>
          </div>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">SKU</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Published</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.categories?.name ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 font-mono text-xs">{p.sku ?? "—"}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{formatZAR(p.regular_price)}</p>
                      {p.sale_price && (
                        <p className="text-xs text-emerald-600 font-semibold">Sale: {formatZAR(p.sale_price)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${STOCK_COLOURS[p.stock_status]}`}>
                          {STOCK_LABELS[p.stock_status]}
                        </span>
                      </div>
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
        </div>

      </div>
    </AdminShell>
  );
}
