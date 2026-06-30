export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import ReviewsAdminClient from "@/components/admin/ReviewsAdminClient";
import { createServiceClient } from "@/lib/supabase";
import {
  countImportedLegacyReviews,
  getStaticReviewCatalogStats,
} from "@/lib/reviews/import-static";

async function getReviews() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      "id, name, email, company, city, machine, product_slug, review_scope, rating, headline, review, answers_json, approved, created_at, review_type, video_url, source, legacy_import_key"
    )
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getProductOptions() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("slug, name, categories(name)")
    .eq("is_published", true)
    .order("name");

  return (data ?? []).map((p) => ({
    slug: p.slug as string,
    name: p.name as string,
    category: (p.categories as { name?: string } | null)?.name ?? "Product",
  }));
}

export default async function AdminReviewsPage() {
  const [reviews, productOptions, importedCount] = await Promise.all([
    getReviews(),
    getProductOptions(),
    countImportedLegacyReviews(),
  ]);

  const catalog = getStaticReviewCatalogStats();
  const importStats = {
    ...catalog,
    importedCount,
    pendingImport: Math.max(0, catalog.totalImportable - importedCount),
  };

  return (
    <AdminShell>
      <ReviewsAdminClient
        reviews={reviews as Parameters<typeof ReviewsAdminClient>[0]["reviews"]}
        productOptions={productOptions}
        importStats={importStats}
      />
    </AdminShell>
  );
}
