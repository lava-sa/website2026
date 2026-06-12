/**
 * Fill blank AI Discoverability fields on all products (specs.ai_summary, ai_search_terms, ai_use_cases).
 *
 * Usage (from nextjs/):
 *   node scripts/fill-product-ai-fields.mjs
 *   node scripts/fill-product-ai-fields.mjs --dry-run
 *   node scripts/fill-product-ai-fields.mjs --force   # overwrite existing values
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const p = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(p)) {
    console.error("Missing .env.local — add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

// Mirror of src/lib/product-ai-discoverability.ts (kept in sync for Node script)
function stripHtml(html) {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function modelCode(name) {
  const m = name.match(/V\.?\s*(\d+)/i);
  return m ? `V.${m[1]}` : null;
}

function sealWidthCm(specs) {
  const raw = String(specs?.seal_width ?? "").trim();
  const mm = raw.match(/(\d+)\s*mm/i);
  if (mm) return `${Math.round(Number(mm[1]) / 10)} cm`;
  const cm = raw.match(/(\d+(?:\.\d+)?)\s*cm/i);
  if (cm) return `${cm[1]} cm`;
  return null;
}

function bagSizeHint(name) {
  const dims = name.match(/(\d+)\s*[×x]\s*(\d+)\s*cm/i);
  if (dims) return `${dims[1]}×${dims[2]} cm`;
  const roll = name.match(/(\d+)\s*cm\s*(?:wide|width|roll)/i);
  if (roll) return `${roll[1]} cm roll`;
  return null;
}

function summaryFromShort(name, short, categorySlug) {
  const plain = stripHtml(short);
  if (plain.length >= 40) {
    const sentence = plain.match(/^[^.!?]+[.!?]/)?.[0]?.trim() ?? plain;
    return sentence.length > 220 ? `${sentence.slice(0, 217).trim()}…` : sentence;
  }
  switch (categorySlug) {
    case "vacuum-machines":
      return modelCode(name)
        ? `The ${name} is a German-engineered LAVA vacuum sealer for serious food preservation in South Africa — ideal when you need reliable seals for game, fish, meal prep and sous vide.`
        : `${name} is a LAVA vacuum sealer distributed in South Africa with German build quality, local warranty support and nationwide delivery.`;
    case "vacuum-bags":
      return `${name} is an embossed-channel vacuum bag compatible with LAVA and other channel-type sealers — built for freezer storage, bulk portioning and sous vide in South African kitchens.`;
    case "vacuum-rolls":
      return `${name} lets you cut custom-length embossed vacuum bags — practical for hunters, anglers and households that seal many portions in one session.`;
    case "sous-vide":
      return `${name} brings precision low-temperature cooking to home or small commercial kitchens — pair with LAVA vacuum bags for consistent results.`;
    default:
      return `${name} from Lava-SA — German LAVA quality with nationwide courier delivery and local support since 2007.`;
  }
}

function machineUseCases(name, specs) {
  const width = sealWidthCm(specs);
  const widthNote = width ? ` Fits bags and rolls up to ${width} wide.` : "";
  const n = modelCode(name) ? Number(modelCode(name).replace("V.", "")) : 300;
  if (n <= 100) {
    return [
      `Home kitchen & beginners — Compact ${name} for weekly meal prep, leftovers and small-batch sealing.${widthNote}`,
      `Hunting & fishing weekends — Portion game and fish after a trip without needing a commercial machine.${widthNote}`,
      `Biltong & dry goods — Seal finished biltong portions and pantry items to extend shelf life.${widthNote}`,
    ];
  }
  if (n <= 300) {
    return [
      `Serious home cooks & hunters — The ${name} handles game, bulk meat specials and weekly meal prep.${widthNote}`,
      `Load-shedding food security — Vacuum-seal bulk buys so fridges and freezers survive power outages better.${widthNote}`,
      `Sous vide & marinating — Seal portions for water-bath cooking and fast vacuum marinating.${widthNote}`,
    ];
  }
  if (n <= 333) {
    return [
      `Game processing — Seal large cuts and high volumes after a hunt with consistent German vacuum performance.${widthNote}`,
      `Butchery & deli workflows — Extend display life, reduce shrinkage and improve hygiene on primals and portions.${widthNote}`,
      `Catering & meal prep — Reliable all-day sealing for batch cooks and small food businesses.${widthNote}`,
    ];
  }
  return [
    `Commercial kitchens & butcheries — ${name} is built for continuous sealing through busy production days.${widthNote}`,
    `Food production & catering — Portion, seal and store at scale with a wide sealing bar.${widthNote}`,
    `Retail & deli operations — Professional presentation and longer shelf life on vacuum-packed cuts.${widthNote}`,
  ];
}

function categoryUseCases(name, categorySlug) {
  const size = bagSizeHint(name);
  const map = {
    "vacuum-bags": [
      `Freezer & long storage — ${size ? `${size} ` : ""}Embossed bags draw air reliably for months in the freezer.`,
      `Sous vide cooking — Strong welds hold up in heated water baths for fish, meat and vegetables.`,
      `Bulk portioning — Seal meal-prep, game and bulk-buy meat in single-use portions.`,
    ],
    "vacuum-rolls": [
      `Custom bag lengths — Cut only what you need for odd-sized cuts and reduce plastic waste.`,
      `Game & bulk processing — Ideal when sealing dozens of portions after a hunt or butcher session.`,
      `Embossed channel texture — Works with all LAVA channel-type vacuum sealers sold in South Africa.`,
    ],
    "sous-vide": [
      `Precision home cooking — Hold exact temperatures for steak, fish, game and vegetables.`,
      `Pairs with LAVA bags — Seal portions first, then cook evenly in a water bath.`,
      `Consistent results — Repeat the same doneness every time for entertaining or meal prep.`,
    ],
  };
  return (
    map[categorySlug] ?? [
      `South African homes — ${name} from the authorised LAVA distributor with nationwide delivery.`,
      `Food preservation — Pair with LAVA vacuum sealing for longer shelf life and less waste.`,
      `Local support — Johannesburg-based team, warranty help and spare parts availability.`,
    ]
  );
}

function searchTerms(name, categorySlug, specs) {
  const model = modelCode(name);
  const width = sealWidthCm(specs);
  const size = bagSizeHint(name);
  const terms = [name, "LAVA South Africa", "Lava-SA"];
  if (categorySlug === "vacuum-machines") {
    terms.push(
      "vacuum sealer South Africa",
      "German vacuum sealer",
      model ? `LAVA ${model}` : "LAVA vacuum machine",
      "game meat vacuum sealer",
      "biltong vacuum sealer",
      "sous vide vacuum sealer"
    );
    if (width) terms.push(`${width} vacuum sealer`);
  } else if (categorySlug === "vacuum-bags") {
    terms.push("LAVA vacuum bags", "embossed vacuum bags South Africa", "sous vide bags", "freezer vacuum bags");
    if (size) terms.push(`vacuum bags ${size}`);
  } else if (categorySlug === "vacuum-rolls") {
    terms.push("LAVA vacuum rolls", "embossed vacuum roll", "vacuum bag roll South Africa");
    if (size) terms.push(`vacuum roll ${size}`);
  }
  return [...new Set(terms)].join(", ");
}

function generate(product, categorySlug) {
  const specs = product.specs ?? {};
  const useCaseLines =
    categorySlug === "vacuum-machines"
      ? machineUseCases(product.name, specs)
      : categoryUseCases(product.name, categorySlug);
  return {
    ai_summary: summaryFromShort(product.name, product.short_description ?? "", categorySlug),
    ai_search_terms: searchTerms(product.name, categorySlug, specs),
    ai_use_cases: useCaseLines.join("\n"),
  };
}

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

const env = loadEnvLocal();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: products, error } = await supabase
  .from("products")
  .select("id, name, slug, short_description, specs, categories(slug)")
  .order("name");

if (error) {
  console.error("Fetch failed:", error.message);
  process.exit(1);
}

let updated = 0;
let skipped = 0;

for (const row of products ?? []) {
  const categorySlug = row.categories?.slug ?? "";
  const specs = row.specs ?? {};
  const hasAll =
    specs.ai_summary?.trim() &&
    specs.ai_search_terms?.trim() &&
    specs.ai_use_cases?.trim();

  if (hasAll && !force) {
    skipped++;
    continue;
  }

  const generated = generate(row, categorySlug);
  const nextSpecs = {
    ...specs,
    ai_summary: force || !specs.ai_summary?.trim() ? generated.ai_summary : specs.ai_summary,
    ai_search_terms:
      force || !specs.ai_search_terms?.trim() ? generated.ai_search_terms : specs.ai_search_terms,
    ai_use_cases: force || !specs.ai_use_cases?.trim() ? generated.ai_use_cases : specs.ai_use_cases,
  };

  console.log(`${dryRun ? "[dry-run] " : ""}→ ${row.name}`);
  if (!dryRun) {
    const { error: upErr } = await supabase.from("products").update({ specs: nextSpecs }).eq("id", row.id);
    if (upErr) {
      console.error(`  FAILED: ${upErr.message}`);
      continue;
    }
  }
  updated++;
}

console.log(`\nDone. ${updated} updated, ${skipped} already had AI fields.${dryRun ? " (dry-run — no DB writes)" : ""}`);
