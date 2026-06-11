/**
 * One-off scraper for la-va.com product pages → JSON
 * Run: node scripts/scrape-lava-de.mjs
 */

const URLS = [
  "https://la-va.com/en/electric-vacuum-pump/",
  "https://la-va.com/en/g-line-vacuum-container-Lid-color-black/",
  "https://la-va.com/en/g-line-vacuum-container-Lid-color-white/",
];

function strip(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

for (const url of URLS) {
  console.log("\n" + "=".repeat(60));
  console.log(url);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();

    const title =
      html.match(/class="product_title[^"]*"[^>]*>([^<]+)</)?.[1]?.trim() ||
      html.match(/<title>([^<|]+)/)?.[1]?.trim();

    const sku =
      html.match(/Art\.-Nr\.:?\s*<\/span>\s*<span[^>]*>([^<]+)</i)?.[1]?.trim() ||
      html.match(/Art\.-Nr\.:?\s*([^<\s]+)/i)?.[1]?.trim();

    const priceEur =
      html.match(/woocommerce-Price-amount amount">\s*<bdi>\s*<span[^>]*>[^<]*<\/span>\s*([0-9.,]+)/)?.[1] ||
      html.match(/"price"\s*:\s*"([0-9.]+)"/)?.[1];

    const shortBlock = html.match(
      /woocommerce-product-details__short-description[^>]*>([\s\S]*?)<\/div>/i
    )?.[1];

    const descBlock = html.match(
      /id="tab-description"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i
    )?.[1];

    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => {
        try {
          return JSON.parse(m[1]);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const productLd = jsonLd.find((j) => j["@type"] === "Product" || j["@type"]?.includes?.("Product"));

    // WooCommerce variation attributes
    const selectOptions = [...html.matchAll(/<option[^>]*value="([^"]+)"[^>]*>([^<]+)<\/option>/g)]
      .filter((m) => /liter|ml|L\b/i.test(m[2]))
      .map((m) => ({ value: m[1], label: m[2].trim() }));

    console.log(JSON.stringify({
      title,
      sku,
      priceEur,
      shortDescription: shortBlock ? strip(shortBlock).slice(0, 300) : null,
      descriptionSnippet: descBlock ? strip(descBlock).slice(0, 500) : null,
      jsonLdProduct: productLd
        ? {
            name: productLd.name,
            sku: productLd.sku,
            price: productLd.offers?.price,
            description: productLd.description?.slice?.(0, 300),
          }
        : null,
      sizeOptions: selectOptions.slice(0, 12),
    }, null, 2));
  } catch (err) {
    console.error("ERR:", err.message);
  }
}
