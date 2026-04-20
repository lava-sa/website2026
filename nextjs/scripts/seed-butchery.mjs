/**
 * Lava-SA — Butchery Accessories Seeder
 * Run: node scripts/seed-butchery.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

const B = "/images/products/butchery";

const category = {
  name: "Butchery Accessories", slug: "butchery-accessories",
  description: "Professional butchery tools, knives, hanging systems, scales and protective clothing.",
  sort_order: 5,
};

const products = [
  // ── KNIVES ───────────────────────────────────────────────────────────────────
  {
    sku: "Z11010", slug: "boning-knife-13cm",
    name: "Professional Boning Knife — 13cm Premium Blade",
    short_description: "Precision 13cm boning knife for deboning and trimming. Ideal for hunters and home butchers.",
    description: `<p>The <strong>13cm boning knife</strong> is the go-to tool for separating meat from bone with maximum yield. Perfect balance of flexibility and rigidity for clean, precise cuts.</p><ul><li>13cm high-quality steel blade</li><li>Ergonomic handle for wet-hand grip</li><li>Ideal for game processing, poultry and pork</li></ul>`,
    regular_price: 302, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 1, tags: ["knife", "boning", "13cm"],
    primary_image: `${B}/professional-boning-knife-premium-13cm-blade-butcher-quality.webp`,
    images: [{ url: `${B}/professional-boning-knife-premium-13cm-blade-butcher-quality.webp`, alt: "Professional Boning Knife 13cm", is_primary: true }],
  },
  {
    sku: "Z11012", slug: "cutting-knife-18cm",
    name: "Professional Cutting Knife — 18cm Premium Blade",
    short_description: "Versatile 18cm cutting knife for slicing, trimming and portioning. High-carbon stainless steel.",
    description: `<p>The <strong>18cm cutting knife</strong> is the everyday workhorse — perfect for slicing steaks, trimming fat and portioning cuts. High-carbon stainless steel holds a razor edge through demanding use.</p><ul><li>18cm high-carbon stainless steel blade</li><li>Ergonomic handle</li><li>Ideal for slicing and portioning all cuts of meat</li></ul>`,
    regular_price: 302, stock_status: "in_stock", stock_quantity: 2,
    is_featured: false, sort_order: 2, tags: ["knife", "cutting", "18cm"],
    primary_image: `${B}/professional-cutting-knife-premium-18cm-blade-butcher-grade.webp`,
    images: [{ url: `${B}/professional-cutting-knife-premium-18cm-blade-butcher-grade.webp`, alt: "Professional Cutting Knife 18cm", is_primary: true }],
  },
  {
    sku: "Z11021A", slug: "cutting-knife-21cm",
    name: "Professional Butcher Cutting Knife — 21cm Heavy-Duty",
    short_description: "Extended 21cm blade for larger cuts, breaking down quarters and heavy-duty butchery work.",
    description: `<p>The <strong>21cm butcher knife</strong> provides the extra reach and leverage needed for breaking down larger cuts, quarters and substantial game portions.</p><ul><li>21cm premium steel blade</li><li>Balanced design for extended use</li><li>Ideal for breaking down game and larger meat portions</li></ul>`,
    regular_price: 403, stock_status: "in_stock", stock_quantity: 6,
    is_featured: false, sort_order: 3, tags: ["knife", "cutting", "21cm", "heavy-duty"],
    primary_image: `${B}/professional-butcher-cutting-knife-premium-21cm-blade-heavy-duty.webp`,
    images: [{ url: `${B}/professional-butcher-cutting-knife-premium-21cm-blade-heavy-duty.webp`, alt: "Professional Butcher Cutting Knife 21cm", is_primary: true }],
  },
  {
    sku: "Z11055", slug: "giesser-gutting-knife-16cm",
    name: "Professional Giesser Gutting Knife — 16cm Chrome-Molybdenum",
    short_description: "Premium Giesser gutting knife with protective button tip to prevent intestine damage. Chrome-molybdenum steel.",
    description: `<p>The <strong>Giesser Gutting Knife</strong> is built for field dressing. The unique protective button on the blade tip prevents accidental puncture of intestines — keeping meat quality intact.</p><ul><li>16cm chrome-molybdenum steel blade</li><li>Protective button tip — prevents intestine damage</li><li>Ergonomic black handle</li><li>Trusted by professional hunters and butchers worldwide</li></ul>`,
    regular_price: 605, stock_status: "in_stock", stock_quantity: 7,
    is_featured: true, sort_order: 4, tags: ["knife", "gutting", "giesser", "hunting"],
    primary_image: `${B}/professional-giesser-gutting-knife-premium-16cm-chrome-molybdenum-steel.webp`,
    images: [{ url: `${B}/professional-giesser-gutting-knife-premium-16cm-chrome-molybdenum-steel.webp`, alt: "Giesser Gutting Knife 16cm", is_primary: true }],
  },
  {
    sku: "Z11011", slug: "skinner-knife-16cm-yellow",
    name: "Professional Skinner Knife — 16cm Yellow Handle",
    short_description: "Specialized 16cm skinning knife with high-visibility yellow handle. Perfect for hunters and game processors.",
    description: `<p>The <strong>16cm Skinner Knife</strong> is designed specifically for skinning game. The curved blade profile allows clean separation of hide from meat with minimal waste.</p><ul><li>16cm specialized skinning blade</li><li>High-visibility yellow handle</li><li>Ergonomic grip for wet conditions</li><li>Ideal for all game from kudu to springbok</li></ul>`,
    regular_price: 302, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 5, tags: ["knife", "skinning", "hunting", "yellow-handle"],
    primary_image: `${B}/professional-skinner-knife-yellow-handle-16cm-premium-blade.webp`,
    images: [{ url: `${B}/professional-skinner-knife-yellow-handle-16cm-premium-blade.webp`, alt: "Skinner Knife 16cm Yellow Handle", is_primary: true }],
  },
  {
    sku: "Z11022", slug: "sharpening-steel-10cm",
    name: "Professional Knife Sharpening Steel — 10cm Round",
    short_description: "Compact 10cm hardened chrome sharpening steel with ergonomic multi-grip handle.",
    description: `<p>Keep your knives razor sharp with this <strong>10cm round sharpening steel</strong>. Hardened and chromed for long-lasting performance. The hygienic black multi-grip handle resists bacteria.</p><ul><li>10cm hardened and chromed blade</li><li>Ergonomic multi-grip handle</li><li>Hygienic food-safe construction</li></ul>`,
    regular_price: 202, stock_status: "in_stock", stock_quantity: 3,
    is_featured: false, sort_order: 6, tags: ["knife", "sharpener", "10cm"],
    primary_image: `${B}/professional-knife-sharpening-steel-10cm-round-hardened-chrome.webp`,
    images: [{ url: `${B}/professional-knife-sharpening-steel-10cm-round-hardened-chrome.webp`, alt: "Knife Sharpening Steel 10cm", is_primary: true }],
  },
  {
    sku: "Z11020", slug: "sharpening-steel-30cm",
    name: "Professional Knife Sharpening Steel — 30cm Round",
    short_description: "Extended 30cm hardened chrome sharpening steel. For larger butchery knives and cleavers.",
    description: `<p>The <strong>30cm round sharpening steel</strong> provides extra length for maintaining larger butchery knives and cleavers. Hardened and chromed for consistent edge restoration.</p><ul><li>30cm hardened and chromed blade</li><li>Ergonomic multi-grip handle</li><li>Hygienic food-safe construction</li></ul>`,
    regular_price: 354, stock_status: "in_stock", stock_quantity: 2,
    is_featured: false, sort_order: 7, tags: ["knife", "sharpener", "30cm"],
    primary_image: `${B}/professional-knife-sharpening-steel-30cm-round-premium-chrome.webp`,
    images: [{ url: `${B}/professional-knife-sharpening-steel-30cm-round-premium-chrome.webp`, alt: "Knife Sharpening Steel 30cm", is_primary: true }],
  },
  {
    sku: "Z11030", slug: "magnetic-knife-holder-30cm",
    name: "Professional Magnetic Knife Holder — 30cm",
    short_description: "Extra-strong 30cm magnetic knife holder. Keeps knives organised, accessible and safely stored.",
    description: `<p>The <strong>30cm Magnetic Knife Holder</strong> keeps your knives organised on the wall — blades accessible, space saved, safer than a knife block.</p><ul><li>30cm length — holds 4–6 knives</li><li>Extra-strong magnets</li><li>Wall-mount screws included</li><li>Easy to clean</li></ul>`,
    regular_price: 302, stock_status: "in_stock", stock_quantity: 14,
    is_featured: false, sort_order: 8, tags: ["knife", "magnetic-holder", "storage"],
    primary_image: `${B}/professional-magnetic-knife-holder-30cm-extra-strong-magnets.webp`,
    images: [{ url: `${B}/professional-magnetic-knife-holder-30cm-extra-strong-magnets.webp`, alt: "Magnetic Knife Holder 30cm", is_primary: true }],
  },
  {
    sku: "Z11031", slug: "magnetic-knife-board-60cm",
    name: "Professional Magnetic Knife Board — 60cm",
    short_description: "Heavy-duty 60cm magnetic knife board for full knife sets. Ideal for butchery workstations.",
    description: `<p>The <strong>60cm Magnetic Knife Board</strong> is built for serious butchery workstations — holds a full set of knives, cleavers and tools within easy reach.</p><ul><li>60cm length — holds full knife sets</li><li>Heavy-duty magnets</li><li>Wall-mount hardware included</li></ul>`,
    regular_price: 425, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 9, tags: ["knife", "magnetic-board", "storage"],
    primary_image: `${B}/professional-magnetic-knife-board-60cm-heavy-duty-storage.webp`,
    images: [{ url: `${B}/professional-magnetic-knife-board-60cm-heavy-duty-storage.webp`, alt: "Magnetic Knife Board 60cm", is_primary: true }],
  },

  // ── HANGING SYSTEMS ──────────────────────────────────────────────────────────
  {
    sku: "Z44055", slug: "s-hooks-160x6mm-60kg",
    name: "Premium S-Hooks 160×6mm — 60kg Capacity",
    short_description: "Stainless steel S-hooks 160×6mm, 60kg capacity. For hanging smaller game and carcasses.",
    description: `<p>Premium stainless steel S-hooks for hanging lighter game. Corrosion-resistant for indoor and outdoor use.</p><ul><li>Size: 160×6mm</li><li>Capacity: 60kg</li><li>Stainless steel</li></ul>`,
    regular_price: 46, stock_status: "in_stock", stock_quantity: 58,
    is_featured: false, sort_order: 10, tags: ["hanging", "s-hooks", "160x6mm"],
    primary_image: `${B}/premium-stainless-steel-s-hooks-160x6mm-60kg-capacity.webp`,
    images: [{ url: `${B}/premium-stainless-steel-s-hooks-160x6mm-60kg-capacity.webp`, alt: "S-Hooks 160x6mm 60kg", is_primary: true }],
  },
  {
    sku: "Z44055B", slug: "s-hooks-160x8mm-100kg",
    name: "Heavy-Duty S-Hooks 160×8mm — 100kg Capacity",
    short_description: "Heavy-duty stainless steel S-hooks 160×8mm, 100kg capacity. For medium game and carcasses.",
    description: `<p>Heavy-duty stainless steel S-hooks for medium game processing. Corrosion-resistant for use in all environments.</p><ul><li>Size: 160×8mm</li><li>Capacity: 100kg</li><li>Stainless steel</li></ul>`,
    regular_price: 66, stock_status: "in_stock", stock_quantity: 29,
    is_featured: false, sort_order: 11, tags: ["hanging", "s-hooks", "160x8mm"],
    primary_image: `${B}/heavy-duty-stainless-steel-s-hooks-160x8mm-100kg-capacity.webp`,
    images: [{ url: `${B}/heavy-duty-stainless-steel-s-hooks-160x8mm-100kg-capacity.webp`, alt: "S-Hooks 160x8mm 100kg", is_primary: true }],
  },
  {
    sku: "Z44050", slug: "s-hooks-200x9mm-125kg",
    name: "Professional S-Hooks 200×9mm — 125kg Capacity",
    short_description: "Professional stainless steel S-hooks 200×9mm, 125kg capacity. For larger game and heavy carcasses.",
    description: `<p>Professional stainless steel S-hooks for larger game processing. Extra length for easier loading.</p><ul><li>Size: 200×9mm</li><li>Capacity: 125kg</li><li>Stainless steel</li></ul>`,
    regular_price: 86, stock_status: "in_stock", stock_quantity: 25,
    is_featured: false, sort_order: 12, tags: ["hanging", "s-hooks", "200x9mm"],
    primary_image: `${B}/professional-stainless-steel-s-hooks-200x9mm-125kg-capacity.webp`,
    images: [{ url: `${B}/professional-stainless-steel-s-hooks-200x9mm-125kg-capacity.webp`, alt: "S-Hooks 200x9mm 125kg", is_primary: true }],
  },
  {
    sku: "Z44052", slug: "s-hooks-300x12mm-200kg",
    name: "Heavy-Duty S-Hooks 300×12mm — 200kg Capacity",
    short_description: "Heavy-duty stainless steel S-hooks 300×12mm, 200kg capacity. For large game and full carcasses.",
    description: `<p>The largest S-hooks in the range — built for large game, full carcasses and heavy hanging loads.</p><ul><li>Size: 300×12mm</li><li>Capacity: 200kg</li><li>Stainless steel</li></ul>`,
    regular_price: 107, stock_status: "in_stock", stock_quantity: 190,
    is_featured: false, sort_order: 13, tags: ["hanging", "s-hooks", "300x12mm"],
    primary_image: `${B}/heavy-duty-stainless-steel-s-hooks-300x12mm-200kg-capacity.webp`,
    images: [{ url: `${B}/heavy-duty-stainless-steel-s-hooks-300x12mm-200kg-capacity.webp`, alt: "S-Hooks 300x12mm 200kg", is_primary: true }],
  },
  {
    sku: "Z44051", slug: "swivel-hooks-260x10mm-150kg",
    name: "Professional Swivel Hooks — 260×10mm 150kg",
    short_description: "Stainless steel swivel hooks 260×10mm, 150kg. 360° rotation for easy access to all sides of hanging meat.",
    description: `<p>Swivel hooks allow <strong>360° rotation</strong> — access all sides of the carcass without repositioning. Smooth action, corrosion-resistant stainless steel.</p><ul><li>Size: 260×10mm</li><li>Capacity: 150kg</li><li>360° swivel joint</li><li>Stainless steel</li></ul>`,
    regular_price: 201, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 14, tags: ["hanging", "swivel-hooks", "260x10mm"],
    primary_image: `${B}/professional-swivel-hooks-stainless-steel-260x10mm-150kg-capacity.webp`,
    images: [{ url: `${B}/professional-swivel-hooks-stainless-steel-260x10mm-150kg-capacity.webp`, alt: "Swivel Hooks 260x10mm 150kg", is_primary: true }],
  },
  {
    sku: "Z44053", slug: "swivel-hooks-300x12mm-200kg",
    name: "Professional Swivel Hooks — 300×12mm 200kg",
    short_description: "Stainless steel swivel hooks 300×12mm, 200kg. Smooth 360° rotation for larger game.",
    description: `<p>Heavy-duty swivel hooks for larger game. Full 360° rotation for easy access during processing.</p><ul><li>Size: 300×12mm</li><li>Capacity: 200kg</li><li>360° swivel joint</li><li>Stainless steel</li></ul>`,
    regular_price: 353, stock_status: "in_stock", stock_quantity: 5,
    is_featured: false, sort_order: 15, tags: ["hanging", "swivel-hooks", "300x12mm"],
    primary_image: `${B}/professional-swivel-hooks-stainless-steel-300x12mm-200kg-capacity.webp`,
    images: [{ url: `${B}/professional-swivel-hooks-stainless-steel-300x12mm-200kg-capacity.webp`, alt: "Swivel Hooks 300x12mm 200kg", is_primary: true }],
  },
  {
    sku: "Z44054", slug: "xl-swivel-hooks-500x12mm-250kg",
    name: "Professional XL Swivel Hooks — 500×12mm 250kg",
    short_description: "Extra-long XL stainless steel swivel hooks 500×12mm, 250kg. For large carcasses and professional operations.",
    description: `<p>XL swivel hooks for the largest carcasses and professional hanging operations. Extra length for easier access.</p><ul><li>Size: 500×12mm</li><li>Capacity: 250kg</li><li>360° swivel joint</li><li>Stainless steel</li></ul>`,
    regular_price: 353, stock_status: "in_stock", stock_quantity: 17,
    is_featured: false, sort_order: 16, tags: ["hanging", "swivel-hooks", "xl", "500x12mm"],
    primary_image: `${B}/professional-xl-swivel-hooks-stainless-steel-500x12mm-250kg-capacity.webp`,
    images: [{ url: `${B}/professional-xl-swivel-hooks-stainless-steel-500x12mm-250kg-capacity.webp`, alt: "XL Swivel Hooks 500x12mm 250kg", is_primary: true }],
  },
  {
    sku: "Z44060", slug: "gambrel-small-560mm",
    name: "Professional Stainless Steel Gambrel — Small 560mm",
    short_description: "560mm stainless steel gambrel with welded ceiling mount ring. 250kg capacity for small to medium game.",
    description: `<p>The <strong>small 560mm stainless steel gambrel</strong> is the essential tool for hanging and processing small to medium game. Welded ceiling mount ring for secure installation.</p><ul><li>Width: 560mm</li><li>Capacity: 250kg</li><li>Corrosion-resistant stainless steel</li><li>Welded ceiling mount ring included</li></ul>`,
    regular_price: 706, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 17, tags: ["hanging", "gambrel", "560mm"],
    primary_image: `${B}/professional-stainless-steel-gambrel-small-560mm-250kg-capacity.webp`,
    images: [{ url: `${B}/professional-stainless-steel-gambrel-small-560mm-250kg-capacity.webp`, alt: "Stainless Steel Gambrel 560mm", is_primary: true }],
  },
  {
    sku: "Z44061", slug: "gambrel-adjustable-810mm",
    name: "Professional Adjustable Meat Gambrel — Large 810mm",
    short_description: "Adjustable 810mm stainless steel gambrel. Variable width settings, fits S-hooks up to 10mm, 250kg capacity.",
    description: `<p>The <strong>large 810mm adjustable gambrel</strong> handles any size game. Adjustable width lets you set the perfect spacing for each animal. Compatible with all S-hooks up to 10mm.</p><ul><li>Width: up to 810mm (adjustable)</li><li>Capacity: 250kg</li><li>Corrosion-resistant stainless steel</li><li>Fits S-hooks up to 10mm</li></ul>`,
    regular_price: 1498, stock_status: "in_stock", stock_quantity: 2,
    is_featured: true, sort_order: 18, tags: ["hanging", "gambrel", "adjustable", "810mm"],
    primary_image: `${B}/professional-adjustable-meat-gambrel-large-810mm-250kg-capacity.webp`,
    images: [{ url: `${B}/professional-adjustable-meat-gambrel-large-810mm-250kg-capacity.webp`, alt: "Adjustable Meat Gambrel 810mm", is_primary: true }],
  },

  // ── SCALES ───────────────────────────────────────────────────────────────────
  {
    sku: "Z55015", slug: "platform-scale-15kg",
    name: "Professional Digital Platform Scale — 15kg",
    short_description: "Compact 15kg digital platform scale for precise portioning, recipe prep and inventory management.",
    description: `<p>The <strong>15kg digital platform scale</strong> provides precise portioning for vacuum sealing, recipe preparation and stock management.</p><ul><li>Capacity: 15kg</li><li>High-precision digital display</li><li>Tare function</li><li>Multiple units</li><li>Compact tabletop design</li></ul>`,
    regular_price: 4039, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 19, tags: ["scale", "platform", "15kg", "digital"],
    primary_image: `${B}/professional-platform-scale-15kg-capacity-digital-precision.webp`,
    images: [{ url: `${B}/professional-platform-scale-15kg-capacity-digital-precision.webp`, alt: "Digital Platform Scale 15kg", is_primary: true }],
  },
  {
    sku: "Z55060", slug: "platform-scale-60kg",
    name: "Professional Digital Platform Scale — 60kg",
    short_description: "Heavy-duty 60kg digital platform scale with LCD display. For weighing game, carcasses and large cuts.",
    description: `<p>The <strong>60kg digital platform scale</strong> handles full game portions, large primals and bulk stock weighing.</p><ul><li>Capacity: 60kg</li><li>Digital LCD display</li><li>Tare function</li><li>Durable platform construction</li></ul>`,
    regular_price: 3029, stock_status: "in_stock", stock_quantity: 1,
    is_featured: false, sort_order: 20, tags: ["scale", "platform", "60kg", "digital"],
    primary_image: `${B}/professional-platform-scale-60kg-capacity-digital-lcd-display.webp`,
    images: [{ url: `${B}/professional-platform-scale-60kg-capacity-digital-lcd-display.webp`, alt: "Digital Platform Scale 60kg", is_primary: true }],
  },
  {
    sku: "Z55100", slug: "hanging-scale-100kg",
    name: "Professional Hanging Scale — 100kg",
    short_description: "100kg high-precision hanging scale for weighing game and carcasses in the field or abattoir.",
    description: `<p>The <strong>100kg hanging scale</strong> is essential for weighing game on the farm, in the field or at the abattoir.</p><ul><li>Capacity: 100kg</li><li>High-precision measurement</li><li>Easy-to-read display</li><li>Hook included</li></ul>`,
    regular_price: 800, stock_status: "in_stock", stock_quantity: 9,
    is_featured: false, sort_order: 21, tags: ["scale", "hanging", "100kg"],
    primary_image: `${B}/professional-hanging-scale-100kg-capacity-high-precision.webp`,
    images: [{ url: `${B}/professional-hanging-scale-100kg-capacity-high-precision.webp`, alt: "Hanging Scale 100kg", is_primary: true }],
  },
  {
    sku: "Z55200", slug: "hanging-scale-200kg",
    name: "Professional Hanging Scale — 200kg",
    short_description: "200kg heavy-duty hanging scale for large game, livestock and commercial weighing operations.",
    description: `<p>The <strong>200kg hanging scale</strong> handles large game, cattle and commercial weighing operations.</p><ul><li>Capacity: 200kg</li><li>Heavy-duty construction</li><li>Easy-to-read display</li><li>Hook included</li></ul>`,
    regular_price: 1009, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 22, tags: ["scale", "hanging", "200kg"],
    primary_image: `${B}/professional-hanging-scale-200kg-capacity-heavy-duty.webp`,
    images: [{ url: `${B}/professional-hanging-scale-200kg-capacity-heavy-duty.webp`, alt: "Hanging Scale 200kg", is_primary: true }],
  },
  {
    sku: "Z55300", slug: "digital-hanging-scale-300kg",
    name: "Professional Digital Hanging Scale — 300kg",
    short_description: "300kg electronic precision hanging scale for commercial abattoirs and large-scale game processing.",
    description: `<p>The <strong>300kg digital hanging scale</strong> is built for commercial abattoirs and large-scale game processing operations.</p><ul><li>Capacity: 300kg</li><li>Electronic precision display</li><li>Heavy-duty construction</li><li>Backorder — contact us for availability</li></ul>`,
    regular_price: 4900, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 23, tags: ["scale", "hanging", "300kg", "digital"],
    primary_image: `${B}/professional-digital-hanging-scale-300kg-capacity-electronic-precision.webp`,
    images: [{ url: `${B}/professional-digital-hanging-scale-300kg-capacity-electronic-precision.webp`, alt: "Digital Hanging Scale 300kg", is_primary: true }],
  },

  // ── PROTECTIVE CLOTHING ──────────────────────────────────────────────────────
  {
    sku: "Z33010", slug: "butchers-apron-pvc-120x80cm",
    name: "Professional Butcher's Apron — Premium PVC 120×80cm",
    short_description: "Waterproof 120×80cm PVC butcher's apron. Full coverage protection for meat processing and cleaning.",
    description: `<p>The <strong>PVC butcher's apron</strong> keeps blood, liquids and meat juices off your clothing. Non-porous surface resists bacterial buildup and wipes clean in seconds.</p><ul><li>Size: 120×80cm</li><li>100% industrial-grade PVC</li><li>Fully waterproof</li><li>Easy to clean — hand wash with warm soapy water</li></ul>`,
    regular_price: 403, stock_status: "in_stock", stock_quantity: 6,
    is_featured: false, sort_order: 24, tags: ["protective", "apron", "pvc"],
    primary_image: `${B}/professional-butchers-apron-premium-pvc-120cm-x-80cm.webp`,
    images: [{ url: `${B}/professional-butchers-apron-premium-pvc-120cm-x-80cm.webp`, alt: "Professional Butcher's Apron PVC 120x80cm", is_primary: true }],
  },
  {
    sku: "Z33020S", slug: "cut-resistant-gloves-small",
    name: "Professional Cut-Resistant Gloves — Small (Level 5)",
    short_description: "Level 5 cut-resistant gloves in Small. Essential hand protection for butchery and game processing.",
    description: `<p><strong>Level 5 cut-resistant gloves</strong> provide maximum hand protection during deboning, skinning and all knife work. Mandatory in any professional butchery operation.</p><ul><li>Size: Small</li><li>Level 5 cut protection (EN388)</li><li>Fits left or right hand</li><li>Machine washable</li></ul>`,
    regular_price: 302, stock_status: "in_stock", stock_quantity: 3,
    is_featured: false, sort_order: 25, tags: ["protective", "gloves", "cut-resistant", "small"],
    primary_image: `${B}/professional-cut-resistant-gloves-small-level-5-protection.webp`,
    images: [{ url: `${B}/professional-cut-resistant-gloves-small-level-5-protection.webp`, alt: "Cut-Resistant Gloves Small Level 5", is_primary: true }],
  },
  {
    sku: "Z33020M", slug: "cut-resistant-gloves-medium",
    name: "Professional Cut-Resistant Gloves — Medium (Level 5)",
    short_description: "Level 5 cut-resistant gloves in Medium. Essential hand protection for butchery and game processing.",
    description: `<p><strong>Level 5 cut-resistant gloves</strong> — essential hand protection for deboning, skinning and all knife work.</p><ul><li>Size: Medium</li><li>Level 5 cut protection (EN388)</li><li>Fits left or right hand</li><li>Machine washable</li></ul>`,
    regular_price: 302, stock_status: "in_stock", stock_quantity: 3,
    is_featured: false, sort_order: 26, tags: ["protective", "gloves", "cut-resistant", "medium"],
    primary_image: `${B}/professional-cut-resistant-gloves-medium-level-5-protection.webp`,
    images: [{ url: `${B}/professional-cut-resistant-gloves-medium-level-5-protection.webp`, alt: "Cut-Resistant Gloves Medium Level 5", is_primary: true }],
  },
  {
    sku: "Z33020L", slug: "cut-resistant-gloves-large",
    name: "Professional Cut-Resistant Gloves — Large (Level 5)",
    short_description: "Level 5 cut-resistant gloves in Large. Essential hand protection for butchery and game processing.",
    description: `<p><strong>Level 5 cut-resistant gloves</strong> — essential hand protection for deboning, skinning and all knife work.</p><ul><li>Size: Large</li><li>Level 5 cut protection (EN388)</li><li>Fits left or right hand</li><li>Machine washable</li></ul>`,
    regular_price: 302, stock_status: "in_stock", stock_quantity: 3,
    is_featured: false, sort_order: 27, tags: ["protective", "gloves", "cut-resistant", "large"],
    primary_image: `${B}/professional-cut-resistant-gloves-large-level-5-protection.webp`,
    images: [{ url: `${B}/professional-cut-resistant-gloves-large-level-5-protection.webp`, alt: "Cut-Resistant Gloves Large Level 5", is_primary: true }],
  },

  // ── TOOLS ────────────────────────────────────────────────────────────────────
  {
    sku: "Z11111", slug: "bone-crusher-rib-cutter",
    name: "Professional Bone Crusher & Rib Cutter",
    short_description: "Heavy-duty bone crusher and rib cutter with angled head and nylon anvil. Breaks bone seams cleanly without splintering.",
    description: `<p>The <strong>Bone Crusher & Rib Cutter</strong> makes breaking ribs and lock seams fast, safe and clean. The angled head provides leverage while the nylon anvil prevents bone splintering — keeping meat quality intact.</p><ul><li>Ergonomically angled head for leverage</li><li>Nylon anvil — no bone splintering</li><li>Corrosion-resistant construction</li><li>Ideal for ribs, lamb, pork and game</li></ul>`,
    regular_price: 403, stock_status: "on_order", stock_quantity: 0,
    is_featured: false, sort_order: 28, tags: ["tools", "bone-crusher", "rib-cutter"],
    primary_image: `${B}/professional-bone-crusher-rib-cutter-heavy-duty-butchery-tool.webp`,
    images: [{ url: `${B}/professional-bone-crusher-rib-cutter-heavy-duty-butchery-tool.webp`, alt: "Bone Crusher and Rib Cutter", is_primary: true }],
  },

  // ── CUTTING BOARDS ───────────────────────────────────────────────────────────
  {
    sku: "Z22010", slug: "cutting-board-scraper-stainless",
    name: "Professional Cutting Board Scraper — Stainless Steel",
    short_description: "Stainless steel cutting board scraper for keeping work surfaces clean during processing.",
    description: `<p>The <strong>stainless steel board scraper</strong> keeps your cutting surface clean during processing — push trimmings, blood and debris aside quickly without lifting your knife.</p><ul><li>Stainless steel blade</li><li>Ergonomic handle</li><li>Dishwasher safe</li></ul>`,
    regular_price: 364, stock_status: "in_stock", stock_quantity: 3,
    is_featured: false, sort_order: 29, tags: ["cutting-board", "scraper", "stainless"],
    primary_image: `${B}/professional-cutting-board-scraper-stainless-steel.webp`,
    images: [{ url: `${B}/professional-cutting-board-scraper-stainless-steel.webp`, alt: "Cutting Board Scraper Stainless Steel", is_primary: true }],
  },
];

async function seed() {
  console.log("🌱 Seeding butchery accessories...\n");

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
  console.log("\n✅ Butchery accessories seed complete!");
}

seed().catch((err) => { console.error("Fatal:", err); process.exit(1); });
