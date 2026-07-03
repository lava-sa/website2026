/**
 * One-time import of reviews.json + homepage testimonials into Supabase.
 *
 * Usage (from nextjs folder):
 *   node scripts/import-reviews.mjs
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local at", envPath);
    process.exit(1);
  }
  const text = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const HOMEPAGE_TESTIMONIALS = [
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

function parseStaticDate(date) {
  const dotted = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotted) {
    return new Date(`${dotted[3]}-${dotted[2]}-${dotted[1]}T12:00:00.000Z`).toISOString();
  }
  const parsed = new Date(date);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date().toISOString();
}

function legacyImportEmail(legacyKey) {
  const safe = legacyKey.replace(/[^a-zA-Z0-9._-]+/g, ".");
  return `imported+${safe}@legacy.lava-sa.local`;
}

function legacyImportHeadline(title, reviewText) {
  const trimmed = title?.trim();
  if (trimmed) return trimmed.slice(0, 200);

  const firstLine = reviewText.trim().split(/\n/)[0]?.trim() ?? "";
  if (firstLine.length >= 10) return firstLine.slice(0, 120);

  const snippet = reviewText.trim().replace(/\s+/g, " ");
  if (snippet.length >= 10) return snippet.slice(0, 120);

  return "Customer review";
}

function compactRow(row) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const sb = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const schema = await sb
    .from("reviews")
    .select("id, legacy_import_key, product_slug, review_scope, source")
    .limit(1);
  if (schema.error) {
    console.error("Schema check failed:", schema.error.message);
    console.error("Run supabase/022_reviews_import_ready.sql in Supabase SQL editor first.");
    process.exit(1);
  }
  console.log("Schema OK");

  const reviewsPath = path.join(__dirname, "..", "src", "data", "reviews.json");
  const staticFile = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));

  const { data: existing } = await sb
    .from("reviews")
    .select("legacy_import_key")
    .not("legacy_import_key", "is", null);

  const existingKeys = new Set((existing ?? []).map((r) => r.legacy_import_key).filter(Boolean));

  const rows = [];
  let skipped = 0;

  for (const [slug, block] of Object.entries(staticFile)) {
    block.reviews.forEach((review, index) => {
      const legacyKey = `static:${slug}:${index}`;
      if (existingKeys.has(legacyKey)) {
        skipped++;
        return;
      }
      rows.push(
        compactRow({
          legacy_import_key: legacyKey,
          source: "imported",
          name: review.name.trim(),
          email: legacyImportEmail(legacyKey),
          city: review.location?.trim() || undefined,
          machine: `[Imported · la-va.com] ${slug}`,
          product_slug: slug,
          review_scope: "product",
          rating: review.rating,
          headline: legacyImportHeadline(review.title, review.text),
          review: review.text.trim(),
          review_type: "written",
          approved: true,
          created_at: parseStaticDate(review.date),
        })
      );
      existingKeys.add(legacyKey);
    });
  }

  for (const t of HOMEPAGE_TESTIMONIALS) {
    if (existingKeys.has(t.legacyKey)) {
      skipped++;
      continue;
    }
    rows.push(
      compactRow({
        legacy_import_key: t.legacyKey,
        source: "imported",
        name: t.name,
        email: legacyImportEmail(t.legacyKey),
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
      })
    );
  }

  console.log(`Prepared ${rows.length} rows (${skipped} already in database)`);

  if (rows.length === 0) {
    console.log("Nothing to import.");
    return;
  }

  let imported = 0;
  const BATCH = 25;
  const errors = [];

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await sb.from("reviews").insert(batch);
    if (!error) {
      imported += batch.length;
      process.stdout.write(`\rImported ${imported}/${rows.length}...`);
      continue;
    }
    errors.push(`Batch: ${error.message}`);
    for (const row of batch) {
      const { error: rowError } = await sb.from("reviews").insert(row);
      if (rowError) errors.push(`${row.legacy_import_key}: ${rowError.message}`);
      else imported++;
    }
  }

  console.log(`\nDone. Imported ${imported}, skipped ${skipped}.`);
  if (errors.length) {
    console.error("Errors:");
    errors.slice(0, 10).forEach((e) => console.error(" -", e));
  }

  const { count } = await sb
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .not("legacy_import_key", "is", null);
  console.log("Legacy reviews in database now:", count);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
