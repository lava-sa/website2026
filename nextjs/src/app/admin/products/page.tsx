export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import ProductsClient from "./ProductsClient";
import type { StockStatus } from "@/types/product";

type ProductRow = {
  id: string; name: string; slug: string; sku: string | null;
  regular_price: number; sale_price: number | null;
  stock_status: StockStatus; is_published: boolean; is_featured: boolean;
  sort_order: number; categories: { name: string } | null;
};

async function getProducts() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, sku, regular_price, sale_price, stock_status, is_published, is_featured, sort_order, categories(name)")
    .order("sort_order", { ascending: true });
  return (data ?? []) as unknown as ProductRow[];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  // Unique category names for the filter dropdown
  const categories = [...new Set(
    products.map((p) => p.categories?.name).filter(Boolean) as string[]
  )].sort();

  return (
    <AdminShell>
      <ProductsClient products={products} categories={categories} />
    </AdminShell>
  );
}
