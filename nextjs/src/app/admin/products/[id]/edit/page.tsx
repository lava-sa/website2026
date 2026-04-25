export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductEditForm from "@/components/admin/ProductEditForm";

async function getProduct(id: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(id, name, slug), product_images(id, url, alt, is_primary, sort_order)")
    .eq("id", id)
    .single();
  return data;
}

async function getCategories() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("categories").select("id, name, slug").order("name");
  return data ?? [];
}

async function getProductChoices(currentId: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, category_id, categories(name)")
    .eq("is_published", true)
    .neq("id", currentId)
    .order("name", { ascending: true });
  return data ?? [];
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, productChoices] = await Promise.all([
    getProduct(id),
    getCategories(),
    getProductChoices(id),
  ]);

  if (!product) notFound();

  return (
    <AdminShell>
      <ProductEditForm product={product} categories={categories} productChoices={productChoices} />
    </AdminShell>
  );
}
