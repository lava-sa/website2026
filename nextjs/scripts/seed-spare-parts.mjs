/**
 * Lava-SA — Spare Parts Seeder
 * Run: node scripts/seed-spare-parts.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

const SP = "/images/products/spare-parts";

// ─── 1. Category ────────────────────────────────────────────────────────────
const category = {
  name:        "Spare Parts",
  slug:        "spare-parts",
  description: "Genuine LAVA replacement parts — sealing strips, liquid trap lids and vacuum seals.",
  sort_order:  7,
};

// ─── 2. Products ─────────────────────────────────────────────────────────────
const products = [

  // ══ SEALING STRIPS ══════════════════════════════════════════════════════════

  {
    sku: "VE0201",
    slug: "sealing-strip-v100-v300-premium",
    name: "Replacement Sealing Strip — V.100 / V.300 Premium",
    short_description: "Genuine LAVA replacement sealing strip for V100, V100 Premium, V200, V200 Premium, V300 and V300 Premium machines.",
    description: `<p>Keep your machine sealing like new with a <strong>genuine LAVA replacement sealing strip</strong>. This strip is designed for the <strong>V.100 / V.300 Premium range</strong> and restores full sealing performance.</p>
<p><strong>Compatible with:</strong></p>
<ul>
<li>LAVA V.100 / V.100 Premium</li>
<li>LAVA V.200 / V.200 Premium</li>
<li>LAVA V.300 / V.300 Premium</li>
</ul>
<p>Replace when the seal starts to weaken or if the strip shows signs of wear. A worn sealing strip is the most common cause of failed vacuum seals.</p>`,
    regular_price: 182,
    stock_status:  "in_stock",
    stock_quantity: 22,
    is_featured:   false,
    sort_order:    1,
    tags:          ["spare-part", "sealing-strip", "v100", "v300"],
    specs: {
      fits:      "V.100, V.100 Premium, V.200, V.200 Premium, V.300, V.300 Premium",
      type:      "Sealing Strip",
    },
    primary_image: `${SP}/sealing-strip-v100-v300.jpg`,
    images: [
      { url: `${SP}/sealing-strip-v100-v300.jpg`,        alt: "Replacement sealing strip for LAVA V100 V300 Premium", is_primary: true,  sort_order: 1 },
    ],
  },

  {
    sku: "VE0204",
    slug: "sealing-strip-v400",
    name: "Replacement Sealing Strip — V.400",
    short_description: "Genuine LAVA replacement sealing strip for the V400 commercial vacuum sealer.",
    description: `<p>Genuine <strong>LAVA replacement sealing strip</strong> for the <strong>V.400</strong> commercial vacuum sealer.</p>
<p>Replace when seals are no longer airtight or the strip shows wear. Regular replacement ensures consistent, professional-quality vacuum seals.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.400</li></ul>`,
    regular_price: 182,
    stock_status:  "in_stock",
    stock_quantity: 3,
    is_featured:   false,
    sort_order:    2,
    tags:          ["spare-part", "sealing-strip", "v400"],
    specs: {
      fits: "V.400",
      type: "Sealing Strip",
    },
    primary_image: `${SP}/sealing-strip-v400.jpg`,
    images: [
      { url: `${SP}/sealing-strip-v400.jpg`,     alt: "Replacement sealing strip for LAVA V400", is_primary: true,  sort_order: 1 },
      { url: `${SP}/sealing-strip-v400-002.jpg`, alt: "LAVA V400 sealing strip detail",          is_primary: false, sort_order: 2 },
    ],
  },

  {
    sku: "VE0209",
    slug: "sealing-strip-v400-premium",
    name: "Replacement Sealing Strip — V.400 Premium",
    short_description: "Genuine LAVA replacement sealing strip for the V400 Premium commercial vacuum sealer.",
    description: `<p>Genuine <strong>LAVA replacement sealing strip</strong> for the <strong>V.400 Premium</strong> commercial vacuum sealer.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.400 Premium</li></ul>`,
    regular_price: 202,
    stock_status:  "in_stock",
    stock_quantity: 3,
    is_featured:   false,
    sort_order:    3,
    tags:          ["spare-part", "sealing-strip", "v400", "v400-premium"],
    specs: {
      fits: "V.400 Premium",
      type: "Sealing Strip",
    },
    primary_image: `${SP}/sealing-strip-v400.jpg`,
    images: [
      { url: `${SP}/sealing-strip-v400.jpg`,     alt: "Replacement sealing strip for LAVA V400 Premium", is_primary: true,  sort_order: 1 },
      { url: `${SP}/sealing-strip-v400-002.jpg`, alt: "LAVA V400 Premium sealing strip detail",           is_primary: false, sort_order: 2 },
    ],
  },

  {
    sku: "VE0206",
    slug: "sealing-strip-v500",
    name: "Replacement Sealing Strip — V.500",
    short_description: "Genuine LAVA replacement sealing strip for the V500 industrial vacuum sealer.",
    description: `<p>Genuine <strong>LAVA replacement sealing strip</strong> for the <strong>V.500</strong> industrial vacuum sealer.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.500</li></ul>`,
    regular_price: 223,
    stock_status:  "in_stock",
    stock_quantity: 3,
    is_featured:   false,
    sort_order:    4,
    tags:          ["spare-part", "sealing-strip", "v500"],
    specs: {
      fits: "V.500",
      type: "Sealing Strip",
    },
    primary_image: `${SP}/sealing-strip-v500.jpg`,
    images: [
      { url: `${SP}/sealing-strip-v500.jpg`,     alt: "Replacement sealing strip for LAVA V500", is_primary: true,  sort_order: 1 },
      { url: `${SP}/sealing-strip-v500-002.jpg`, alt: "LAVA V500 sealing strip detail",          is_primary: false, sort_order: 2 },
    ],
  },

  {
    sku: "VE0207",
    slug: "sealing-strip-v500-premium",
    name: "Replacement Sealing Strip — V.500 Premium",
    short_description: "Genuine LAVA replacement sealing strip for the V500 Premium industrial vacuum sealer.",
    description: `<p>Genuine <strong>LAVA replacement sealing strip</strong> for the <strong>V.500 Premium</strong> industrial vacuum sealer.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.500 Premium</li></ul>`,
    regular_price: 243,
    stock_status:  "in_stock",
    stock_quantity: 2,
    is_featured:   false,
    sort_order:    5,
    tags:          ["spare-part", "sealing-strip", "v500", "v500-premium"],
    specs: {
      fits: "V.500 Premium",
      type: "Sealing Strip",
    },
    primary_image: `${SP}/sealing-strip-v500.jpg`,
    images: [
      { url: `${SP}/sealing-strip-v500.jpg`,     alt: "Replacement sealing strip for LAVA V500 Premium", is_primary: true,  sort_order: 1 },
      { url: `${SP}/sealing-strip-v500-002.jpg`, alt: "LAVA V500 Premium sealing strip detail",           is_primary: false, sort_order: 2 },
    ],
  },

  // ══ LIQUID TRAP LIDS ════════════════════════════════════════════════════════

  {
    sku: "VE0601",
    slug: "liquid-trap-lid-v100-classic-premium",
    name: "Replacement Liquid Trap Lid — V.100 Classic & Premium",
    short_description: "Manual screw-top replacement liquid trap lid for V100, V200, V300 and V333 Chrome machines.",
    description: `<p>This <strong>replacement liquid trap lid</strong> features a manual screw top and restores the liquid collection function on your machine. A damaged or cracked lid can reduce vacuum performance.</p>
<p><strong>Compatible with:</strong></p>
<ul>
<li>LAVA V.100 / V.100 Premium</li>
<li>LAVA V.200 / V.200 Premium</li>
<li>LAVA V.300 / V.300 Premium</li>
<li>LAVA V.333 Chrome</li>
</ul>`,
    regular_price: 250,
    stock_status:  "in_stock",
    stock_quantity: 2,
    is_featured:   false,
    sort_order:    6,
    tags:          ["spare-part", "liquid-trap", "v100", "v300", "v333"],
    specs: {
      fits:    "V.100, V.100 Premium, V.200, V.200 Premium, V.300, V.300 Premium, V.333 Chrome",
      closure: "Manual screw top",
      type:    "Liquid Trap Lid",
    },
    primary_image: `${SP}/liquid-trap-lid-v100.jpg`,
    images: [
      { url: `${SP}/liquid-trap-lid-v100.jpg`, alt: "Replacement liquid trap lid for LAVA V100 V300 Classic", is_primary: true, sort_order: 1 },
    ],
  },

  {
    sku: "VE0602",
    slug: "liquid-trap-lid-v400-v500-classic",
    name: "Replacement Liquid Trap Lid — V.400 & V.500 Classic",
    short_description: "Blue replacement liquid trap lid for V400 and V500 Classic commercial vacuum sealers.",
    description: `<p>Genuine blue <strong>replacement liquid trap lid</strong> for the V.400 and V.500 Classic commercial vacuum sealers. Replace when cracked or damaged to maintain full vacuum performance.</p>
<p><strong>Compatible with:</strong></p>
<ul>
<li>LAVA V.400 (Classic)</li>
<li>LAVA V.500 (Classic)</li>
</ul>`,
    regular_price: 200,
    stock_status:  "in_stock",
    stock_quantity: 3,
    is_featured:   false,
    sort_order:    7,
    tags:          ["spare-part", "liquid-trap", "v400", "v500"],
    specs: {
      fits:   "V.400 Classic, V.500 Classic",
      colour: "Blue",
      type:   "Liquid Trap Lid",
    },
    primary_image: `${SP}/liquid-trap-lid-v400-v500-classic.jpg`,
    images: [
      { url: `${SP}/liquid-trap-lid-v400-v500-classic.jpg`, alt: "Replacement liquid trap lid for LAVA V400 V500 Classic", is_primary: true, sort_order: 1 },
    ],
  },

  {
    sku: "VE0602-1",
    slug: "liquid-trap-lid-v400-v500-premium",
    name: "Replacement Liquid Trap Lid — V.400 & V.500 Premium",
    short_description: "Blue replacement liquid trap lid for V400 Premium and V500 Premium commercial vacuum sealers.",
    description: `<p>Genuine blue <strong>replacement liquid trap lid</strong> for the V.400 Premium and V.500 Premium commercial vacuum sealers.</p>
<p><strong>Compatible with:</strong></p>
<ul>
<li>LAVA V.400 Premium</li>
<li>LAVA V.500 Premium</li>
</ul>`,
    regular_price: 250,
    stock_status:  "in_stock",
    stock_quantity: 3,
    is_featured:   false,
    sort_order:    8,
    tags:          ["spare-part", "liquid-trap", "v400", "v500", "premium"],
    specs: {
      fits:   "V.400 Premium, V.500 Premium",
      colour: "Blue",
      type:   "Liquid Trap Lid",
    },
    primary_image: `${SP}/liquid-trap-lid-v400-v500-premium.jpg`,
    images: [
      { url: `${SP}/liquid-trap-lid-v400-v500-premium.jpg`,     alt: "Replacement liquid trap lid for LAVA V400 V500 Premium",         is_primary: true,  sort_order: 1 },
      { url: `${SP}/liquid-trap-lid-v400-v500-premium-002.jpg`, alt: "LAVA V400 V500 Premium liquid trap lid — alternate view",        is_primary: false, sort_order: 2 },
      { url: `${SP}/liquid-trap-lid-v400-v500-premium-003.jpg`, alt: "LAVA V400 V500 Premium liquid trap lid — installed view",        is_primary: false, sort_order: 3 },
    ],
  },

  // ══ VACUUM SEALS (FOAM SETS) ═════════════════════════════════════════════════

  {
    sku: "VE0701",
    slug: "vacuum-seals-v100-v300",
    name: "Replacement Vacuum Seals — V.100 / V.300 Range",
    short_description: "Set of top and bottom foam vacuum seals for V100, V200 and V300 machines. Restores airtight performance.",
    description: `<p>This <strong>replacement vacuum seal set</strong> contains both the top and bottom foam seals for the V.100 / V.300 range. Over time the foam compresses and loses its airtight properties — replacing the seals restores full machine performance.</p>
<p><strong>Compatible with:</strong></p>
<ul>
<li>LAVA V.100 / V.100 Premium</li>
<li>LAVA V.200 / V.200 Premium</li>
<li>LAVA V.300 / V.300 Premium</li>
</ul>
<p>Set includes: top seal + bottom seal.</p>`,
    regular_price: 750,
    stock_status:  "in_stock",
    stock_quantity: 22,
    is_featured:   false,
    sort_order:    9,
    tags:          ["spare-part", "vacuum-seals", "foam-seal", "v100", "v300"],
    specs: {
      fits:     "V.100, V.100 Premium, V.200, V.200 Premium, V.300, V.300 Premium",
      includes: "Top seal + bottom seal",
      type:     "Vacuum Seal Set",
    },
    primary_image: `${SP}/vacuum-seals-foam-set.jpg`,
    images: [
      { url: `${SP}/vacuum-seals-foam-set.jpg`, alt: "Replacement vacuum foam seals for LAVA V100 V300", is_primary: true, sort_order: 1 },
    ],
  },

  {
    sku: "VE0703",
    slug: "vacuum-seals-v333",
    name: "Replacement Vacuum Seals — V.333",
    short_description: "Set of top and bottom foam vacuum seals for the LAVA V333 Chrome machine.",
    description: `<p>Genuine <strong>replacement foam vacuum seal set</strong> for the <strong>LAVA V.333 Chrome</strong>. Restores the airtight seal when the existing seals show compression or wear.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.333 Chrome</li></ul>
<p>Set includes: top seal + bottom seal.</p>`,
    regular_price: 750,
    stock_status:  "in_stock",
    stock_quantity: 2,
    is_featured:   false,
    sort_order:    10,
    tags:          ["spare-part", "vacuum-seals", "foam-seal", "v333"],
    specs: {
      fits:     "V.333 Chrome",
      includes: "Top seal + bottom seal",
      type:     "Vacuum Seal Set",
    },
    primary_image: `${SP}/vacuum-seals-foam-set.jpg`,
    images: [
      { url: `${SP}/vacuum-seals-foam-set.jpg`, alt: "Replacement vacuum foam seals for LAVA V333 Chrome", is_primary: true, sort_order: 1 },
    ],
  },

  {
    sku: "VE0704",
    slug: "vacuum-seals-v400-classic",
    name: "Replacement Vacuum Seals — V.400 Classic",
    short_description: "Set of top and bottom foam vacuum seals for the LAVA V400 Classic commercial sealer.",
    description: `<p>Genuine <strong>replacement foam vacuum seal set</strong> for the <strong>LAVA V.400 Classic</strong> commercial vacuum sealer.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.400 (Classic)</li></ul>
<p>Set includes: top seal + bottom seal.</p>`,
    regular_price: 650,
    stock_status:  "in_stock",
    stock_quantity: 2,
    is_featured:   false,
    sort_order:    11,
    tags:          ["spare-part", "vacuum-seals", "foam-seal", "v400"],
    specs: {
      fits:     "V.400 Classic",
      includes: "Top seal + bottom seal",
      type:     "Vacuum Seal Set",
    },
    primary_image: `${SP}/vacuum-seals-foam-set.jpg`,
    images: [
      { url: `${SP}/vacuum-seals-foam-set.jpg`, alt: "Replacement vacuum foam seals for LAVA V400 Classic", is_primary: true, sort_order: 1 },
    ],
  },

  {
    sku: "VE0708",
    slug: "vacuum-seals-v400-premium",
    name: "Replacement Vacuum Seals — V.400 Premium",
    short_description: "Set of top and bottom foam vacuum seals for the LAVA V400 Premium commercial sealer.",
    description: `<p>Genuine <strong>replacement foam vacuum seal set</strong> for the <strong>LAVA V.400 Premium</strong> commercial vacuum sealer.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.400 Premium</li></ul>
<p>Set includes: top seal + bottom seal.</p>`,
    regular_price: 850,
    stock_status:  "in_stock",
    stock_quantity: 3,
    is_featured:   false,
    sort_order:    12,
    tags:          ["spare-part", "vacuum-seals", "foam-seal", "v400", "v400-premium"],
    specs: {
      fits:     "V.400 Premium",
      includes: "Top seal + bottom seal",
      type:     "Vacuum Seal Set",
    },
    primary_image: `${SP}/vacuum-seals-foam-set.jpg`,
    images: [
      { url: `${SP}/vacuum-seals-foam-set.jpg`, alt: "Replacement vacuum foam seals for LAVA V400 Premium", is_primary: true, sort_order: 1 },
    ],
  },

  {
    sku: "VE0706",
    slug: "vacuum-seals-v500",
    name: "Replacement Vacuum Seals — V.500",
    short_description: "Set of top and bottom foam vacuum seals for the LAVA V500 industrial vacuum sealer.",
    description: `<p>Genuine <strong>replacement foam vacuum seal set</strong> for the <strong>LAVA V.500</strong> industrial vacuum sealer.</p>
<p><strong>Compatible with:</strong></p>
<ul><li>LAVA V.500</li></ul>
<p>Set includes: top seal + bottom seal.</p>`,
    regular_price: 850,
    stock_status:  "in_stock",
    stock_quantity: 2,
    is_featured:   false,
    sort_order:    13,
    tags:          ["spare-part", "vacuum-seals", "foam-seal", "v500"],
    specs: {
      fits:     "V.500",
      includes: "Top seal + bottom seal",
      type:     "Vacuum Seal Set",
    },
    primary_image: `${SP}/vacuum-seals-foam-set.jpg`,
    images: [
      { url: `${SP}/vacuum-seals-foam-set.jpg`, alt: "Replacement vacuum foam seals for LAVA V500", is_primary: true, sort_order: 1 },
    ],
  },
];

// ─── 3. Seed ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log("── Spare Parts Seeder ──────────────────────────");

  // Upsert category
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .upsert(category, { onConflict: "slug" })
    .select("id")
    .single();

  if (catErr) { console.error("Category error:", catErr.message); process.exit(1); }
  const categoryId = cat.id;
  console.log(`✓ Category: ${categoryId}`);

  let inserted = 0, skipped = 0;

  for (const p of products) {
    const { images, primary_image, ...productData } = p;

    const row = {
      ...productData,
      category_id:       categoryId,
      is_published:      true,
      primary_image_url: primary_image,
      seo_title:         `${p.name} — LAVA Genuine Spare Part`,
      seo_description:   p.short_description,
      industries:        [],
    };

    const { data: product, error: pErr } = await supabase
      .from("products")
      .upsert(row, { onConflict: "slug" })
      .select("id, slug")
      .single();

    if (pErr) { console.error(`  ✗ ${p.slug}: ${pErr.message}`); skipped++; continue; }

    // Delete old images then re-insert
    await supabase.from("product_images").delete().eq("product_id", product.id);

    const imageRows = images.map((img) => ({ ...img, product_id: product.id }));
    const { error: imgErr } = await supabase.from("product_images").insert(imageRows);
    if (imgErr) console.warn(`  ⚠ images for ${p.slug}: ${imgErr.message}`);

    console.log(`  ✓ ${product.slug}`);
    inserted++;
  }

  console.log(`\n✓ Done — ${inserted} inserted, ${skipped} skipped.`);
}

seed().catch(console.error);
