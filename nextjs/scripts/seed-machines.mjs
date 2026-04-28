/**
 * Lava-SA — Vacuum Machine Seeder
 * Run: node scripts/seed-machines.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xkzijumigtwjkobdzhno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og"
);

// ─── 1. Category ────────────────────────────────────────────────────────────
const category = {
  name:        "Vacuum Machines",
  slug:        "vacuum-machines",
  description: "German-engineered vacuum sealers for home, catering and commercial use.",
  sort_order:  1,
};

// ─── 2. Industry tags (map to icon filenames) ────────────────────────────────
const INDUSTRIES = {
  kitchen:      { label: "Home Kitchen",        icon: "kitchen-outline-icon.png" },
  hunting:      { label: "Hunters & Game",       icon: "hunting-and-fishing-Icon.png" },
  fishing:      { label: "Anglers & Fishing",    icon: "hunting-and-fishing-Icon.png" },
  catering:     { label: "Catering & Restaurants", icon: "catering-icon.png" },
  butchery:     { label: "Butchery",             icon: "food-production-icon.png" },
  biltong:      { label: "Biltong & Charcuterie", icon: "food-production-icon.png" },
  food_prod:    { label: "Food Production",      icon: "food-production-icon.png" },
  outdoor:      { label: "Outdoor & Camping",    icon: "outdoor-adventure-icon.png" },
  marine:       { label: "Marine & Boating",     icon: "marine-applications-icon.png" },
  healthcare:   { label: "Healthcare & Pharma",  icon: "healthcare-icon.png" },
  industrial:   { label: "Industrial",           icon: "microchip-icon.png" },
};

// ─── 3. Product data ─────────────────────────────────────────────────────────
const machines = [
  {
    sku:           "VL0100PX",
    name:          "LAVA V.100 Premium X",
    slug:          "v100-premium-x",
    short_description: "Compact entry-level vacuum sealer for home use. Manual operation, double seal, German-engineered. Ideal for the home user who doesn't need to vacuum pack large quantities.",
    description:   `<p>The <strong>LAVA V.100 Premium X</strong> is the newest model in the compact range — perfect for home users who want professional food preservation without bulk requirements. <strong>German-engineered</strong> with a <strong>2-year warranty</strong>.</p>
<p>Key features:</p>
<ul>
<li><strong>Manual operation</strong> — simple, intuitive controls ideal for beginners</li>
<li><strong>Magnetic lid system</strong> — requires minimal pressure during operation</li>
<li><strong>Double seal strip</strong> — each strip 5mm wide for a reliable, airtight closure</li>
<li><strong>Works with bags and rolls</strong> — compatible with materials up to 34cm wide</li>
<li><strong>Fast performance</strong> — removes air from a medium bag in approximately 10 seconds</li>
<li><strong>Container compatible</strong> — includes vacuum pump attachment for acrylic containers</li>
</ul>`,
    regular_price: 11000,
    stock_status:  "in_stock",
    stock_quantity: 5,
    weight_kg:     4.40,
    length_cm:     41.0,
    width_cm:      23.0,
    height_cm:     9.8,
    is_featured:   true,
    sort_order:    1,
    industries:    ["kitchen", "hunting", "fishing", "biltong", "outdoor"],
    tags:          ["entry-level", "home", "compact", "manual", "V100"],
    specs: {
      pumps:          "1",
      suction_power:  "35 ltr/min",
      max_vacuum:     "-0.94 bar",
      gauge:          "LED indicator",
      seal_width:     "340 mm",
      double_seal:    "Yes",
      manual_seal:    "Yes",
      auto_seal:      "No",
      fluid_extract:  "Yes",
      colour:         "Grey & Black",
      voltage:        "220–240 V",
      power:          "500 W",
      dimensions:     "410 × 230 × 98 mm",
      weight:         "4.40 kg",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x.webp",
    images: [
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x.webp", alt: "LAVA V.100 Premium X vacuum sealer", is_primary: true },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-01.webp", alt: "LAVA V.100 Premium X — front view" },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-02.webp", alt: "LAVA V.100 Premium X — side view" },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-03.webp", alt: "LAVA V.100 Premium X — in use" },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-04.webp", alt: "LAVA V.100 Premium X — detail" },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-05.webp", alt: "LAVA V.100 Premium X — open lid" },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-06.webp", alt: "LAVA V.100 Premium X — sealing" },
      { url: "/images/products/machines/v100-premium-x/lava-vacuum-sealer-v100-premium-x-07.webp", alt: "LAVA V.100 Premium X — with bag" },
    ],
  },
  {
    sku:           "VL0300PX-1",
    name:          "LAVA V.300 Premium X",
    slug:          "v300-premium-x",
    short_description: "Most popular vacuum sealer — fully automatic and manual modes, dial pressure gauge, double seal. The go-to machine for hunters, anglers and serious home users.",
    description:   `<p>The <strong>LAVA V.300 Premium X</strong> is the most popular machine in the Lava range — a professional-grade vacuum sealer that combines ease of use with exceptional performance. <strong>German-engineered</strong>, <strong>2-year warranty</strong>.</p>
<ul>
<li><strong>Fully automatic & manual modes</strong> — ultimate versatility for any task</li>
<li><strong>Dial pressure gauge</strong> — precise vacuum pressure reading every time</li>
<li><strong>Variable pressure valve</strong> — lower the pressure for soft or delicate foods</li>
<li><strong>Double seal strip</strong> — each strip 5mm wide, ensures airtight closure</li>
<li><strong>Magnetic lid system</strong> — no pressure required on the lid</li>
<li><strong>Container compatible</strong> — includes vacuum pump attachment</li>
</ul>`,
    regular_price: 13500,
    stock_status:  "in_stock",
    stock_quantity: 6,
    weight_kg:     4.40,
    length_cm:     41.0,
    width_cm:      23.0,
    height_cm:     9.8,
    is_featured:   true,
    sort_order:    2,
    industries:    ["kitchen", "hunting", "fishing", "biltong", "catering", "butchery", "outdoor"],
    tags:          ["most-popular", "automatic", "home", "hunting", "V300"],
    specs: {
      pumps:          "1",
      suction_power:  "35 ltr/min",
      max_vacuum:     "-0.80 bar",
      gauge:          "Dial gauge",
      seal_width:     "300 mm",
      double_seal:    "Yes",
      manual_seal:    "Yes",
      auto_seal:      "Yes",
      fluid_extract:  "Yes",
      colour:         "Grey & Black",
      voltage:        "230 V",
      power:          "500 W",
      dimensions:     "410 × 230 × 98 mm",
      weight:         "4.40 kg",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x.webp",
    images: [
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x.webp", alt: "LAVA V.300 Premium X vacuum sealer", is_primary: true },
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x-01.webp", alt: "LAVA V.300 Premium X — front" },
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x-02.webp", alt: "LAVA V.300 Premium X — side" },
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x-03.webp", alt: "LAVA V.300 Premium X — in use" },
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x-04.webp", alt: "LAVA V.300 Premium X — detail" },
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x-05.webp", alt: "LAVA V.300 Premium X — open" },
      { url: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x-06.webp", alt: "LAVA V.300 Premium X — sealing" },
    ],
  },
  {
    sku:           "VL0300PBLACK",
    name:          "LAVA V.300 Premium Black — Limited Edition",
    slug:          "v300-black",
    short_description: "Limited Edition black finish. Same professional performance as the V.300 Premium X with a bold black aesthetic. Fully automatic, dial gauge, double seal.",
    description:   `<p>The <strong>LAVA V.300 Premium Black</strong> is a Limited Edition variant of the most popular machine in the Lava range. Same professional-grade performance, bold black finish. <strong>German-engineered</strong>, <strong>2-year warranty</strong>.</p>
<ul>
<li><strong>Limited Edition black finish</strong> — premium aesthetic for discerning users</li>
<li><strong>Fully automatic & manual modes</strong></li>
<li><strong>Dial pressure gauge</strong> with variable pressure valve</li>
<li><strong>Double seal strip</strong> — each 5mm wide</li>
<li><strong>Magnetic lid system</strong></li>
<li><strong>Container compatible</strong> — vacuum pump attachment included</li>
</ul>`,
    regular_price: 14200,
    stock_status:  "in_stock",
    stock_quantity: 10,
    weight_kg:     3.95,
    length_cm:     41.0,
    width_cm:      21.0,
    height_cm:     9.8,
    is_featured:   false,
    sort_order:    3,
    industries:    ["kitchen", "hunting", "fishing", "biltong", "catering"],
    tags:          ["limited-edition", "black", "automatic", "V300"],
    specs: {
      pumps:          "1",
      suction_power:  "35 ltr/min",
      max_vacuum:     "-0.80 bar",
      gauge:          "Dial gauge",
      seal_width:     "300 mm",
      double_seal:    "Yes",
      manual_seal:    "Yes",
      auto_seal:      "Yes",
      fluid_extract:  "Yes",
      colour:         "Black",
      voltage:        "230 V",
      power:          "800 W",
      dimensions:     "410 × 210 × 98 mm",
      weight:         "3.95 kg",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black.webp",
    images: [
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black.webp", alt: "LAVA V.300 Black Limited Edition", is_primary: true },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-01.webp", alt: "LAVA V.300 Black — front" },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-02.webp", alt: "LAVA V.300 Black — side" },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-03.webp", alt: "LAVA V.300 Black — in use" },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-04.webp", alt: "LAVA V.300 Black — detail" },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-05.webp", alt: "LAVA V.300 Black — open lid" },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-06.webp", alt: "LAVA V.300 Black — seal strip" },
      { url: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black-07.webp", alt: "LAVA V.300 Black — with food" },
    ],
  },
  {
    sku:           null,
    name:          "LAVA V.300 Premium White — Limited Edition",
    slug:          "v300-white",
    short_description: "Limited Edition white finish with patented 2-step filter system and stronger pump (-0.96 bar). The most powerful V.300 ever made.",
    description:   `<p>The <strong>LAVA V.300 Premium White</strong> is a Limited Edition machine featuring a stronger pump and Lava's patented 2-step filter system. <strong>German-engineered</strong>, <strong>2-year warranty</strong>.</p>
<ul>
<li><strong>Patented 2-step filter system</strong> — protects pump 100% from powder and metal particles</li>
<li><strong>Stronger pump</strong> — maximum vacuum of -0.96 bar</li>
<li><strong>Stainless steel cylinder cover</strong> — long-lasting vacuum power</li>
<li><strong>Fully automatic & manual modes</strong></li>
<li><strong>Individually adjustable sealing time</strong> — seals film up to 200μ thick</li>
<li><strong>Container compatible</strong></li>
</ul>`,
    regular_price: 14200,
    stock_status:  "in_stock",
    stock_quantity: 3,
    weight_kg:     null,
    length_cm:     null,
    width_cm:      null,
    height_cm:     null,
    is_featured:   false,
    sort_order:    4,
    industries:    ["kitchen", "catering", "biltong", "food_prod"],
    tags:          ["limited-edition", "white", "high-vacuum", "V300"],
    specs: {
      pumps:          "1",
      max_vacuum:     "-0.96 bar",
      gauge:          "Dial gauge",
      seal_width:     "340 mm",
      filter_system:  "Patented 2-step",
      auto_seal:      "Yes",
      manual_seal:    "Yes",
      colour:         "White",
      power:          "600 W",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white.webp",
    images: [
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white.webp", alt: "LAVA V.300 White Limited Edition", is_primary: true },
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white-01.webp", alt: "LAVA V.300 White — front" },
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white-02.webp", alt: "LAVA V.300 White — side" },
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white-03.webp", alt: "LAVA V.300 White — in use" },
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white-04.webp", alt: "LAVA V.300 White — detail" },
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white-05.webp", alt: "LAVA V.300 White — open" },
      { url: "/images/products/machines/v300-white/lava-vacuum-sealer-v300-white-06.webp", alt: "LAVA V.300 White — sealing" },
    ],
  },
  {
    sku:           "VL0333C-1",
    name:          "LAVA V.333 Chrome",
    slug:          "v333-chrome",
    short_description: "Entry-level industrial machine — triple seal, dial gauge, variable pressure valve. Ideal for small delis, restaurants and butcheries. Special order.",
    description:   `<p>The <strong>LAVA V.333 Chrome</strong> is the entry-level machine in the industrial range — an efficient, hardworking vacuum sealer ideal for the small delicatessen, restaurant or butchery. <strong>German-engineered</strong>, <strong>2-year warranty</strong>. <em>Special order only.</em></p>
<ul>
<li><strong>High-resin body</strong> — built to withstand commercial use</li>
<li><strong>Triple seal strip</strong> — three layers for maximum closure integrity</li>
<li><strong>Dial pressure gauge</strong> — precise vacuum reading</li>
<li><strong>Variable pressure control valve</strong> — handles delicate foods with ease</li>
<li><strong>Fully automatic & manual modes</strong></li>
<li><strong>Container compatible</strong></li>
</ul>`,
    regular_price: 20010,
    stock_status:  "on_order",
    stock_quantity: 0,
    weight_kg:     5.85,
    length_cm:     43.0,
    width_cm:      27.5,
    height_cm:     11.0,
    is_featured:   false,
    sort_order:    5,
    industries:    ["catering", "butchery", "food_prod", "biltong"],
    tags:          ["industrial", "commercial", "triple-seal", "V333", "special-order"],
    specs: {
      pumps:          "1",
      suction_power:  "35 ltr/min",
      max_vacuum:     "-0.90 bar",
      gauge:          "Dial gauge",
      seal_width:     "300 mm",
      triple_seal:    "Yes",
      manual_seal:    "Yes",
      auto_seal:      "Yes",
      fluid_extract:  "Yes",
      colour:         "Chrome / Black",
      voltage:        "230 V",
      power:          "800 W",
      dimensions:     "430 × 275 × 110 mm",
      weight:         "5.85 kg",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v333-chrome/lava-v333-permium-black-advanced-vacuum-sealer.webp",
    images: [
      { url: "/images/products/machines/v333-chrome/lava-v333-permium-black-advanced-vacuum-sealer.webp", alt: "LAVA V.333 Chrome vacuum sealer", is_primary: true },
    ],
  },
  {
    sku:           "VL0400P-1",
    name:          "LAVA V.400 Premium",
    slug:          "v400-premium",
    short_description: "Commercial-grade vacuum sealer with 450mm triple seal and stainless steel housing. Designed for restaurants, butcheries and commercial kitchens. Special order.",
    description:   `<p>The <strong>LAVA V.400 Premium</strong> is designed for the larger restaurant, commercial kitchen or butchery. Built with a <strong>stainless steel housing</strong>, this machine is engineered to stand up to hard daily use. <strong>German-engineered</strong>, <strong>2-year warranty</strong>. <em>Special order only.</em></p>
<ul>
<li><strong>Stainless steel housing</strong> — designed for demanding commercial environments</li>
<li><strong>Triple seal strip (450mm)</strong> — superior closure for wide bags</li>
<li><strong>Dial pressure gauge & variable pressure valve</strong></li>
<li><strong>Fully automatic & manual modes</strong></li>
<li><strong>-0.92 bar maximum vacuum</strong> — handles the toughest preservation tasks</li>
<li><strong>Container compatible</strong></li>
</ul>`,
    regular_price: 29890,
    stock_status:  "on_order",
    stock_quantity: 0,
    weight_kg:     14.5,
    length_cm:     50.0,
    width_cm:      34.0,
    height_cm:     13.5,
    is_featured:   false,
    sort_order:    6,
    industries:    ["catering", "butchery", "food_prod", "healthcare", "industrial"],
    tags:          ["commercial", "stainless-steel", "triple-seal", "V400", "special-order"],
    specs: {
      pumps:          "1",
      suction_power:  "35 ltr/min",
      max_vacuum:     "-0.92 bar",
      gauge:          "Dial gauge",
      seal_width:     "450 mm",
      triple_seal:    "Yes",
      manual_seal:    "Yes",
      auto_seal:      "Yes",
      fluid_extract:  "Yes",
      colour:         "Stainless Steel / Grey",
      voltage:        "230 V",
      power:          "800 W",
      dimensions:     "500 × 340 × 135 mm",
      weight:         "14.5 kg",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium.webp",
    images: [
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium.webp", alt: "LAVA V.400 Premium commercial vacuum sealer", is_primary: true },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-01.webp", alt: "LAVA V.400 Premium — front" },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-02.webp", alt: "LAVA V.400 Premium — side" },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-03.webp", alt: "LAVA V.400 Premium — in use" },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-04.webp", alt: "LAVA V.400 Premium — detail" },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-05.webp", alt: "LAVA V.400 Premium — stainless housing" },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-06.webp", alt: "LAVA V.400 Premium — seal strip" },
      { url: "/images/products/machines/v400-premium/lava-vacuum-sealer-v400-premium-07.webp", alt: "LAVA V.400 Premium — commercial use" },
    ],
  },
  {
    sku:           "VL0500P",
    name:          "LAVA V.500 Premium (72cm)",
    slug:          "v500-premium",
    short_description: "Industrial vacuum sealer with 750mm triple seal and 3-pump system. Engineered for large restaurants, commercial kitchens and butcheries. Special order.",
    description:   `<p>The <strong>LAVA V.500 Premium (72cm)</strong> is designed for large-scale commercial operations. With a <strong>3-pump system</strong> and <strong>750mm sealing width</strong>, it handles high-volume vacuum sealing with ease. <strong>German-engineered</strong>, <strong>2-year warranty</strong>. <em>Special order only.</em></p>
<ul>
<li><strong>3-pump system</strong> — 110 ltr/min suction power for rapid, high-volume sealing</li>
<li><strong>750mm sealing width</strong> — handles large portion bags with ease</li>
<li><strong>-0.92 bar maximum vacuum</strong></li>
<li><strong>Steel case</strong> — built for demanding daily commercial use</li>
<li><strong>Dial pressure gauge & variable pressure valve</strong></li>
<li><strong>Fully automatic & manual modes</strong></li>
</ul>`,
    regular_price: 41210,
    stock_status:  "on_order",
    stock_quantity: 0,
    weight_kg:     null,
    length_cm:     null,
    width_cm:      null,
    height_cm:     null,
    is_featured:   false,
    sort_order:    7,
    industries:    ["catering", "butchery", "food_prod", "industrial"],
    tags:          ["industrial", "commercial", "triple-seal", "V500", "special-order", "high-volume"],
    specs: {
      pumps:          "3",
      suction_power:  "110 ltr/min",
      max_vacuum:     "-0.92 bar",
      gauge:          "Dial gauge",
      seal_width:     "750 mm",
      manual_seal:    "Yes",
      auto_seal:      "Yes",
      colour:         "Stainless Steel",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium.webp",
    images: [
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium.webp", alt: "LAVA V.500 Premium 72cm industrial sealer", is_primary: true },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-01.webp", alt: "LAVA V.500 Premium — front" },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-02.webp", alt: "LAVA V.500 Premium — side" },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-03.webp", alt: "LAVA V.500 Premium — in use" },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-04.webp", alt: "LAVA V.500 Premium — steel case" },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-05.webp", alt: "LAVA V.500 Premium — sealing bar" },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-06.webp", alt: "LAVA V.500 Premium — commercial" },
      { url: "/images/products/machines/v500-premium/lava-vacuum-sealer-v500-premium-07.webp", alt: "LAVA V.500 Premium — detail" },
    ],
  },
  {
    sku:           "VL1200P",
    name:          "LAVA V.500 Premium XXL (121cm)",
    slug:          "v500-premium-xxl",
    short_description: "Extra-large industrial vacuum sealer with 1200mm sealing width. Ideal for vacuum packing carcases, large meat portions, or industrial products. Special order.",
    description:   `<p>The <strong>LAVA V.500 Premium XXL (121cm)</strong> is engineered for the most demanding industrial and commercial applications — from whole carcases and large meat portions to duvets and industrial components. <strong>German-engineered</strong>, <strong>2-year warranty</strong>. <em>Special order only.</em></p>
<ul>
<li><strong>1200mm sealing width</strong> — handles carcases, large portions, bulky items</li>
<li><strong>3-pump system</strong> — 110 ltr/min for rapid high-volume sealing</li>
<li><strong>-0.92 bar maximum vacuum</strong></li>
<li><strong>Steel case</strong> — built for the most demanding commercial use</li>
<li><strong>Dial pressure gauge & variable pressure valve</strong></li>
<li><strong>Fully automatic & manual modes</strong></li>
</ul>`,
    regular_price: 68280,
    stock_status:  "on_order",
    stock_quantity: 0,
    weight_kg:     null,
    length_cm:     null,
    width_cm:      null,
    height_cm:     null,
    is_featured:   false,
    sort_order:    8,
    industries:    ["butchery", "food_prod", "industrial"],
    tags:          ["industrial", "extra-large", "V500-XXL", "special-order", "carcases"],
    specs: {
      pumps:          "3",
      suction_power:  "110 ltr/min",
      max_vacuum:     "-0.92 bar",
      gauge:          "Dial gauge",
      seal_width:     "1200 mm",
      manual_seal:    "Yes",
      auto_seal:      "Yes",
      colour:         "Stainless Steel",
      warranty:       "2 years",
      made_in:        "Germany",
    },
    primary_image_url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl.webp",
    images: [
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl.webp", alt: "LAVA V.500 XXL 121cm industrial sealer", is_primary: true },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-01.webp", alt: "LAVA V.500 XXL — front" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-02.webp", alt: "LAVA V.500 XXL — side" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-03.webp", alt: "LAVA V.500 XXL — sealing bar" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-04.webp", alt: "LAVA V.500 XXL — in use" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-05.webp", alt: "LAVA V.500 XXL — steel case" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-06.webp", alt: "LAVA V.500 XXL — commercial" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-07.webp", alt: "LAVA V.500 XXL — detail" },
      { url: "/images/products/machines/v500-premium-xxl/lava-vacuum-sealer-v500-premium-xxl-08.webp", alt: "LAVA V.500 XXL — extra-large" },
    ],
  },
];

// ─── 4. Run seed ──────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding Lava-SA vacuum machines...\n");

  // Insert category
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .upsert(category, { onConflict: "slug" })
    .select()
    .single();
  if (catErr) { console.error("Category error:", catErr.message); process.exit(1); }
  console.log(`✓ Category: ${cat.name} (${cat.id})`);

  // Insert each machine
  for (const machine of machines) {
    const { images, ...productData } = machine;

    // Insert product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .upsert(
        { ...productData, category_id: cat.id },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (prodErr) {
      console.error(`✗ ${machine.name}: ${prodErr.message}`);
      continue;
    }

    // Delete existing images (for re-seeding)
    await supabase.from("product_images").delete().eq("product_id", product.id);

    // Insert images
    if (images?.length) {
      const imageRows = images.map((img, i) => ({
        product_id: product.id,
        url:        img.url,
        alt:        img.alt || product.name,
        is_primary: img.is_primary || false,
        sort_order: i,
      }));
      const { error: imgErr } = await supabase.from("product_images").insert(imageRows);
      if (imgErr) console.warn(`  ⚠ Images warning for ${machine.name}: ${imgErr.message}`);
    }

    console.log(`✓ ${product.name} — R${product.regular_price.toLocaleString()} — ${images?.length} images`);
  }

  console.log("\n✅ Seed complete!");
}

seed().catch((err) => { console.error("Fatal:", err); process.exit(1); });
