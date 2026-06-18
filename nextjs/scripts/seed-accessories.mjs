/**
 * Lava-SA — Vacuum Accessories Seeder
 * Run: node scripts/seed-accessories.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

const A = "/images/products/accessories";

const category = {
  name: "Vacuum Accessories",
  slug: "accessories",
  description: "LAVA vacuum accessories — labels, fluid stop, bone protection, wine sealers, roll dispenser and hand pump.",
  sort_order: 6,
};

const products = [
  {
    sku: "VL0099", slug: "lava-labels-and-marker",
    name: "LAVA Labels and Permanent Marker",
    short_description: "100 self-adhesive freezer-safe labels on a roll plus waterproof permanent marker.",
    description: `<p>Original <strong>LAVA labels</strong> with permanent marker — freezer-safe and washable.</p>`,
    regular_price: 320, stock_status: "in_stock", stock_quantity: 20,
    is_featured: false, sort_order: 1, tags: ["accessories", "labels", "bags"],
    primary_image: `${A}/lava-labels-and-marker-vl0099.webp`,
    images: [{ url: `${A}/lava-labels-and-marker-vl0099.webp`, alt: "LAVA Labels and Marker", is_primary: true }],
  },
  {
    sku: "VL0002", slug: "lava-fluid-stop",
    name: "LAVA Fluid Stop (30 cm × 12 m)",
    short_description: "Liquid stop film for safe vacuum sealing of moist foods — up to 600 bags.",
    description: `<p><strong>LAVA Fluid Stop</strong> protects the seal area when vacuum packing moist foods.</p>`,
    regular_price: 726, stock_status: "in_stock", stock_quantity: 15,
    is_featured: false, sort_order: 2, tags: ["accessories", "bags", "liquid"],
    primary_image: `${A}/lava-fluid-stop-vl0002.webp`,
    images: [{ url: `${A}/lava-fluid-stop-vl0002.webp`, alt: "LAVA Fluid Stop", is_primary: true }],
  },
  {
    sku: "VL0003", slug: "lava-bone-protection",
    name: "LAVA Bone Protection Cloth (10 cm × 5 m)",
    short_description: "Bone protection cloth for sharp-edged products — prevents bag punctures.",
    description: `<p><strong>LAVA Bone Protection</strong> for ribs, bones and sharp game cuts.</p>`,
    regular_price: 325, stock_status: "in_stock", stock_quantity: 15,
    is_featured: false, sort_order: 3, tags: ["accessories", "bags", "butchery"],
    primary_image: `${A}/lava-bone-protection-vl0003.webp`,
    images: [{ url: `${A}/lava-bone-protection-vl0003.webp`, alt: "LAVA Bone Protection", is_primary: true }],
  },
  {
    sku: "VL0090", slug: "lava-wine-sealers",
    name: "LAVA Wine Sealers (Pack of 2)",
    short_description: "Vacuum bottle stoppers for wine, juice and vinegar — pack of 2.",
    description: `<p><strong>LAVA wine sealers</strong> — reseal opened bottles under vacuum.</p>`,
    regular_price: 260, stock_status: "in_stock", stock_quantity: 20,
    is_featured: false, sort_order: 4, tags: ["accessories", "wine", "containers"],
    primary_image: `${A}/lava-wine-sealers-vl0090.webp`,
    images: [{ url: `${A}/lava-wine-sealers-vl0090.webp`, alt: "LAVA Wine Sealers", is_primary: true }],
  },
  {
    sku: "VL0008", slug: "lava-roll-dispenser",
    name: "LAVA Roll Dispenser (15–30 cm)",
    short_description: "Roll cutter and dispenser for vacuum rolls 15–30 cm wide.",
    description: `<p><strong>LAVA roll dispenser</strong> with built-in cutter for 15–30 cm rolls.</p>`,
    regular_price: 915, stock_status: "in_stock", stock_quantity: 5,
    is_featured: false, sort_order: 5, tags: ["accessories", "rolls"],
    primary_image: `${A}/lava-roll-dispenser-vl0008.webp`,
    images: [{ url: `${A}/lava-roll-dispenser-vl0008.webp`, alt: "LAVA Roll Dispenser", is_primary: true }],
  },
  {
    sku: "VL0056", slug: "lava-manual-hand-pump",
    name: "LAVA Manual Hand Pump",
    short_description: "Manual vacuum hand pump for containers, jar sealers and universal lids.",
    description: `<p><strong>LAVA manual hand pump</strong> — no electricity required.</p>`,
    regular_price: 400, stock_status: "in_stock", stock_quantity: 10,
    is_featured: false, sort_order: 6, tags: ["accessories", "containers", "jar-sealer", "hand-pump"],
    primary_image: `${A}/lava-manual-hand-pump-vl0056.webp`,
    images: [{ url: `${A}/lava-manual-hand-pump-vl0056.webp`, alt: "LAVA Manual Hand Pump", is_primary: true }],
  },
];

async function seed() {
  console.log("🌱 Seeding vacuum accessories...\n");
  const { data: cat, error: catErr } = await supabase
    .from("categories").upsert(category, { onConflict: "slug" }).select().single();
  if (catErr) { console.error("Category error:", catErr.message); process.exit(1); }
  console.log(`✓ Category: ${cat.name}\n`);

  for (const item of products) {
    const { images, primary_image, ...productData } = item;
    const { data: product, error } = await supabase
      .from("products")
      .upsert({ ...productData, category_id: cat.id, primary_image_url: primary_image }, { onConflict: "slug" })
      .select().single();
    if (error) { console.error(`✗ ${item.name}:`, error.message); continue; }
    await supabase.from("product_images").delete().eq("product_id", product.id);
    if (images?.length) {
      await supabase.from("product_images").insert(
        images.map((img, i) => ({ product_id: product.id, url: img.url, alt: img.alt, is_primary: img.is_primary || false, sort_order: i }))
      );
    }
    console.log(`  ✓ ${product.name} — R${product.regular_price}`);
  }
  console.log("\n✅ Accessories seed complete!");
}

seed().catch((err) => { console.error("Fatal:", err); process.exit(1); });
