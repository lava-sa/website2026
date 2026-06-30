import reviewsData from "@/data/reviews.json";
import { createServiceClient } from "@/lib/supabase";

type StaticReviewEntry = {
  name: string;
  location?: string;
  date: string;
  rating: number;
  text: string;
  title?: string;
};

type StaticReviewsFile = Record<
  string,
  { average_rating: number; total_reviews: number; reviews: StaticReviewEntry[] }
>;

const staticFile = reviewsData as StaticReviewsFile;

const HOMEPAGE_TESTIMONIALS: {
  legacyKey: string;
  name: string;
  location: string;
  productSlug: string;
  productLabel: string;
  headline: string;
  text: string;
}[] = [
  {
    legacyKey: "homepage:thomas",
    name: "Thomas S.",
    location: "Germany",
    productSlug: "v300-premium-x",
    productLabel: "LAVA V.300 Premium X",
    headline: "Outstanding craftsmanship",
    text: "An outstanding product with excellent craftsmanship and performance. The price to performance ratio is very good. Delivery and packaging were perfect.",
  },
  {
    legacyKey: "homepage:caroline",
    name: "Caroline S.",
    location: "Germany",
    productSlug: "v100-premium-x",
    productLabel: "LAVA V.100 Premium X",
    headline: "Gift-quality confidence",
    text: "I already own the previous model and am thrilled with the new design. The fact that I'm giving this as a gift says it all. I only gift products to my friends when I'm completely convinced of their quality.",
  },
  {
    legacyKey: "homepage:ralf",
    name: "Ralf A.",
    location: "Germany",
    productSlug: "v300-premium-x",
    productLabel: "LAVA V.300 Premium X",
    headline: "Superb German quality",
    text: "A superb device. We treated ourselves to this machine for Christmas. I'm absolutely satisfied with its excellent quality. With minimal pressure, the device immediately begins creating the vacuum.",
  },
];

function parseStaticDate(date: string): string {
  const dotted = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotted) {
    return new Date(`${dotted[3]}-${dotted[2]}-${dotted[1]}T12:00:00.000Z`).toISOString();
  }
  const parsed = new Date(date);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date().toISOString();
}

function countStaticSources(): number {
  let n = HOMEPAGE_TESTIMONIALS.length;
  for (const block of Object.values(staticFile)) {
    n += block.reviews.length;
  }
  return n;
}

export function getStaticReviewCatalogStats() {
  const productSlugs = Object.keys(staticFile);
  let reviewCount = 0;
  for (const block of Object.values(staticFile)) reviewCount += block.reviews.length;
  return {
    productSlugs: productSlugs.length,
    jsonReviewCount: reviewCount,
    homepageReviewCount: HOMEPAGE_TESTIMONIALS.length,
    totalImportable: countStaticSources(),
  };
}

export async function countImportedLegacyReviews(): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .not("legacy_import_key", "is", null);

  if (error) {
    console.error("countImportedLegacyReviews:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function importStaticReviewsToDatabase(): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> {
  const supabase = createServiceClient();
  const { data: products } = await supabase.from("products").select("slug, name");
  const productNames = new Map((products ?? []).map((p) => [p.slug as string, p.name as string]));

  const { data: existing } = await supabase
    .from("reviews")
    .select("legacy_import_key")
    .not("legacy_import_key", "is", null);

  const existingKeys = new Set(
    (existing ?? []).map((r) => r.legacy_import_key).filter(Boolean) as string[]
  );

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];
  const rows: Record<string, unknown>[] = [];

  for (const [slug, block] of Object.entries(staticFile)) {
    const productName = productNames.get(slug) ?? slug.replace(/-/g, " ");
    block.reviews.forEach((review, index) => {
      const legacyKey = `static:${slug}:${index}`;
      if (existingKeys.has(legacyKey)) {
        skipped++;
        return;
      }
      rows.push({
        legacy_import_key: legacyKey,
        source: "imported",
        name: review.name.trim(),
        email: null,
        company: null,
        city: review.location?.trim() || null,
        machine: `[Imported · la-va.com] ${productName}`,
        product_slug: slug,
        review_scope: "product",
        rating: review.rating,
        headline: review.title?.trim() || null,
        review: review.text.trim(),
        answers_json: null,
        review_type: "written",
        approved: true,
        created_at: parseStaticDate(review.date),
      });
      existingKeys.add(legacyKey);
      imported++;
    });
  }

  for (const t of HOMEPAGE_TESTIMONIALS) {
    if (existingKeys.has(t.legacyKey)) {
      skipped++;
      continue;
    }
    rows.push({
      legacy_import_key: t.legacyKey,
      source: "imported",
      name: t.name,
      email: null,
      company: null,
      city: t.location,
      machine: `[Imported · Homepage] ${t.productLabel}`,
      product_slug: t.productSlug,
      review_scope: "product",
      rating: 5,
      headline: t.headline,
      review: t.text,
      answers_json: null,
      review_type: "written",
      approved: true,
      created_at: new Date().toISOString(),
    });
    existingKeys.add(t.legacyKey);
    imported++;
  }

  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from("reviews").insert(batch);
    if (error) {
      errors.push(error.message);
      imported -= batch.length;
    }
  }

  return { imported, skipped, errors };
}
