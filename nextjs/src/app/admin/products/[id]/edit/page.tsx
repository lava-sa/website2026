import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ProductEditForm from "@/components/admin/ProductEditForm";

async function getProduct(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await supabase
    .from("products")
    .select("*, categories(id, name, slug), product_images(id, url, alt, is_primary, sort_order)")
    .eq("id", id)
    .single();
  return data;
}

async function getCategories() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await supabase.from("categories").select("id, name, slug").order("name");
  return data ?? [];
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);

  if (!product) notFound();

  return (
    <AdminShell>
      <ProductEditForm product={product} categories={categories} />
    </AdminShell>
  );
}
