/**
 * Lava-SA — Containers & Lids Seeder
 * Run: node scripts/seed-containers.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

const C = "/images/products/containers";
const L = "/images/products/lids";

const category = {
  name: "Containers & Lids", slug: "containers-lids",
  description: "LAVA acrylic and stainless steel vacuum containers and lids. Compatible with all LAVA vacuum sealing machines.",
  sort_order: 4,
};

const products = [
  // ── Acrylic individual ──────────────────────────────────────────────────────
  {
    sku: "VL0060-1", slug: "acrylic-container-650ml-square",
    name: "LAVA 650ml Square Acrylic Vacuum Container",
    short_description: "Compact 650ml square acrylic vacuum container. Perfect for herbs, spices, nuts, cheese and small portions. Includes lid.",
    description: `<p>The <strong>LAVA 650ml Square Acrylic Container</strong> is ideal for herbs, spices, nuts, coffee and small portions. Works with the vacuum pump attachment included with all LAVA machines.</p>
<ul><li><strong>Capacity:</strong> 650 ml</li><li><strong>Shape:</strong> Square</li><li>Crystal-clear BPA-free acrylic</li><li>Lid included</li><li>Dishwasher safe</li></ul>`,
    regular_price: 510, stock_status: "in_stock", stock_quantity: 10,
    is_featured: false, sort_order: 1, tags: ["container", "acrylic", "650ml", "square"],
    primary_image: `${C}/lava-650ml-square-acrylic-vacuum-container-versatile-food-preservation-system-vl0060-1.webp`,
    images: [{ url: `${C}/lava-650ml-square-acrylic-vacuum-container-versatile-food-preservation-system-vl0060-1.webp`, alt: "LAVA 650ml Square Acrylic Container", is_primary: true }],
  },
  {
    sku: "VL0063-1", slug: "acrylic-container-1000ml-round",
    name: "LAVA 1000ml Round Acrylic Vacuum Container",
    short_description: "1000ml round acrylic vacuum container — ideal for marinating meat, storing fruit and vegetables. Includes lid.",
    description: `<p>The <strong>LAVA 1000ml Round Acrylic Container</strong> is the ideal size for marinating steaks and chops, storing sliced fruit, vegetables and meal-prep portions.</p>
<ul><li><strong>Capacity:</strong> 1000 ml</li><li><strong>Shape:</strong> Round</li><li>Crystal-clear BPA-free acrylic</li><li>Lid included</li><li>Dishwasher safe</li></ul>`,
    regular_price: 590, stock_status: "in_stock", stock_quantity: 10,
    is_featured: true, sort_order: 2, tags: ["container", "acrylic", "1000ml", "round"],
    primary_image: `${C}/lava-1000ml-round-acrylic-vacuum-container-premium-food-storage-solution-vl0063-1.webp`,
    images: [{ url: `${C}/lava-1000ml-round-acrylic-vacuum-container-premium-food-storage-solution-vl0063-1.webp`, alt: "LAVA 1000ml Round Acrylic Container", is_primary: true }],
  },
  {
    sku: "VL0065-1", slug: "acrylic-container-1200ml-square",
    name: "LAVA 1200ml Square Acrylic Vacuum Container",
    short_description: "1200ml square acrylic container for larger portions — steaks, chops, marinated meat. Includes lid.",
    description: `<p>The <strong>LAVA 1200ml Square Acrylic Container</strong> handles larger portions — marinating steaks and chops, storing prepared meals and preserving leftovers.</p>
<ul><li><strong>Capacity:</strong> 1200 ml</li><li><strong>Shape:</strong> Square</li><li>Crystal-clear BPA-free acrylic</li><li>Lid included</li><li>Dishwasher safe</li></ul>`,
    regular_price: 665, stock_status: "in_stock", stock_quantity: 10,
    is_featured: false, sort_order: 3, tags: ["container", "acrylic", "1200ml", "square"],
    primary_image: `${C}/lava-1200ml-square-acrylic-vacuum-container-professional-food-storage-system-vl0065-1.webp`,
    images: [{ url: `${C}/lava-1200ml-square-acrylic-vacuum-container-professional-food-storage-system-vl0065-1.webp`, alt: "LAVA 1200ml Square Acrylic Container", is_primary: true }],
  },
  {
    sku: "VL0066-1", slug: "acrylic-container-1650ml-rectangular",
    name: "LAVA 1650ml Rectangular Acrylic Vacuum Container",
    short_description: "1650ml rectangular acrylic container — perfect for long cuts, whole fish and biltong strips.",
    description: `<p>The <strong>LAVA 1650ml Rectangular Acrylic Container</strong> suits longer items — whole fish, long biltong strips, large roasts and bulky portions.</p>
<ul><li><strong>Capacity:</strong> 1650 ml</li><li><strong>Shape:</strong> Rectangular</li><li>Crystal-clear BPA-free acrylic</li><li>Lid included</li><li>Dishwasher safe</li></ul>`,
    regular_price: 880, stock_status: "in_stock", stock_quantity: 10,
    is_featured: false, sort_order: 4, tags: ["container", "acrylic", "1650ml", "rectangular"],
    primary_image: `${C}/lava-1650ml-rectangular-acrylic-vacuum-container-high-capacity-professional-storage-solution-vl0066-1.webp`,
    images: [{ url: `${C}/lava-1650ml-rectangular-acrylic-vacuum-container-high-capacity-professional-storage-solution-vl0066-1.webp`, alt: "LAVA 1650ml Rectangular Acrylic Container", is_primary: true }],
  },
  {
    sku: "VL0058-1", slug: "acrylic-container-2000ml-square",
    name: "LAVA 2000ml Square Acrylic Vacuum Container",
    short_description: "2000ml large square acrylic container — maximum capacity for big batches, marinating large cuts and meal prep.",
    description: `<p>The <strong>LAVA 2000ml Square Acrylic Container</strong> is the largest individual container — ideal for batch marinating, big game cuts and large meal prep quantities.</p>
<ul><li><strong>Capacity:</strong> 2000 ml</li><li><strong>Shape:</strong> Square</li><li>Crystal-clear BPA-free acrylic</li><li>Lid included</li><li>Dishwasher safe</li></ul>`,
    regular_price: 990, stock_status: "in_stock", stock_quantity: 10,
    is_featured: false, sort_order: 5, tags: ["container", "acrylic", "2000ml", "square"],
    primary_image: `${C}/lava-2000ml-square-acrylic-vacuum-container-maximum-capacity-professional-storage-system-vl0058-1.webp`,
    images: [{ url: `${C}/lava-2000ml-square-acrylic-vacuum-container-maximum-capacity-professional-storage-system-vl0058-1.webp`, alt: "LAVA 2000ml Square Acrylic Container", is_primary: true }],
  },
  // ── Acrylic set ─────────────────────────────────────────────────────────────
  {
    sku: "VL0009-1", slug: "acrylic-container-set-4-piece",
    name: "LAVA 4-Piece Acrylic Vacuum Container Set",
    short_description: "Complete 4-piece acrylic vacuum container set — one of each key size. Best value for a complete vacuum storage solution.",
    description: `<p>The <strong>LAVA 4-Piece Acrylic Container Set</strong> gives you a complete range of sizes — the best way to start your vacuum storage system.</p>
<ul><li><strong>Includes:</strong> 4 containers in assorted sizes (650ml, 1000ml, 1200ml, 2000ml)</li><li>Crystal-clear BPA-free acrylic</li><li>All lids included</li><li>Works with all LAVA machines via vacuum pump attachment</li><li>Dishwasher safe</li></ul>`,
    regular_price: 1990, stock_status: "in_stock", stock_quantity: 5,
    is_featured: true, sort_order: 6, tags: ["container", "acrylic", "set", "4-piece", "bundle"],
    primary_image: `${C}/lava-4-piece-acrylic-vacuum-container-set-complete-food-preservation-system-vl0009-1.webp`,
    images: [
      { url: `${C}/lava-4-piece-acrylic-vacuum-container-set-complete-food-preservation-system-vl0009-1.webp`, alt: "LAVA 4-Piece Acrylic Container Set", is_primary: true },
      { url: `${C}/lava-4-piece-acrylic-vacuum-container-set-complete-food-preservation-system-vl0058-1.webp`, alt: "LAVA 4-Piece Set — contents" },
    ],
  },
  // ── ES-Line individual ──────────────────────────────────────────────────────
  {
    sku: "VL0075", slug: "es-line-stainless-container-1300ml",
    name: "LAVA 1300ml ES-Line Stainless Steel Vacuum Container",
    short_description: "1300ml premium stainless steel vacuum container. Odour-resistant, dishwasher safe, built to last a lifetime.",
    description: `<p>The <strong>LAVA 1300ml ES-Line Stainless Steel Container</strong> is the premium everyday container — odour-resistant, stain-resistant, and fully dishwasher safe.</p>
<ul><li><strong>Capacity:</strong> 1300 ml</li><li><strong>Material:</strong> 18/8 stainless steel</li><li>Odour and stain resistant</li><li>Lid included</li><li>Fully dishwasher safe</li><li>Works with all LAVA machines via pump attachment</li></ul>`,
    regular_price: 1450, stock_status: "in_stock", stock_quantity: 5,
    is_featured: false, sort_order: 7, tags: ["container", "stainless-steel", "es-line", "1300ml"],
    primary_image: `${C}/lava-1300ml-es-line-stainless-steel-vacuum-container-premium-professional-storage-solution-vl0075.webp`,
    images: [{ url: `${C}/lava-1300ml-es-line-stainless-steel-vacuum-container-premium-professional-storage-solution-vl0075.webp`, alt: "LAVA 1300ml ES-Line Stainless Steel Container", is_primary: true }],
  },
  {
    sku: "VL0076", slug: "es-line-stainless-container-2500ml",
    name: "LAVA 2500ml ES-Line Stainless Steel Vacuum Container",
    short_description: "2500ml high-capacity stainless steel vacuum container. For larger portions, marinating and batch storage.",
    description: `<p>The <strong>LAVA 2500ml ES-Line Stainless Steel Container</strong> is designed for larger quantities — marinating roasts, batch meal prep, and bulk storage.</p>
<ul><li><strong>Capacity:</strong> 2500 ml</li><li><strong>Material:</strong> 18/8 stainless steel</li><li>Odour and stain resistant</li><li>Lid included</li><li>Fully dishwasher safe</li></ul>`,
    regular_price: 1950, stock_status: "in_stock", stock_quantity: 5,
    is_featured: false, sort_order: 8, tags: ["container", "stainless-steel", "es-line", "2500ml"],
    primary_image: `${C}/lava-2500ml-es-line-stainless-steel-vacuum-container-high-capacity-professional-storage-solution-vl0076.webp`,
    images: [{ url: `${C}/lava-2500ml-es-line-stainless-steel-vacuum-container-high-capacity-professional-storage-solution-vl0076.webp`, alt: "LAVA 2500ml ES-Line Stainless Steel Container", is_primary: true }],
  },
  {
    sku: "VL0077", slug: "es-line-stainless-container-4000ml",
    name: "LAVA 4000ml ES-Line Stainless Steel Vacuum Container",
    short_description: "4000ml maximum-capacity stainless steel vacuum container. Ideal for large game portions, professional kitchens and catering.",
    description: `<p>The <strong>LAVA 4000ml ES-Line Stainless Steel Container</strong> is the largest individual container in the range — built for large game portions, catering operations and serious home preservers.</p>
<ul><li><strong>Capacity:</strong> 4000 ml</li><li><strong>Material:</strong> 18/8 stainless steel</li><li>Odour and stain resistant</li><li>Lid included</li><li>Fully dishwasher safe</li></ul>`,
    regular_price: 2950, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 9, tags: ["container", "stainless-steel", "es-line", "4000ml", "large"],
    primary_image: `${C}/lava-4000ml-es-line-stainless-steel-vacuum-container-maximum-capacity-industrial-storage-solution-vl0077.webp`,
    images: [{ url: `${C}/lava-4000ml-es-line-stainless-steel-vacuum-container-maximum-capacity-industrial-storage-solution-vl0077.webp`, alt: "LAVA 4000ml ES-Line Stainless Steel Container", is_primary: true }],
  },
  // ── ES-Line set ─────────────────────────────────────────────────────────────
  {
    sku: "VL0078", slug: "es-line-stainless-container-set-3-piece",
    name: "LAVA ES-Line 3-Piece Stainless Steel Container Set",
    short_description: "Premium 3-piece ES-Line stainless steel container set. Dishwasher safe, odour-resistant, lifetime durability.",
    description: `<p>The <strong>LAVA ES-Line 3-Piece Stainless Steel Set</strong> is the premium choice for serious vacuum storage. Stainless steel won't absorb odours, is completely dishwasher safe and will last a lifetime.</p>
<ul><li><strong>Includes:</strong> 1300ml, 2500ml & 4000ml containers</li><li>18/8 stainless steel throughout</li><li>Odour and stain resistant</li><li>All lids included</li><li>Fully dishwasher safe</li><li>Works with all LAVA machines via pump attachment</li></ul>`,
    regular_price: 3515, stock_status: "on_order", stock_quantity: 0,
    is_featured: true, sort_order: 10, tags: ["container", "stainless-steel", "es-line", "set", "3-piece", "premium"],
    primary_image: `${C}/lava-3-piece-es-line-stainless-steel-vacuum-container-set-complete-professional-storage-system-vl0078.webp`,
    images: [
      { url: `${C}/lava-3-piece-es-line-stainless-steel-vacuum-container-set-complete-professional-storage-system-vl0078.webp`, alt: "LAVA ES-Line 3-Piece Stainless Steel Set", is_primary: true },
      { url: `${C}/lava-3-piece-es-line-stainless-steel-vacuum-container-set-complete-professional-storage-system-vl0078-a.webp`, alt: "LAVA ES-Line Set — detail" },
    ],
  },
  // ── Lids ────────────────────────────────────────────────────────────────────
  {
    sku: "VL0083", slug: "acrylic-container-lid-160-203mm",
    name: "LAVA Acrylic Container Lid 160–203mm",
    short_description: "Replacement acrylic vacuum container lid for containers 160–203mm diameter. Includes vacuum valve.",
    description: `<p>Replacement lid for LAVA acrylic vacuum containers with a diameter of <strong>160–203mm</strong>. Includes integrated vacuum valve.</p>
<ul><li><strong>Fits:</strong> 160–203mm diameter containers</li><li>Includes vacuum valve</li><li>BPA-free acrylic</li><li>Dishwasher safe</li></ul>`,
    regular_price: 195, stock_status: "in_stock", stock_quantity: 20,
    is_featured: false, sort_order: 11, tags: ["lid", "acrylic", "replacement", "160-203mm"],
    primary_image: `${L}/lava-sa-vacuum-container-acrylic-lid-160-203mm-vl0083.webp`,
    images: [{ url: `${L}/lava-sa-vacuum-container-acrylic-lid-160-203mm-vl0083.webp`, alt: "LAVA Acrylic Lid 160-203mm", is_primary: true }],
  },
  {
    sku: "VL0084", slug: "acrylic-container-lid-204-237mm",
    name: "LAVA Acrylic Container Lid 204–237mm",
    short_description: "Replacement acrylic vacuum container lid for containers 204–237mm diameter. Includes vacuum valve.",
    description: `<p>Replacement lid for LAVA acrylic containers with a diameter of <strong>204–237mm</strong>.</p>
<ul><li><strong>Fits:</strong> 204–237mm diameter containers</li><li>Includes vacuum valve</li><li>BPA-free acrylic</li><li>Dishwasher safe</li></ul>`,
    regular_price: 195, stock_status: "in_stock", stock_quantity: 20,
    is_featured: false, sort_order: 12, tags: ["lid", "acrylic", "replacement", "204-237mm"],
    primary_image: `${L}/lava-sa-vacuum-container-acrylic-lid-204-237mm-vl0084.webp`,
    images: [{ url: `${L}/lava-sa-vacuum-container-acrylic-lid-204-237mm-vl0084.webp`, alt: "LAVA Acrylic Lid 204-237mm", is_primary: true }],
  },
  {
    sku: "VL0085", slug: "acrylic-container-lid-238-280mm",
    name: "LAVA Acrylic Container Lid 238–280mm",
    short_description: "Replacement acrylic vacuum container lid for containers 238–280mm diameter. Includes vacuum valve.",
    description: `<p>Replacement lid for LAVA acrylic containers with a diameter of <strong>238–280mm</strong>.</p>
<ul><li><strong>Fits:</strong> 238–280mm diameter containers</li><li>Includes vacuum valve</li><li>BPA-free acrylic</li><li>Dishwasher safe</li></ul>`,
    regular_price: 195, stock_status: "in_stock", stock_quantity: 20,
    is_featured: false, sort_order: 13, tags: ["lid", "acrylic", "replacement", "238-280mm"],
    primary_image: `${L}/lava-sa-vacuum-container-acrylic-lid-238-280mm-vl0085.webp`,
    images: [{ url: `${L}/lava-sa-vacuum-container-acrylic-lid-238-280mm-vl0085.webp`, alt: "LAVA Acrylic Lid 238-280mm", is_primary: true }],
  },
];

async function seed() {
  console.log("🌱 Seeding containers & lids...\n");

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

  console.log("\n✅ Containers & lids seed complete!");
}

seed().catch((err) => { console.error("Fatal:", err); process.exit(1); });
