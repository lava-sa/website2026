/**
 * Compare Anneke June 2026 PDF price lists vs site seed/SQL catalogue.
 * Run: node scripts/compare-price-list-062026.mjs
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
    if (/^(LAVA MACHINES|PLASTIC BAGS|SOUS VIDE|VACUUM LIDS|PLASTIC ROLLS|ACRYLIC|STAINLESS|OTHER|HUNTING|BUTCHER|SCALES|MEAT MINCERS|CODE NET)/i.test(t)) continue;
    const prices = [...t.matchAll(/([\d,]+)R/g)].map((m) => parseInt(m[1].replace(/,/g, ""), 10));
    const codes = [...t.matchAll(codeRe)].map((m) => m[1]);
    if (!codes.length || !prices.length) continue;
    items.push({
      code: codes[codes.length - 1],
      name: t.split(codes[codes.length - 1])[0].replace(/\s+/g, " ").trim(),
      totalIncl: prices[prices.length - 1],
      net: prices.length >= 3 ? prices[prices.length - 3] : null,
    });
  }
  return items;
}

function loadSiteProducts() {
  const products = new Map();
  const add = (p) => {
    if (!p?.slug) return;
    const cur = products.get(p.slug) || {};
    products.set(p.slug, {
      slug: p.slug,
      name: p.name || cur.name || p.slug,
      sku: (p.sku || cur.sku || "").toUpperCase(),
      price: p.price ?? p.regular_price ?? cur.price ?? null,
      source: p.source || cur.source,
    });
  };

  for (const file of fs.readdirSync(__dirname).filter((f) => f.endsWith(".json"))) {
    let raw = fs.readFileSync(path.join(__dirname, file), "utf8").replace(/^\uFEFF/, "");
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!Array.isArray(data)) continue;
    for (const p of data) add({ ...p, source: file });
  }

  for (const file of fs.readdirSync(__dirname).filter((f) => f.startsWith("seed-") && f.endsWith(".mjs"))) {
    const text = fs.readFileSync(path.join(__dirname, file), "utf8");
    const blockRe = /{\s*sku:\s*["']([^"']+)["'][\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?regular_price:\s*(\d+)/g;
    let m;
    while ((m = blockRe.exec(text))) {
      add({ sku: m[1], slug: m[2], price: parseInt(m[3], 10), source: file });
    }
    const blockRe2 = /slug:\s*["']([^"']+)["'][\s\S]*?sku:\s*["']([^"']+)["'][\s\S]*?regular_price:\s*(\d+)/g;
    while ((m = blockRe2.exec(text))) {
      add({ slug: m[1], sku: m[2], price: parseInt(m[3], 10), source: file });
    }
  }

  // SQL migrations (latest wins)
  const sqlDir = path.join(__dirname, "..", "supabase");
  for (const file of fs.readdirSync(sqlDir).filter((f) => f.endsWith(".sql")).sort()) {
    const text = fs.readFileSync(path.join(sqlDir, file), "utf8");
    const insRe = /'([A-Z0-9()]+)',\s*\n?\s*'([^']{5,})',\s*\n?\s*'([^']+)',\s*[\s\S]*?(\d{2,6}(?:\.\d+)?),\s*NULL/sg;
    let m;
    while ((m = insRe.exec(text))) {
      const [, sku, name, slug, price] = m;
      if (slug.includes("-") || slug.length > 4) {
        add({ sku, slug, name, price: Math.round(parseFloat(price)), source: file });
      }
    }
    const updRe = /WHERE slug = '([^']+)'[\s\S]*?regular_price\s*=\s*(\d+)/g;
    while ((m = updRe.exec(text))) {
      const existing = products.get(m[1]);
      if (existing) existing.price = parseInt(m[2], 10);
    }
  }

  return products;
}

const norm = (s) => (s || "").toUpperCase().replace(/\s+/g, "");

const lavaText = fs.readFileSync(path.join(IMPORT_DIR, "lava-price-list-2026.txt"), "utf8");
const landigText = fs.readFileSync(path.join(IMPORT_DIR, "landig-price-list-2026.txt"), "utf8");
const pdfItems = [...parsePdfText(lavaText), ...parsePdfText(landigText)];
const siteProducts = loadSiteProducts();

const bySku = new Map();
for (const p of siteProducts.values()) {
  if (p.sku) bySku.set(norm(p.sku), p);
}

const priceMismatches = [];
const matched = [];
const notOnSite = [];

for (const pdf of pdfItems) {
  const code = norm(pdf.code);
  let site = bySku.get(code);
  if (!site) {
    // try without parens e.g. VL0010(4) -> VL0010
    site = bySku.get(code.replace(/\(.*\)/, ""));
  }
  if (!site) {
    notOnSite.push(pdf);
    continue;
  }
  matched.push({ pdf, site });
  if (site.price != null && site.price !== pdf.totalIncl) {
    priceMismatches.push({ pdf, site, delta: pdf.totalIncl - site.price });
  }
}

const pdfCodes = new Set(pdfItems.map((p) => norm(p.code)));
const notInPdf = [...siteProducts.values()]
  .filter((p) => p.sku && !pdfCodes.has(norm(p.sku)) && !pdfCodes.has(norm(p.sku.replace(/\(.*\)/, ""))))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const report = {
  summary: {
    pdfLineItems: pdfItems.length,
    siteProductsTracked: siteProducts.size,
    matchedBySku: matched.length,
    priceMismatches: priceMismatches.length,
    onPdfNotOnSite: notOnSite.length,
    onSiteNotInPdf: notInPdf.length,
  },
  priceMismatches: priceMismatches
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .map(({ pdf, site, delta }) => ({
      pdfCode: pdf.code,
      pdfName: pdf.name,
      pdfTotalIncl: pdf.totalIncl,
      siteSlug: site.slug,
      siteSku: site.sku,
      sitePrice: site.price,
      changeTo: pdf.totalIncl,
      delta,
    })),
  onPdfNotOnSite: notOnSite.map((p) => ({ code: p.code, name: p.name, totalIncl: p.totalIncl })),
  onSiteNotInPdf: notInPdf.map((p) => ({ slug: p.slug, sku: p.sku, name: p.name, price: p.price, source: p.source })),
};

fs.writeFileSync(path.join(IMPORT_DIR, "comparison-report.json"), JSON.stringify(report, null, 2));

// Markdown report
const md = [
  "# Lava-SA price list comparison — June 2026",
  "",
  `PDF items: **${report.summary.pdfLineItems}** | Site products (seeds/SQL): **${report.summary.siteProductsTracked}** | Matched by SKU: **${report.summary.matchedBySku}**`,
  "",
  "## 1. Price updates required (PDF vs site)",
  "",
  "| Code | Product | PDF (incl VAT) | Site price | Change to |",
  "|------|---------|----------------|------------|-----------|",
  ...report.priceMismatches.map(
    (r) => `| ${r.pdfCode} | ${r.pdfName.slice(0, 40)} | R ${r.pdfTotalIncl.toLocaleString()} | R ${r.sitePrice?.toLocaleString() ?? "—"} | **R ${r.changeTo.toLocaleString()}** |`
  ),
  "",
  "## 2. On price list — not on website (or SKU not matched)",
  "",
  ...report.onPdfNotOnSite.map((r) => `- **${r.code}** — ${r.name} — R ${r.totalIncl.toLocaleString()}`),
  "",
  "## 3. On website — not on June 2026 price lists",
  "",
  ...report.onSiteNotInPdf.slice(0, 80).map((r) => `- **${r.sku || "?"}** \`${r.slug}\` — ${r.name?.slice(0, 50) || ""} — R ${r.price ?? "?"}`),
  report.onSiteNotInPdf.length > 80 ? `\n_…and ${report.onSiteNotInPdf.length - 80} more (see JSON)._` : "",
].join("\n");

fs.writeFileSync(path.join(IMPORT_DIR, "PRICE-COMPARISON-REPORT.md"), md);
console.log(JSON.stringify(report.summary, null, 2));
console.log("Wrote comparison-report.json and PRICE-COMPARISON-REPORT.md");
