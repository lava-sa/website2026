export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import ProductNewForm from "@/components/admin/ProductNewForm";

async function getCategories() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("categories").select("id, name, slug").order("name");
  return data ?? [];
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <ProductNewForm categories={categories} />
    </AdminShell>
  );
}
