/**
 * Generate permanent redirects from legacy WordPress (lava-sa.co.za) URLs
 * to the Next.js site (lava-sa.com).
 *
 * Source: Rank Math sitemaps fetched 2026-07-10.
 * Run: node scripts/generate-legacy-co-za-redirects.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "legacy-co-za-redirects.ts");

const SITEMAPS = [
  "https://www.lava-sa.co.za/page-sitemap.xml",
  "https://www.lava-sa.co.za/product-sitemap.xml",
  "https://www.lava-sa.co.za/download-sitemap.xml",
];

/** Woo product slug → new product slug (or full destination path). */
const PRODUCT_SLUG_MAP = {
  // Machines
  "lava-v100-premium-x-vacuum-sealing-machine": "v100-premium-x",
  "lava-v100-premium-vacuum-packing-machine": "v100-premium",
  "lava-v300-premium-x-vacuum-packing-machine": "v300-premium-x",
  "lava-v300-premium-black-limited-edition-vacuum-packing-machine": "v300-black",
  "lava-v300-premium-white": "v300-white",
  "lava-v400-premium-vacuum-packing-machine": "v400-premium",
  "lava-v500-premium-72-cm-vacuum-packing-machine": "v500-premium",
  "lava-v500-premium-121-cm-vacuum-packing-machine": "v500-premium-xxl",

  // Rolls
  "4-x-15-cm-x-6-m-embossed-vacuum-rolls": "embossed-vacuum-rolls-15cm-6m-4pack",
  "2-x-20-cm-x-6-m-embossed-vacuum-rolls": "embossed-vacuum-rolls-20cm-6m-2pack",
  "2-x-30-cm-x-6-m-embossed-vacuum-rolls": "embossed-vacuum-rolls-30cm-6m-2pack",
  "2-x-60-cm-x-6-m-embossed-vacuum-rolls": "embossed-vacuum-rolls-30cm-6m-2pack",

  // Acrylic / containers
  "new-line-vacuum-container-rectangular-650ml": "acrylic-container-650ml-square",
  "new-line-vacuum-container-rectangular-1200ml": "acrylic-container-1200ml-square",
  "new-line-vacuum-container-rectangular-1650ml": "acrylic-container-1650ml-rectangular",
  "new-line-vacuum-container-rectangular-2000ml": "acrylic-container-2000ml-square",
  "4-piece-acrylic-vacuum-container-set": "acrylic-container-set-4-piece",
  "glass-vacuum-container-1520ml-with-handpump": "glass-vacuum-container-1520ml",
  "lava-flex-jar-sealer": "lava-flex-sealer-for-jars",
  "stainless-steel-es-line-vacuum-bowl-2500ml": "es-line-stainless-container-2500ml",
  "stainless-steel-es-line-vacuum-bowl-1300ml": "es-line-stainless-container-1300ml",
  "stainless-steel-es-line-vacuum-bowl-4000ml": "es-line-stainless-container-4000ml",

  // Lids
  "lava-top-vacuum-universal-acrylic-lids-size-20-160-203mm": "acrylic-container-lid-160-203mm",
  "lava-top-vacuum-universal-acrylic-lids-size-23-204-237mm": "acrylic-container-lid-204-237mm",
  "lava-top-vacuum-universal-acrylic-lids-size-27-238-280mm": "acrylic-container-lid-238-280mm",
  "universal-vacuum-acrylic-lids": "/products/acrylic-lids",

  // Woo “category” product pages
  "embossed-vacuum-packing-bags": "/products/vacuum-bags",
  "embossed-vacuum-rolls": "/products/vacuum-rolls",
  "stainless-steel-vacuum-containers": "/products/stainless-containers",
  "round-vacuum-containers": "/products/glass-containers",

  // Salmon boards
  "gold-black-salmon-boards-21x57cm-pack-of-5-boards": "salmon-board-21x57cm-pack-5",
  "gold-black-salmon-boards-18-5x53cm": "salmon-board-18x53cm-pack-5",
  "gold-black-salmon-boards-12x26-5cm": "salmon-board-12x26-5cm-pack-5",

  // Hooks / gambrels
  "stainless-steel-swivel-hooks-300x12mm": "swivel-hooks-300x12mm-200kg",
  "stainless-steel-swivel-hooks-260x10mm": "swivel-hooks-260x10mm-150kg",
  "stainless-steel-swivel-hooks-500x12mm": "xl-swivel-hooks-500x12mm-250kg",
  "stainless-steel-s-hooks-200x9mm": "s-hooks-200x9mm-125kg",
  "stainless-steel-s-hooks-160x6mm": "s-hooks-160x6mm-60kg",
  "stainless-steel-s-hooks-160x8mm": "s-hooks-160x8mm-100kg",
  "stainless-steel-s-hooks-300x12mm": "s-hooks-300x12mm-200kg",
  "adjustable-gambrel-large-810mm": "gambrel-adjustable-810mm",

  // Knives / tools
  "yellow-handle-skinner-knife-16cm-blade": "skinner-knife-16cm-yellow",
  "knife-sharpening-steel-round-10cm": "sharpening-steel-10cm",
  "knife-sharpening-steel-round-30cm": "sharpening-steel-30cm",
  "bone-crusher": "bone-crusher-rib-cutter",
  "lava-labels-permanent-marker": "lava-labels-and-marker",
  "magnetic-knife-board-holder-30cm": "magnetic-knife-holder-30cm",
  "magnetic-knife-board-holder-60cm": "magnetic-knife-board-60cm",
  "apron-l120cm-x-w80cm": "butchers-apron-pvc-120x80cm",

  // Machinery
  "sausage-filler-machine-3l-stainless-steel": "professional-sausage-filler-3l-stainless-steel",
  "sausage-filler-machine-6-8l-stainless-steel": "commercial-sausage-filler-6-8l-stainless-steel",

  // Scales (renamed slugs on new site)
  "manual-hanging-scale-200kg": "hanging-scale-200kg",
  "manual-hanging-scale-100kg": "hanging-scale-100kg",
  "platform-table-top-scale-15kg": "platform-scale-15kg",
  "platform-table-top-scale-60kg": "platform-scale-60kg",
  "electronic-scale-300kg": "digital-hanging-scale-300kg",

  // Knife sets
  "3-piece-butchers-knife-set-yellow-handle": "butcher-knife-set-yellow-3pc",

  // Spare parts → category when slug unknown on new site
  "replacement-vacuum-seals-for-v100-v300-range": "/products/vacuum-seals",
  "replacement-vacuum-seals-for-v333": "/products/vacuum-seals",
  "replacement-vacuum-seals-for-v400-classic": "/products/vacuum-seals",
  "replacement-vacuum-seals-for-v400-premium": "/products/vacuum-seals",
  "replacement-vacuum-seals-for-v500": "/products/vacuum-seals",
  "replacement-lava-sealing-strip-for-v100-v300-premium": "/products/sealing-strips",
  "replacement-lava-sealing-strip-for-v400": "/products/sealing-strips",
  "replacement-lava-sealing-strip-for-v400-premium": "/products/sealing-strips",
  "replacement-lava-sealing-strip-for-v500": "/products/sealing-strips",
  "replacement-lava-sealing-strip-for-v500-premium": "/products/sealing-strips",
  "replacement-liquid-trap-lid-v100-classic-premium": "/products/liquid-trap-lids",
  "replacement-liquid-trap-lid-v400-and-v500-premium": "/products/liquid-trap-lids",
  "replacement-liquid-trap-lid-v400-and-v500-classic": "/products/liquid-trap-lids",
};

/** Static page path (no leading slash) → new path. */
const PAGE_PATH_MAP = {
  "": "/",
  "lava-tv.html": "/lava-tv",
  "lava-tv": "/lava-tv",
  "contact-us.html": "/contact",
  "contact-us": "/contact",
  "contact.html": "/contact",
  "contact": "/contact",
  "shop.html": "/products/vacuum-machines",
  "shop": "/products/vacuum-machines",
  "shop-2.html": "/products/vacuum-machines",
  "shop-2": "/products/vacuum-machines",
  "cart.html": "/checkout",
  "cart": "/checkout",
  "cart-2.html": "/checkout",
  "cart-2": "/checkout",
  "my-account.html": "/account/login",
  "my-account": "/account/login",
  "my-account-2.html": "/account/login",
  "my-account-2": "/account/login",
  "checkout.html": "/checkout",
  "checkout": "/checkout",
  "checkout-2.html": "/checkout",
  "checkout-2": "/checkout",
  "checkout-3.html": "/checkout",
  "checkout-3": "/checkout",
  "shipping-and-returns.html": "/legal/shipping-returns",
  "shipping-and-returns": "/legal/shipping-returns",
  "conditions-of-use.html": "/legal/conditions",
  "conditions-of-use": "/legal/conditions",
  "privacy-notice.html": "/legal/privacy",
  "privacy-notice": "/legal/privacy",
  "lava-sa-terms-and-conditions.html": "/legal/terms",
  "lava-sa-terms-and-conditions": "/legal/terms",
  "owner-manuals.html": "/manuals/v300-series",
  "owner-manuals": "/manuals/v300-series",
  "videos.html": "/lava-tv",
  "videos": "/lava-tv",
  "partners.html": "/about",
  "partners": "/about",
  "important-links.html": "/help/faq",
  "important-links": "/help/faq",
  "self-service.html": "/help/faq",
  "self-service": "/help/faq",
  "need-advice.html": "/vacuum-packaging",
  "need-advice": "/vacuum-packaging",
  "comparing-vacuum-vs-non-vacuum.html": "/vacuum-packaging/advantages",
  "comparing-vacuum-vs-non-vacuum": "/vacuum-packaging/advantages",
  "need-advice/advice-which-is-the-best-vacuum-packing-machine-for-my-needs.html":
    "/guides/vacuum-sealer-buying-guide",
  "need-advice/advice-which-is-the-best-vacuum-packing-machine-for-my-needs":
    "/guides/vacuum-sealer-buying-guide",
  "need-advice/advice-what-does-vacuum-packing-do-or-how-vacuum-packing-works.html":
    "/vacuum-packaging/advantages",
  "need-advice/advice-what-does-vacuum-packing-do-or-how-vacuum-packing-works":
    "/vacuum-packaging/advantages",
  "need-advice/advice-how-to-look-after-your-lava-vacuum-packing-machine.html":
    "/help/warranty",
  "need-advice/advice-how-to-look-after-your-lava-vacuum-packing-machine":
    "/help/warranty",
  "need-advice/advice-using-continues-vacuum-packing-rolls.html":
    "/vacuum-packaging/bags-guide",
  "need-advice/advice-using-continues-vacuum-packing-rolls":
    "/vacuum-packaging/bags-guide",
  "need-advice/advice-using-stainless-steel-and-acrylic-vacuum-containers.html":
    "/products/containers-lids",
  "need-advice/advice-using-stainless-steel-and-acrylic-vacuum-containers":
    "/products/containers-lids",
  "need-advice/advice-vacuum-packing-fruit.html": "/vacuum-packaging/expert-tips",
  "need-advice/advice-vacuum-packing-fruit": "/vacuum-packaging/expert-tips",
  "need-advice/advice-guidelines-for-vacuum-packing-cooked-meat.html":
    "/vacuum-packaging/shelf-life-chart",
  "need-advice/advice-guidelines-for-vacuum-packing-cooked-meat":
    "/vacuum-packaging/shelf-life-chart",
  "need-advice/advice-vacuum-sealing-caps-for-wine-bottles.html":
    "/products/acrylic-lids",
  "need-advice/advice-vacuum-sealing-caps-for-wine-bottles":
    "/products/acrylic-lids",
  "downloads": "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v300-premium-user-manual": "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v300-black-limited-edition-user-manual":
    "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v333-black-edition-user-manual": "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v400-premium-user-manual": "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v500-premium-72-cm-user-manual": "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v500-premium-121-cm-user-manual": "/manuals/v300-series",
  "downloads/lava-vacuum-sealer-v100-premium-user-manual": "/manuals/v100-premium-x",
  "downloads/lava-vacuum-sealer-v100-classic-user-manual": "/manuals/v100-premium-x",
  "downloads/lava-vacuum-packaging-comparison-chart": "/products/vacuum-machines",
  "downloads/a-practical-guide-to-vacuum-packing": "/vacuum-packaging",
  "downloads/lava-digiscale-300-user-manual": "/products/butchery-scales",
  "downloads/landig-pro-star-meat-mincer-90kg-user-manual": "/products/butchery-machinery",
  "pages/lava-vacuum-sealer-v-300-x": "/lp/v300-premium-x",
};

/** Paths we deliberately skip (builder junk, checkout subs, test pages). */
const SKIP_PATHS = new Set([
  "atomic.html",
  "atomic",
  "decor.html",
  "decor",
  "categories.html",
  "categories",
  "furniture.html",
  "furniture",
  "homepage-elements.html",
  "homepage-elements",
  "homepage-06052021.html",
  "homepage-06052021",
  "homepage.html",
  "homepage",
  "sample-page.html",
  "sample-page",
  "no-access.html",
  "no-access",
  "404-2.html",
  "404-2",
  "enquiry-cart.html",
  "enquiry-cart",
  "checkout-3/purchase-confirmation.html",
  "checkout-3/purchase-confirmation",
  "checkout-3/transaction-failed.html",
  "checkout-3/transaction-failed",
  "checkout-3/purchase-history.html",
  "checkout-3/purchase-history",
]);

function fetchXml(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "LAVA-SA-redirect-generator/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchXml(res.headers.location).then(resolve).catch(reject);
          return;
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function pathnameFromCoZa(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/^\/+|\/+$/g, "");
  return p;
}

function productDestination(slug) {
  const mapped = PRODUCT_SLUG_MAP[slug];
  if (!mapped) return `/products/${slug}`;
  if (mapped.startsWith("/")) return mapped;
  return `/products/${mapped}`;
}

function addRedirect(redirects, source, destination) {
  if (!source) return;
  const normalizedDest = destination.startsWith("/") ? destination : `/${destination}`;
  if (source === normalizedDest.replace(/^\//, "")) return;
  const key = `${source}→${normalizedDest}`;
  if (redirects.has(key)) return;
  redirects.set(key, { source: `/${source}`, destination: normalizedDest, permanent: true });
}

async function run() {
  const redirects = new Map();

  addRedirect(redirects, "shop", "/products/vacuum-machines");

  for (const [src, dest] of Object.entries(PAGE_PATH_MAP)) {
    addRedirect(redirects, src, dest);
  }

  const productSlugsFromSitemap = [];

  for (const sm of SITEMAPS) {
    const xml = await fetchXml(sm);
    for (const loc of parseLocs(xml)) {
      const p = pathnameFromCoZa(loc);
      if (!p || SKIP_PATHS.has(p)) continue;

      if (p === "shop") {
        addRedirect(redirects, "shop", "/products/vacuum-machines");
        continue;
      }

      if (p.startsWith("product/")) {
        const slug = p.slice("product/".length);
        productSlugsFromSitemap.push(slug);
        const dest = productDestination(slug);
        addRedirect(redirects, `product/${slug}`, dest);
        continue;
      }

      if (PAGE_PATH_MAP[p] === undefined && !p.startsWith("downloads/") && !p.startsWith("need-advice/")) {
        // Unmapped page — send to closest hub
        if (!SKIP_PATHS.has(p)) {
          addRedirect(redirects, p, "/");
        }
      }
    }
  }

  // Explicit product overrides (ensure even if missing from live sitemap)
  for (const [wooSlug, target] of Object.entries(PRODUCT_SLUG_MAP)) {
    const dest = target.startsWith("/") ? target : `/products/${target}`;
    addRedirect(redirects, `product/${wooSlug}`, dest);
  }

  const explicit = [...redirects.values()].filter((r) => r.source !== "/product/:slug");
  explicit.sort((a, b) => b.source.length - a.source.length);

  const lines = [
    "/**",
    " * Permanent redirects: legacy WordPress lava-sa.co.za URL paths → lava-sa.com.",
    " * Generated by scripts/generate-legacy-co-za-redirects.mjs — re-run after sitemap changes.",
    ` * Last generated: ${new Date().toISOString().slice(0, 10)}`,
    " */",
    "",
    "export type LegacyRedirect = {",
    "  source: string;",
    "  destination: string;",
    "  permanent: boolean;",
    "};",
    "",
    `export const LEGACY_CO_ZA_REDIRECTS: LegacyRedirect[] = ${JSON.stringify(explicit, null, 2)};`,
    "",
    "/** Fallback: same slug when no explicit product rule matched. */",
    "export const LEGACY_WOO_PRODUCT_FALLBACK: LegacyRedirect = {",
    '  source: "/product/:slug",',
    '  destination: "/products/:slug",',
    "  permanent: true,",
    "};",
    "",
  ];

  fs.writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log(`Wrote ${explicit.length} explicit redirects to ${OUT}`);
  console.log(`Product URLs from sitemap: ${productSlugsFromSitemap.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
