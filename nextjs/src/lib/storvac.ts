/**
 * StorVac cross-sell: when a LAVA bag size is out of stock, point the customer
 * to the same size on our value range at storvac.co.za.
 * StorVac makes 6 sizes only; larger commercial LAVA sizes have no twin.
 */
const STORVAC_BASE_URL =
  process.env.NEXT_PUBLIC_STORVAC_URL ?? "https://www.storvac.co.za";

const STORVAC_SIZES: Record<string, { slug: string; width: number; length: number }> = {
  "16x25": { slug: "bag-16x25-50", width: 16, length: 25 },
  "15x45": { slug: "bag-15x45-50", width: 15, length: 45 },
  "20x30": { slug: "bag-20x30-50", width: 20, length: 30 },
  "25x35": { slug: "bag-25x35-50", width: 25, length: 35 },
  "30x40": { slug: "bag-30x40-50", width: 30, length: 40 },
  "30x50": { slug: "bag-30x50-50", width: 30, length: 50 },
};

function sizeKey(a: number, b: number): string {
  return `${Math.min(a, b)}x${Math.max(a, b)}`;
}

function parseDimsFromName(name?: string | null): [number, number] | null {
  if (!name) return null;
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*[×x✕]\s*(\d+(?:[.,]\d+)?)/i);
  if (!m) return null;
  const w = parseFloat(m[1].replace(",", "."));
  const l = parseFloat(m[2].replace(",", "."));
  if (!Number.isFinite(w) || !Number.isFinite(l)) return null;
  return [w, l];
}

export type StorvacMatch = { url: string; label: string; slug: string };

export function storvacUrlForSize(
  width?: number | null,
  length?: number | null,
  name?: string | null
): StorvacMatch | null {
  let w = width ?? null;
  let l = length ?? null;
  if (w == null || l == null || w <= 0 || l <= 0) {
    const parsed = parseDimsFromName(name);
    if (parsed) [w, l] = parsed;
  }
  if (w == null || l == null || w <= 0 || l <= 0) return null;
  const match = STORVAC_SIZES[sizeKey(w, l)];
  if (!match) return null;
  return { url: `${STORVAC_BASE_URL}/shop/${match.slug}`, label: `${match.width} × ${match.length} cm`, slug: match.slug };
}
