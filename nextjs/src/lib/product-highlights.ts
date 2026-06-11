import { stripHtml } from "@/lib/products";
import type { Product } from "@/types/product";

export interface ProductHighlight {
  title: string;
  description: string;
}

/** Sensible defaults when a product has no reviews and no ai_use_cases in admin. */
const CATEGORY_HIGHLIGHTS: Record<string, ProductHighlight[]> = {
  "vacuum-machines": [
    { title: "Serious home & hobby use", description: "Hunters, anglers, meal preppers and small kitchens who vacuum-seal weekly or daily." },
    { title: "German build quality", description: "Engineered for years of use — not a throwaway discount-store sealer." },
    { title: "Local support", description: "Johannesburg-based team, 2-year warranty and spare parts from Lava-SA." },
  ],
  "vacuum-bags": [
    { title: "Embossed channel bags", description: "Works with all channel-type LAVA and compatible vacuum sealers." },
    { title: "Freezer & sous vide", description: "Strong welds for long freezer storage and water-bath cooking." },
    { title: "Many sizes", description: "From snack portions to full cuts — pick the width and length you need." },
  ],
  "vacuum-rolls": [
    { title: "Custom bag lengths", description: "Cut only what you need — less waste than pre-made bags." },
    { title: "Bulk & game processing", description: "Ideal when you seal many portions in one session." },
    { title: "Embossed texture", description: "Channel pattern draws air reliably for a tight vacuum." },
  ],
  "containers-lids": [
    { title: "Beyond bags", description: "Marinate, store and preserve in rigid containers — see what's inside." },
    { title: "Fits LAVA machines", description: "Use the hose attachment on your existing LAVA sealer." },
    { title: "Fridge & freezer", description: "Stackable, reusable alternatives to single-use plastic bags." },
  ],
  "glass-containers": [
    { title: "Microwave & dishwasher", description: "Glass bowls you can heat, wash and vacuum-seal again." },
    { title: "Meal prep visibility", description: "See layers and portions without opening the container." },
    { title: "Premium storage", description: "For sauces, leftovers and ingredients you want to protect properly." },
  ],
  "stainless-containers": [
    { title: "Commercial toughness", description: "Stainless steel for busy kitchens and frequent sealing." },
    { title: "Marinating under vacuum", description: "Draw flavour into meat and fish faster than overnight in a bag alone." },
    { title: "Long service life", description: "Built to withstand daily use in food production environments." },
  ],
  "acrylic-lids": [
    { title: "Five sizes", description: "From small jars (47 mm) to large bowls (280 mm) — pick the lid that matches your container rim." },
    { title: "Universal fit", description: "Seal bowls, pots, pans, jars and cans with a smooth flat rim." },
    { title: "Machine or Easy Pump", description: "Integrated valve works with all LAVA sealers and the rechargeable Easy Pump." },
  ],
  "glass-jar-sealer": [
    { title: "Almost any jar shape", description: "Flex sealer fits round, oval, square or conical twist-off and mason jars up to 106 mm." },
    { title: "Dry goods & preserves", description: "Vacuum-seal jams, pickles, coffee, spices, nuts and dry ingredients." },
    { title: "Machine or Easy Pump", description: "Works with all LAVA vacuum sealers in container mode, or the rechargeable Easy Pump." },
  ],
  "sous-vide": [
    { title: "Precise temperature", description: "Restaurant-style low-temperature cooking at home or in a small kitchen." },
    { title: "Pairs with vacuum bags", description: "Seal portions first, then cook evenly in a water bath." },
    { title: "Consistent results", description: "Repeat the same doneness for game, fish, beef and vegetables." },
  ],
  "spare-parts": [
    { title: "Genuine LAVA parts", description: "Correct seals, strips and consumables for your machine model." },
    { title: "Extend machine life", description: "Replace wear items before performance drops." },
    { title: "Ship from SA stock", description: "Order from the local distributor — no waiting on overseas freight." },
  ],
  "butchery-accessories": [
    { title: "Professional butchery", description: "Tools and equipment for cutting, display and processing meat." },
    { title: "Hygiene & workflow", description: "Boards, knives and accessories built for daily commercial use." },
    { title: "Pairs with vacuum sealing", description: "Cut, portion and seal game or beef in one workflow." },
  ],
  "special-offers": [
    { title: "Bundle value", description: "Combined machine, bags or accessories at a package price." },
    { title: "Starter kits", description: "Everything you need to begin vacuum sealing in one order." },
    { title: "Limited offers", description: "Check stock — specials change with availability." },
  ],
};

const GENERIC_HIGHLIGHTS: ProductHighlight[] = [
  { title: "German LAVA quality", description: "From the authorised South African distributor — trusted since 2007." },
  { title: "Nationwide delivery", description: "Courier across all nine provinces with tracked shipping." },
  { title: "Expert advice", description: "Call or WhatsApp our team if you are unsure this item fits your setup." },
];

function parseAiUseCases(raw: string): ProductHighlight[] {
  const chunks = raw
    .split(/\n+|(?:\s*•\s*)|(?:\s*\|\s*)|(?:\s*;\s+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

  return chunks.slice(0, 3).map((chunk) => {
    const dash = chunk.match(/^(.{3,60}?)\s*[—–:-]\s*(.+)$/);
    if (dash) {
      return { title: dash[1].trim(), description: dash[2].trim() };
    }
    return { title: "Ideal use", description: chunk };
  });
}

function highlightsFromDescription(html: string | null | undefined): ProductHighlight[] {
  const plain = stripHtml(html);
  if (!plain || plain.length < 40) return [];

  const sentences = plain
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  return sentences.slice(0, 3).map((sentence, i) => ({
    title: i === 0 ? "Why customers choose it" : i === 1 ? "Built for real use" : "Practical benefit",
    description: sentence,
  }));
}

/** Three feature / use-case cards for products without verified reviews. */
export function getProductHighlights(product: Product): ProductHighlight[] {
  const fromAi = parseAiUseCases(String(product.specs?.ai_use_cases ?? ""));
  if (fromAi.length >= 3) return fromAi;

  const fromShort = highlightsFromDescription(product.short_description);
  const categorySlug = product.categories?.slug ?? "";
  const categoryDefaults = CATEGORY_HIGHLIGHTS[categorySlug] ?? GENERIC_HIGHLIGHTS;

  const merged: ProductHighlight[] = [...fromAi, ...fromShort];
  for (const item of categoryDefaults) {
    if (merged.length >= 3) break;
    if (!merged.some((m) => m.description === item.description)) {
      merged.push(item);
    }
  }

  return merged.slice(0, 3);
}
