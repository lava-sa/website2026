/**
 * Upsert the 3 Landig knife sets (Z11060, Z11052, Z11061) only.
 * Run: node scripts/seed-knife-sets.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

const B = "/images/products/butchery";

const knifeSets = [
  {
    sku: "Z11060", slug: "butcher-knife-set-yellow-3pc",
    name: "Knife Set (3 Butcher's Knives) — Yellow Handle",
    short_description: "Professional 3-piece butcher knife set with high-visibility yellow handles.",
    description: `<p>Complete <strong>3-piece butcher knife set</strong> with ergonomic yellow handles.</p>`,
    regular_price: 750, stock_status: "on_order", stock_quantity: 0,
    is_published: true, is_featured: false, sort_order: 40, tags: ["knife", "knife-set", "butchery"],
    primary_image: `${B}/butcher-knife-set-yellow-3pc-z11060.webp`,
    images: [{ url: `${B}/butcher-knife-set-yellow-3pc-z11060.webp`, alt: "Butcher Knife Set Yellow 3pc", is_primary: true }],
  },
  {
    sku: "Z11052", slug: "butcher-knife-set-black-3pc",
    name: "Knife Set (3 Butcher's Knives) — Black Handle",
    short_description: "Premium 3-piece butcher knife set with black handles.",
    description: `<p>Premium <strong>3-piece butcher knife set</strong> with black ergonomic handles.</p>`,
    regular_price: 1315, stock_status: "on_order", stock_quantity: 0,
    is_published: true, is_featured: true, sort_order: 41, tags: ["knife", "knife-set", "butchery"],
    primary_image: `${B}/butcher-knife-set-black-3pc-z11052.webp`,
    images: [{ url: `${B}/butcher-knife-set-black-3pc-z11052.webp`, alt: "Butcher Knife Set Black 3pc", is_primary: true }],
  },
  {
    sku: "Z11061", slug: "kitchen-knife-set-white-3pc",
    name: "3-Piece White Handle LAVA Kitchen Knife Set",
    short_description: "3-piece white-handle LAVA kitchen knife set for home and catering prep.",
    description: `<p><strong>3-piece LAVA kitchen knife set</strong> with white handles — a separate LAVA kitchen range, not the Landig professional butcher sets.</p>`,
    regular_price: 500, stock_status: "in_stock", stock_quantity: 5,
    is_published: true, is_featured: false, sort_order: 42, tags: ["knife", "knife-set", "kitchen"],
    primary_image: null,
    images: [],
  },
];

async function seed() {
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "butchery-accessories")
    .single();
  if (catErr || !cat) {
    console.error("Category butchery-accessories not found:", catErr?.message);
    process.exit(1);
  }

  console.log("Seeding 3 knife sets...\n");

  for (const item of knifeSets) {
    const { images, primary_image, ...productData } = item;
    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        { ...productData, category_id: cat.id, primary_image_url: primary_image ?? null },
        { onConflict: "slug" }
      )
      .select()
      .single();
    if (error) {
      console.error(`✗ ${item.sku}:`, error.message);
      continue;
    }
    await supabase.from("product_images").delete().eq("product_id", product.id);
    if (images?.length) {
      await supabase.from("product_images").insert(
        images.map((img, i) => ({
          product_id: product.id,
          url: img.url,
          alt: img.alt,
          is_primary: img.is_primary || false,
          sort_order: i,
        }))
      );
    }
    console.log(`✓ ${product.sku} ${product.name} — R${product.regular_price}`);
  }

  console.log("\nDone.");
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
