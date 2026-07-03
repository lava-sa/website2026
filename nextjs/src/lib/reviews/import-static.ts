import reviewsData from "@/data/reviews.json";
import { createServiceClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

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

const IMPORT_SCHEMA_MIGRATIONS =
  "Run supabase/020_reviews_product_link.sql and supabase/021_reviews_import_key.sql in the Supabase SQL editor, then retry.";

/** Production reviews.email is NOT NULL — legacy imports use a deterministic placeholder. */
function legacyImportEmail(legacyKey: string): string {
  const safe = legacyKey.replace(/[^a-zA-Z0-9._-]+/g, ".");
  return `imported+${safe}@legacy.lava-sa.local`;
}

/** Production reviews.headline is NOT NULL — most legacy rows have no title in reviews.json. */
function legacyImportHeadline(title: string | undefined, reviewText: string): string {
  const trimmed = title?.trim();
  if (trimmed) return trimmed.slice(0, 200);

  const firstLine = reviewText.trim().split(/\n/)[0]?.trim() ?? "";
  if (firstLine.length >= 10) return firstLine.slice(0, 120);

  const snippet = reviewText.trim().replace(/\s+/g, " ");
  if (snippet.length >= 10) return snippet.slice(0, 120);

  return "Customer review";
}

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

export async function checkReviewImportSchema(
  supabase: SupabaseClient = createServiceClient()
): Promise<{ ok: true } | { ok: false; error: string; hint: string }> {
  const { error } = await supabase
    .from("reviews")
    .select("id, legacy_import_key, product_slug, review_scope, source, answers_json")
    .limit(1);

  if (!error) return { ok: true };

  const message = error.message ?? "Unknown schema error";
  const missingColumn =
    message.includes("legacy_import_key") ||
    message.includes("product_slug") ||
    message.includes("review_scope") ||
    message.includes("answers_json") ||
    message.includes("source") ||
    message.includes("column");

  return {
    ok: false,
    error: message,
    hint: missingColumn ? IMPORT_SCHEMA_MIGRATIONS : "Check Supabase logs and the reviews table schema.",
  };
}

export async function countImportedLegacyReviews(): Promise<number> {
  const supabase = createServiceClient();
  const schema = await checkReviewImportSchema(supabase);
  if (!schema.ok) return 0;

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

type ImportRow = Record<string, unknown> & { legacy_import_key: string };

/** Omit nulls — some PostgREST/jsonb combos reject explicit null inserts. */
function compactRow(row: ImportRow): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out;
}

export async function importStaticReviewsToDatabase(): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
  rowsPrepared: number;
  schemaError?: string;
  schemaHint?: string;
}> {
  const supabase = createServiceClient();
  const schema = await checkReviewImportSchema(supabase);
  if (!schema.ok) {
    return {
      imported: 0,
      skipped: 0,
      errors: [schema.error],
      rowsPrepared: 0,
      schemaError: schema.error,
      schemaHint: schema.hint,
    };
  }

  const { data: products } = await supabase.from("products").select("slug, name");
  const productNames = new Map((products ?? []).map((p) => [p.slug as string, p.name as string]));

  const { data: existing, error: existingError } = await supabase
    .from("reviews")
    .select("legacy_import_key")
    .not("legacy_import_key", "is", null);

  if (existingError) {
    return {
      imported: 0,
      skipped: 0,
      errors: [existingError.message],
      rowsPrepared: 0,
      schemaError: existingError.message,
      schemaHint: IMPORT_SCHEMA_MIGRATIONS,
    };
  }

  const existingKeys = new Set(
    (existing ?? []).map((r) => r.legacy_import_key).filter(Boolean) as string[]
  );

  let skipped = 0;
  const errors: string[] = [];
  const rows: ImportRow[] = [];

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
        email: legacyImportEmail(legacyKey),
        company: null,
        city: review.location?.trim() || null,
        machine: `[Imported · la-va.com] ${productName}`,
        product_slug: slug,
        review_scope: "product",
        rating: review.rating,
        headline: legacyImportHeadline(review.title, review.text),
        review: review.text.trim(),
        review_type: "written",
        approved: true,
        created_at: parseStaticDate(review.date),
      });
      existingKeys.add(legacyKey);
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
      email: legacyImportEmail(t.legacyKey),
      company: null,
      city: t.location,
      machine: `[Imported · Homepage] ${t.productLabel}`,
      product_slug: t.productSlug,
      review_scope: "product",
      rating: 5,
      headline: t.headline,
      review: t.text,
      review_type: "written",
      approved: true,
      created_at: new Date().toISOString(),
    });
    existingKeys.add(t.legacyKey);
  }

  if (rows.length === 0) {
    return { imported: 0, skipped, errors, rowsPrepared: 0 };
  }

  let imported = 0;
  const BATCH = 25;
  const compactRows = rows.map(compactRow);

  for (let i = 0; i < compactRows.length; i += BATCH) {
    const batch = compactRows.slice(i, i + BATCH);
    const { error } = await supabase.from("reviews").insert(batch);

    if (!error) {
      imported += batch.length;
      continue;
    }

    errors.push(`Batch insert failed: ${error.message}`);

    for (const row of batch) {
      const { error: rowError } = await supabase.from("reviews").insert(row);
      if (rowError) {
        errors.push(`${String(row.legacy_import_key)}: ${rowError.message}`);
      } else {
        imported++;
      }
    }
  }

  return { imported, skipped, errors: errors.slice(0, 12), rowsPrepared: rows.length };
}
