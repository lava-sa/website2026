const res = await fetch("https://la-va.com/en/universal-vacuum-lids/", {
  headers: { "User-Agent": "Mozilla/5.0" },
});
const html = await res.text();

const options = [...html.matchAll(/<option[^>]*>([^<]+)<\/option>/gi)].map((m) =>
  m[1].replace(/&nbsp;/g, " ").trim()
);
console.log("=== DROPDOWN OPTIONS ===");
options.filter((o) => o && !o.includes("Choose")).forEach((o) => console.log(o));

const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
for (const [, raw] of jsonLd) {
  try {
    const data = JSON.parse(raw);
    if (data["@type"] === "Product" || data.offers) {
      console.log("\n=== JSON-LD PRODUCT ===");
      console.log(JSON.stringify(data, null, 2).slice(0, 4000));
    }
  } catch {}
}

const skuBlocks = [...html.matchAll(/VL\d{4}/g)].map((m) => m[0]);
console.log("\n=== VL SKUS ===", [...new Set(skuBlocks)]);
