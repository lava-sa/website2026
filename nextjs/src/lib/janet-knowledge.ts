/**
 * Canonical product facts for Janet voice/chat — keep in sync with bags-rolls page size tables.
 */

export const JANET_BAG_SIZES = [
  { size: "10 × 15 cm", use: "Spices, herbs, small cuts" },
  { size: "13 × 20 cm", use: "Chicken fillets, fish, deli meat" },
  { size: "13 × 22.5 cm", use: "Sausages, chicken pieces" },
  { size: "20 × 30 cm", use: "Steaks, chops — most popular" },
  { size: "20 × 35 cm", use: "Whole fish, large chops, biltong" },
  { size: "20 × 40 cm", use: "Roasts, game portions" },
  { size: "25 × 60 cm", use: "Legs of lamb, large game" },
  { size: "30 × 60 cm", use: "Whole chickens, shoulders" },
] as const;

export const JANET_ROLL_SIZES = [
  { size: "15 cm wide", use: "Sausages, asparagus, narrow cuts" },
  { size: "20 cm wide", use: "Steaks, chops — most popular roll width" },
  { size: "25 cm wide", use: "Roasts, larger cuts" },
  { size: "30 cm wide", use: "Whole chickens, large game — max for V.300" },
] as const;

/** Sealing bar width in mm from machine catalog (Janet must use these, not guess). */
export function sealWidthMmForMachine(machineName: string): number | null {
  const n = machineName.toLowerCase();
  if (n.includes("v.100")) return 340;
  if (n.includes("v.300 white")) return 340;
  if (n.includes("v.300")) return 300;
  if (n.includes("v.400")) return 450;
  if (n.includes("v.500")) return n.includes("xxl") ? 1200 : 750;
  return null;
}

export function bagsThatFitSealWidthMm(maxMm: number): string[] {
  const maxCm = maxMm / 10;
  return JANET_BAG_SIZES.filter((b) => {
    const m = b.size.match(/(\d+(?:\.\d+)?)\s*[×x]/i);
    const w = m ? parseFloat(m[1]) : 0;
    return w > 0 && w <= maxCm;
  }).map((b) => `${b.size} — ${b.use}`);
}

export function rollsThatFitSealWidthMm(maxMm: number): string[] {
  const maxCm = maxMm / 10;
  return JANET_ROLL_SIZES.filter((r) => {
    const m = r.size.match(/(\d+(?:\.\d+)?)\s*cm/i);
    const w = m ? parseFloat(m[1]) : 0;
    return w > 0 && w <= maxCm;
  }).map((r) => `${r.size} — ${r.use}`);
}

export const JANET_CHECKOUT_RULES = `
CHECKOUT & PAYMENT (answer confidently when asked)
- Yes — customers can pay by credit card. Checkout uses PayFast, which accepts Visa and Mastercard.
- EFT / bank transfer is also available at checkout for customers who prefer it.
- Full name, phone, and email are collected at checkout — do not re-ask if they already added to cart.
- Delivery is arranged after payment; shipping is quoted at checkout based on their area.
- Lava Points earn from 1 July 2026 on paid orders, full-price items only (not sale or clearance).
`;

export function buildJanetKnowledgePromptBlock(): string {
  const bags = JANET_BAG_SIZES.map((b) => `${b.size} — ${b.use}`).join("; ");
  const rolls = JANET_ROLL_SIZES.map((r) => `${r.size} — ${r.use}`).join("; ");
  return `${JANET_BAG_ROLL_RULES}
${JANET_CHECKOUT_RULES}
OUR BAG SIZES (centimetres, embossed channel bags only): ${bags}
OUR ROLL WIDTHS (centimetres): ${rolls}
`;
}

export const JANET_BAG_ROLL_RULES = `
VACUUM BAGS & ROLLS — STRICT RULES (never embarrass Lava-SA)
- NEVER say "small bags", "large bags", "jumbo", or vague sizes. Always use centimetre sizes from our catalogue (e.g. "20 by 30 cm", "25 by 60 cm").
- Every LAVA channel sealer has a maximum SEALING WIDTH (mm). A bag or roll is only compatible if its WIDTH in cm is less than or equal to that limit.
- V.300 Premium X / V.300 Black: 300 mm sealing bar → bags up to 30 cm wide; rolls 15, 20, 25, or 30 cm wide.
- V.300 White / V.100 Premium X: 340 mm bar → same bag list plus slightly more headroom.
- V.400 Premium: 450 mm. V.500 models: 750 mm or 1200 mm (XXL).
- Full size guide on website: /products/bags-rolls — mention that page when listing sizes.
- Embossed (channel) bags only — smooth flat bags do not work on LAVA channel sealers.
- For "what roll with V.300": recommend 20 cm wide for everyday steaks/chops; 25–30 cm for larger game; 15 cm for narrow items.
`;
