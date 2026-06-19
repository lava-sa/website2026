/**
 * Generate supabase/031_product_cost_prices.sql from June 2026 price list NET column.
 * Run: node scripts/generate-cost-price-migration.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMPORT_DIR = path.join(__dirname, "imports", "price-list-062026");

function parsePdfText(text) {
  const items = [];
  const codeRe = /\b([A-Z]{1,2}\d{4}[A-Za-z0-9()]*|Z\d{5,6}[a-z]?|WK\d+)\b/g;
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || /^E\. & E/i.test(t) || /Stirling|Web:|Email:|Tel:|Suppliers of|VAT NR/i.test(t)) continue;
    if (
      /^(LAVA MACHINES|PLASTIC BAGS|SOUS VIDE|VACUUM LIDS|PLASTIC ROLLS|ACRYLIC|STAINLESS|OTHER|HUNTING|BUTCHER|SCALES|MEAT MINCERS|CODE NET)/i.test(
        t
      )
    )
      continue;
    const prices = [...t.matchAll(/([\d,]+)R/g)].map((m) => parseInt(m[1].replace(/,/g, ""), 10));
    const codes = [...t.matchAll(codeRe)].map((m) => m[1]);
    if (!codes.length || !prices.length) continue;
    items.push({
      code: codes[codes.length - 1],
      net: prices.length >= 3 ? prices[prices.length - 3] : null,
    });
  }
  return items;
}

const map = new Map();
for (const it of [
  ...parsePdfText(fs.readFileSync(path.join(IMPORT_DIR, "lava-price-list-2026.txt"), "utf8")),
  ...parsePdfText(fs.readFileSync(path.join(IMPORT_DIR, "landig-price-list-2026.txt"), "utf8")),
]) {
  if (it.net != null) map.set(it.code.toUpperCase(), it.net);
}

const lines = [
  "-- ═══════════════════════════════════════════════════════",
  "-- LAVA-SA — Product cost prices (NET ex-VAT, June 2026 price list)",
  "-- cost_price = supplier NET column; regular_price = TOTAL COST incl. 15% VAT",
  "-- Run in Supabase SQL Editor (idempotent)",
  "-- ═══════════════════════════════════════════════════════",
  "",
  "ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price decimal(10,2);",
  "",
  "COMMENT ON COLUMN products.cost_price IS 'Supplier NET cost ex-VAT (ZAR). From Landig price list.';",
  "",
];

for (const [code, net] of [...map.entries()].sort()) {
  const esc = code.replace(/'/g, "''");
  lines.push(`UPDATE products SET cost_price = ${net}, updated_at = NOW() WHERE UPPER(TRIM(sku)) = '${esc}';`);
  const base = code.replace(/\(.*\)/, "");
  if (base !== code) {
    lines.push(
      `UPDATE products SET cost_price = ${net}, updated_at = NOW() WHERE UPPER(TRIM(sku)) = '${base.replace(/'/g, "''")}' AND cost_price IS NULL;`
    );
  }
}

const outPath = path.join(__dirname, "..", "supabase", "031_product_cost_prices.sql");
fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`Wrote ${map.size} SKU cost updates → ${outPath}`);
