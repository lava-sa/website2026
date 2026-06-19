/**
 * Upsert Sous Vide Set XXL Stainless Steel (LX0035) only.
 * Run: node scripts/seed-sous-vide-stainless-set.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

const B = "/images/products/sous-vide/sous-vide-set-xxl-stainless-steel";

const product = {
  sku: "LX0035",
  slug: "sous-vide-set-xxl-stainless-steel",
  name: "Sous Vide Set XXL — Stainless Steel",
  short_description:
    "Premium 6-piece sous vide set with a 12-litre stainless steel basin, LX 20 stick, lids, bag holder and neoprene cover.",
  description: `<p>The <strong>LAVA Sous Vide Set XXL Stainless Steel</strong> — 6-piece complete kit with stainless steel basin, LX 20 stick, lids, bag holder and neoprene cover.</p>`,
  regular_price: 6210,
  stock_status: "in_stock",
  stock_quantity: null,
  is_published: true,
  is_featured: false,
  sort_order: 102,
  tags: ["sous-vide", "kitchen", "complete-set", "stainless-steel"],
  industries: ["kitchen"],
  seo_title: "Sous Vide Set XXL Stainless Steel — Lava-SA",
  seo_description:
    "LAVA stainless steel sous vide complete set — LX 20 stick, 12 L SS basin, lids, bag holder and neoprene cover.",
  specs: {
    includes: "LX 20 Stick + 12 L SS Basin + SS Lid + Plastic Lid + Bag Holder + Neoprene Cover",
    basin_material: "Stainless steel",
    basin_capacity: "12 litres",
    basin_dimensions: "320 × 260 × 200 mm (L × W × H)",
    bag_holder_capacity: "Up to 5 bags",
    temperature_range: "0°C – 90°C",
    temperature_accuracy: "±0.1°C",
    power: "1,200 W",
    noise_level: "34 dB",
    water_protection: "IPX7",
    timer: "Up to 99 h 59 min",
    water_volume: "5 – 20 litres",
  },
  primary_image: `${B}/lava-sous-vide-set-xxl-stainless-steel.webp`,
  images: [
    { url: `${B}/lava-sous-vide-set-xxl-stainless-steel.webp`, alt: "Sous Vide Set XXL Stainless Steel", is_primary: true },
    { url: `${B}/lava-sous-vide-set-xxl-stainless-steel-01.webp`, alt: "Sous Vide Set XXL Stainless Steel", is_primary: false },
    { url: `${B}/lava-sous-vide-set-xxl-stainless-steel-02.webp`, alt: "Sous Vide Set XXL Stainless Steel", is_primary: false },
    { url: `${B}/lava-sous-vide-set-xxl-stainless-steel-03.webp`, alt: "Sous Vide Set XXL Stainless Steel", is_primary: false },
    { url: `${B}/lava-sous-vide-set-xxl-stainless-steel-04.webp`, alt: "Sous Vide Set XXL Stainless Steel", is_primary: false },
    { url: `${B}/lava-sous-vide-set-xxl-stainless-steel-05.webp`, alt: "Sous Vide Set XXL Stainless Steel", is_primary: false },
  ],
};

async function seed() {
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "sous-vide")
    .single();
  if (catErr || !cat) {
    console.error("Category sous-vide not found:", catErr?.message);
    process.exit(1);
  }

  const { images, primary_image, ...productData } = product;
  const { data: row, error } = await supabase
    .from("products")
    .upsert(
      { ...productData, category_id: cat.id, primary_image_url: primary_image },
      { onConflict: "slug" }
    )
    .select()
    .single();
  if (error) {
    console.error("Upsert failed:", error.message);
    process.exit(1);
  }

  await supabase.from("product_images").delete().eq("product_id", row.id);
  if (images.length) {
    await supabase.from("product_images").insert(
      images.map((img, i) => ({
        product_id: row.id,
        url: img.url,
        alt: img.alt,
        is_primary: img.is_primary || false,
        sort_order: i,
      }))
    );
  }

  console.log(`✓ ${row.sku} ${row.name} — R${row.regular_price}`);
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
