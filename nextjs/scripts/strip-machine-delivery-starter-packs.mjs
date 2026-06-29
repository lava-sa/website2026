/**
 * Remove complimentary vacuum bags/rolls from specs.machine_content.deliveryContents
 * on all vacuum-machine products (admin + DB source of truth).
 *
 * Run: node scripts/strip-machine-delivery-starter-packs.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const supabase = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE_KEY")
);

const COMPLIMENTARY_BAG_ROLL_PATTERNS = [
  /starter\s*pack.*vacuum\s*bags/i,
  /starter\s*pack.*vacuum\s*roll/i,
  /complimentary.*vacuum\s*roll/i,
  /assortment.*vacuum\s*bags/i,
  /professional vacuum bags.*mixed sizes/i,
];

function strip(items) {
  return items.filter(
    (item) => !COMPLIMENTARY_BAG_ROLL_PATTERNS.some((re) => re.test(item))
  );
}

const { data: category } = await supabase
  .from("categories")
  .select("id")
  .eq("slug", "vacuum-machines")
  .single();

if (!category) {
  console.error("vacuum-machines category not found");
  process.exit(1);
}

const { data: products, error } = await supabase
  .from("products")
  .select("id, slug, name, specs")
  .eq("category_id", category.id);

if (error) {
  console.error(error.message);
  process.exit(1);
}

let updated = 0;

for (const product of products ?? []) {
  const specs = product.specs && typeof product.specs === "object" ? { ...product.specs } : {};
  const mc = specs.machine_content;
  if (!mc || typeof mc !== "object" || !Array.isArray(mc.deliveryContents)) continue;

  const next = strip(mc.deliveryContents);
  if (next.length === mc.deliveryContents.length) continue;

  specs.machine_content = { ...mc, deliveryContents: next };

  const { error: updErr } = await supabase
    .from("products")
    .update({ specs, updated_at: new Date().toISOString() })
    .eq("id", product.id);

  if (updErr) {
    console.error(`✗ ${product.slug}:`, updErr.message);
    continue;
  }

  updated++;
  console.log(`✅ ${product.name} (${product.slug})`);
  console.log(`   removed ${mc.deliveryContents.length - next.length} item(s)`);
}

console.log(`\nDone — ${updated} product(s) updated.`);
