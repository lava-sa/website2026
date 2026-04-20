/**
 * Lava-SA — Vacuum Bags & Rolls Seeder
 * Run: node scripts/seed-bags-rolls.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

// Shared lifestyle image for sizes without a dedicated product photo
const GENERIC_BAGS_IMG = "/images/products/bags/lava-vacuum-sealing-rolls-and-bags-image-002-500.webp";

// ─── Categories ─────────────────────────────────────────────────────────────
const categories = [
  {
    name:        "Vacuum Bags",
    slug:        "vacuum-bags",
    description: "German-quality embossed vacuum bags compatible with all LAVA machines.",
    sort_order:  2,
  },
  {
    name:        "Vacuum Rolls",
    slug:        "vacuum-rolls",
    description: "Cut-to-length embossed vacuum rolls for custom bag sizes.",
    sort_order:  3,
  },
];

// ─── Bags ────────────────────────────────────────────────────────────────────
const bags = [
  {
    sku:           "LVB1015-50",
    name:          "Embossed Vacuum Bags 10 × 15 cm — 50 Bags",
    slug:          "embossed-vacuum-bags-10x15-50",
    short_description: "Compact 10 × 15 cm embossed vacuum bags. Perfect for small portions — spices, herbs, small cuts of meat, cheese. Pack of 50.",
    description:   `<p>The perfect size for small portions — spices, fresh herbs, small cuts of meat, hard cheese, and more. These <strong>German-quality embossed bags</strong> are compatible with all LAVA vacuum sealing machines.</p>
<ul>
<li><strong>Size:</strong> 10 × 15 cm</li>
<li><strong>Pack:</strong> 50 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
<li>Compatible with all LAVA machines up to 340mm seal width</li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 195,
    stock_status:  "in_stock",
    stock_quantity: 50,
    is_featured:   false,
    sort_order:    1,
    tags:          ["bags", "10x15", "small", "50-pack"],
    primary_image: "/images/products/bags/embossed-vacuum-bags-10-x-15-cm-50-bags.webp",
    images: [
      { url: "/images/products/bags/embossed-vacuum-bags-10-x-15-cm-50-bags.webp", alt: "Embossed Vacuum Bags 10 × 15 cm 50 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB1320-50",
    name:          "Embossed Vacuum Bags 13 × 20 cm — 50 Bags",
    slug:          "embossed-vacuum-bags-13x20-50",
    short_description: "Versatile 13 × 20 cm embossed vacuum bags — ideal for chicken fillets, fish portions, sliced meats. Pack of 50.",
    description:   `<p>One of the most popular sizes — ideal for chicken fillets, fish fillets, sausages, and sliced deli meats. <strong>German-quality embossed bags</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Size:</strong> 13 × 20 cm</li>
<li><strong>Pack:</strong> 50 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 225,
    stock_status:  "in_stock",
    stock_quantity: 50,
    is_featured:   false,
    sort_order:    2,
    tags:          ["bags", "13x20", "50-pack"],
    primary_image: GENERIC_BAGS_IMG,
    images: [
      { url: GENERIC_BAGS_IMG, alt: "Embossed Vacuum Bags 13 × 20 cm 50 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB1322-50",
    name:          "Embossed Vacuum Bags 13 × 22.5 cm — 50 Bags",
    slug:          "embossed-vacuum-bags-13x22-50",
    short_description: "Popular 13 × 22.5 cm embossed vacuum bags — great for chicken pieces, fish, sausages. Pack of 50.",
    description:   `<p>A popular everyday size for chicken pieces, fish portions, and sausage links. <strong>German-quality embossed bags</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Size:</strong> 13 × 22.5 cm</li>
<li><strong>Pack:</strong> 50 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 245,
    stock_status:  "in_stock",
    stock_quantity: 50,
    is_featured:   false,
    sort_order:    3,
    tags:          ["bags", "13x22", "50-pack"],
    primary_image: "/images/products/bags/embossed-vacuum-bags-13-x-22.5-cm-50-bags.webp",
    images: [
      { url: "/images/products/bags/embossed-vacuum-bags-13-x-22.5-cm-50-bags.webp", alt: "Embossed Vacuum Bags 13 × 22.5 cm 50 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB2030-50",
    name:          "Embossed Vacuum Bags 20 × 30 cm — 50 Bags",
    slug:          "embossed-vacuum-bags-20x30-50",
    short_description: "Mid-size 20 × 30 cm embossed vacuum bags — perfect for steaks, chops, and medium portions. Pack of 50.",
    description:   `<p>The go-to size for steaks, chops, and medium-sized meat portions. <strong>German-quality embossed bags</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Size:</strong> 20 × 30 cm</li>
<li><strong>Pack:</strong> 50 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 285,
    stock_status:  "in_stock",
    stock_quantity: 50,
    is_featured:   true,
    sort_order:    4,
    tags:          ["bags", "20x30", "50-pack", "most-popular"],
    primary_image: GENERIC_BAGS_IMG,
    images: [
      { url: GENERIC_BAGS_IMG, alt: "Embossed Vacuum Bags 20 × 30 cm 50 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB2035-50",
    name:          "Embossed Vacuum Bags 20 × 35 cm — 50 Bags",
    slug:          "embossed-vacuum-bags-20x35-50",
    short_description: "20 × 35 cm embossed vacuum bags for whole fish, large chops, and biltong portions. Pack of 50.",
    description:   `<p>Great for whole fish, large chops, and biltong cuts. <strong>German-quality embossed bags</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Size:</strong> 20 × 35 cm</li>
<li><strong>Pack:</strong> 50 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 315,
    stock_status:  "in_stock",
    stock_quantity: 50,
    is_featured:   false,
    sort_order:    5,
    tags:          ["bags", "20x35", "50-pack"],
    primary_image: GENERIC_BAGS_IMG,
    images: [
      { url: GENERIC_BAGS_IMG, alt: "Embossed Vacuum Bags 20 × 35 cm 50 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB2040-50",
    name:          "Embossed Vacuum Bags 20 × 40 cm — 50 Bags",
    slug:          "embossed-vacuum-bags-20x40-50",
    short_description: "20 × 40 cm embossed vacuum bags for roasts, larger cuts and game portions. Pack of 50.",
    description:   `<p>Ideal for roasts, larger cuts and small game portions. <strong>German-quality embossed bags</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Size:</strong> 20 × 40 cm</li>
<li><strong>Pack:</strong> 50 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 345,
    stock_status:  "in_stock",
    stock_quantity: 50,
    is_featured:   false,
    sort_order:    6,
    tags:          ["bags", "20x40", "50-pack"],
    primary_image: GENERIC_BAGS_IMG,
    images: [
      { url: GENERIC_BAGS_IMG, alt: "Embossed Vacuum Bags 20 × 40 cm 50 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB2560-25",
    name:          "Embossed Vacuum Bags 25 × 60 cm — 25 Bags",
    slug:          "embossed-vacuum-bags-25x60-25",
    short_description: "Large 25 × 60 cm embossed vacuum bags — designed for legs of lamb, large game, and long cuts. Pack of 25.",
    description:   `<p>For legs of lamb, haunches of venison, long biltong strips, and large game portions. <strong>German-quality embossed bags</strong> compatible with all LAVA machines with 340mm+ seal width.</p>
<ul>
<li><strong>Size:</strong> 25 × 60 cm</li>
<li><strong>Pack:</strong> 25 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 345,
    stock_status:  "in_stock",
    stock_quantity: 30,
    is_featured:   false,
    sort_order:    7,
    tags:          ["bags", "25x60", "25-pack", "large", "game"],
    primary_image: GENERIC_BAGS_IMG,
    images: [
      { url: GENERIC_BAGS_IMG, alt: "Embossed Vacuum Bags 25 × 60 cm 25 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVB3060-25",
    name:          "Embossed Vacuum Bags 30 × 60 cm — 25 Bags",
    slug:          "embossed-vacuum-bags-30x60-25",
    short_description: "Extra-wide 30 × 60 cm embossed vacuum bags for whole chickens, large roasts and game. Pack of 25.",
    description:   `<p>For whole chickens, large pork shoulders, big game portions and bulky items. Compatible with LAVA V.100 Premium X and wider machines (340mm+ seal).</p>
<ul>
<li><strong>Size:</strong> 30 × 60 cm</li>
<li><strong>Pack:</strong> 25 bags</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong> and food-safe</li>
<li><strong>Freezer, microwave and sous-vide safe</strong></li>
</ul>`,
    category_slug: "vacuum-bags",
    regular_price: 395,
    stock_status:  "in_stock",
    stock_quantity: 30,
    is_featured:   false,
    sort_order:    8,
    tags:          ["bags", "30x60", "25-pack", "large"],
    primary_image: GENERIC_BAGS_IMG,
    images: [
      { url: GENERIC_BAGS_IMG, alt: "Embossed Vacuum Bags 30 × 60 cm 25 pack", is_primary: true },
    ],
  },
];

// ─── Rolls ───────────────────────────────────────────────────────────────────
const rolls = [
  {
    sku:           "LVR15-6-4",
    name:          "Embossed Vacuum Sealer Rolls 15 cm × 6 m — 4 Rolls",
    slug:          "embossed-vacuum-rolls-15cm-6m-4pack",
    short_description: "15 cm wide embossed vacuum rolls — cut to any length. Ideal for sausages, asparagus, and narrow portions. Pack of 4 × 6 m rolls.",
    description:   `<p>Cut to whatever length you need. The 15 cm width is ideal for sausages, asparagus, narrow fish fillets and herbs. <strong>German-quality embossed rolls</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Width:</strong> 15 cm</li>
<li><strong>Length per roll:</strong> 6 m</li>
<li><strong>Pack:</strong> 4 rolls (24 m total)</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong>, food-safe, freezer and sous-vide safe</li>
</ul>`,
    category_slug: "vacuum-rolls",
    regular_price: 245,
    stock_status:  "in_stock",
    stock_quantity: 30,
    is_featured:   false,
    sort_order:    1,
    tags:          ["rolls", "15cm", "6m", "4-pack"],
    primary_image: "/images/products/rolls/embossed-vacuum-sealer-rolls-15cm-x-6m-4-rolls.webp",
    images: [
      { url: "/images/products/rolls/embossed-vacuum-sealer-rolls-15cm-x-6m-4-rolls.webp", alt: "Embossed Vacuum Rolls 15cm × 6m 4 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVR20-6-2",
    name:          "Embossed Vacuum Sealer Rolls 20 cm × 6 m — 2 Rolls",
    slug:          "embossed-vacuum-rolls-20cm-6m-2pack",
    short_description: "20 cm wide embossed vacuum rolls — most popular width. Perfect for steaks, chops, fish fillets. Pack of 2 × 6 m rolls.",
    description:   `<p>The most popular roll width — fits steaks, chops, fish fillets and medium-sized portions perfectly. <strong>German-quality embossed rolls</strong> compatible with all LAVA machines.</p>
<ul>
<li><strong>Width:</strong> 20 cm</li>
<li><strong>Length per roll:</strong> 6 m</li>
<li><strong>Pack:</strong> 2 rolls (12 m total)</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong>, food-safe, freezer and sous-vide safe</li>
</ul>`,
    category_slug: "vacuum-rolls",
    regular_price: 245,
    stock_status:  "in_stock",
    stock_quantity: 30,
    is_featured:   true,
    sort_order:    2,
    tags:          ["rolls", "20cm", "6m", "2-pack", "most-popular"],
    primary_image: "/images/products/rolls/embossed-vacuum-sealer-rolls-20cm-x-6m-2-rolls.webp",
    images: [
      { url: "/images/products/rolls/embossed-vacuum-sealer-rolls-20cm-x-6m-2-rolls.webp", alt: "Embossed Vacuum Rolls 20cm × 6m 2 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVR25-6-2",
    name:          "Embossed Vacuum Sealer Rolls 25 cm × 6 m — 2 Rolls",
    slug:          "embossed-vacuum-rolls-25cm-6m-2pack",
    short_description: "25 cm wide embossed vacuum rolls for roasts, larger cuts and game portions. Pack of 2 × 6 m rolls.",
    description:   `<p>Great for roasts, larger cuts of meat and game portions where you need a bit more width. <strong>German-quality embossed rolls</strong>.</p>
<ul>
<li><strong>Width:</strong> 25 cm</li>
<li><strong>Length per roll:</strong> 6 m</li>
<li><strong>Pack:</strong> 2 rolls (12 m total)</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong>, food-safe, freezer and sous-vide safe</li>
</ul>`,
    category_slug: "vacuum-rolls",
    regular_price: 265,
    stock_status:  "in_stock",
    stock_quantity: 30,
    is_featured:   false,
    sort_order:    3,
    tags:          ["rolls", "25cm", "6m", "2-pack"],
    primary_image: "/images/products/rolls/embossed-vacuum-sealer-rolls-25cm-x-6m-2-rolls.webp",
    images: [
      { url: "/images/products/rolls/embossed-vacuum-sealer-rolls-25cm-x-6m-2-rolls.webp", alt: "Embossed Vacuum Rolls 25cm × 6m 2 pack", is_primary: true },
    ],
  },
  {
    sku:           "LVR30-6-2",
    name:          "Embossed Vacuum Sealer Rolls 30 cm × 6 m — 2 Rolls",
    slug:          "embossed-vacuum-rolls-30cm-6m-2pack",
    short_description: "30 cm wide embossed vacuum rolls for whole chickens, shoulders, and large game portions. Pack of 2 × 6 m rolls.",
    description:   `<p>For whole chickens, pork shoulders, large game portions and bulky cuts — the widest standard roll. Compatible with LAVA V.100 Premium X and wider models.</p>
<ul>
<li><strong>Width:</strong> 30 cm</li>
<li><strong>Length per roll:</strong> 6 m</li>
<li><strong>Pack:</strong> 2 rolls (12 m total)</li>
<li><strong>Material:</strong> 90μ embossed multi-layer food-safe film</li>
<li><strong>BPA-free</strong>, food-safe, freezer and sous-vide safe</li>
</ul>`,
    category_slug: "vacuum-rolls",
    regular_price: 285,
    stock_status:  "in_stock",
    stock_quantity: 30,
    is_featured:   false,
    sort_order:    4,
    tags:          ["rolls", "30cm", "6m", "2-pack", "large"],
    primary_image: "/images/products/rolls/embossed-vacuum-sealer-rolls-30cm-x-6m-2-rolls.webp",
    images: [
      { url: "/images/products/rolls/embossed-vacuum-sealer-rolls-30cm-x-6m-2-rolls.webp", alt: "Embossed Vacuum Rolls 30cm × 6m 2 pack", is_primary: true },
    ],
  },
];

// ─── Run seed ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding Lava-SA bags & rolls...\n");

  // Insert categories and build slug→id map
  const catMap = {};
  for (const cat of categories) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(cat, { onConflict: "slug" })
      .select()
      .single();
    if (error) { console.error(`Category error (${cat.slug}):`, error.message); process.exit(1); }
    catMap[cat.slug] = data.id;
    console.log(`✓ Category: ${data.name}`);
  }

  // Insert bags
  console.log("\n📦 Bags:");
  for (const item of bags) {
    const { images, category_slug, primary_image, ...productData } = item;
    const { data: product, error } = await supabase
      .from("products")
      .upsert({ ...productData, category_id: catMap[category_slug], primary_image_url: primary_image }, { onConflict: "slug" })
      .select()
      .single();
    if (error) { console.error(`✗ ${item.name}:`, error.message); continue; }

    await supabase.from("product_images").delete().eq("product_id", product.id);
    if (images?.length) {
      await supabase.from("product_images").insert(
        images.map((img, i) => ({ product_id: product.id, url: img.url, alt: img.alt, is_primary: img.is_primary || false, sort_order: i }))
      );
    }
    console.log(`  ✓ ${product.name} — R${product.regular_price}`);
  }

  // Insert rolls
  console.log("\n🎞️  Rolls:");
  for (const item of rolls) {
    const { images, category_slug, primary_image, ...productData } = item;
    const { data: product, error } = await supabase
      .from("products")
      .upsert({ ...productData, category_id: catMap[category_slug], primary_image_url: primary_image }, { onConflict: "slug" })
      .select()
      .single();
    if (error) { console.error(`✗ ${item.name}:`, error.message); continue; }

    await supabase.from("product_images").delete().eq("product_id", product.id);
    if (images?.length) {
      await supabase.from("product_images").insert(
        images.map((img, i) => ({ product_id: product.id, url: img.url, alt: img.alt, is_primary: img.is_primary || false, sort_order: i }))
      );
    }
    console.log(`  ✓ ${product.name} — R${product.regular_price}`);
  }

  console.log("\n✅ Bags & rolls seed complete!");
}

seed().catch((err) => { console.error("Fatal:", err); process.exit(1); });
