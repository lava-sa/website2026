/**
 * Per-machine benefit showcase blocks (5 sections on every vacuum sealer PDP).
 * Stored in product.specs.machine_benefits — merged with defaults when empty.
 */

export type BenefitBlockId =
  | "welding"
  | "double_seal"
  | "containers"
  | "variety"
  | "germany";

/** Blocks 2–4 can be disabled in admin; 1 and 5 are always shown */
export const OPTIONAL_BENEFIT_BLOCKS: BenefitBlockId[] = [
  "double_seal",
  "containers",
  "variety",
];

export interface MachineBenefitBlockConfig {
  overline: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  /** Explicit image URL — when empty, falls back to gallery default index */
  imageUrl?: string;
  /** Only for blocks 2, 3, 4 — default true */
  enabled?: boolean;
  linkHref?: string;
  linkLabel?: string;
  quote?: string;
  quoteAttribution?: string;
}

export type MachineBenefitsConfig = Record<BenefitBlockId, MachineBenefitBlockConfig>;

const DESC_IMG = "/images/products/descriptions";

export const BENEFIT_FALLBACK_IMAGES: Record<BenefitBlockId, string> = {
  welding: `${DESC_IMG}/welding-at-the-touch-of-a-button.webp`,
  double_seal: `${DESC_IMG}/double-sealing-lava-vacuum-machines.webp`,
  containers: `${DESC_IMG}/for-containers-and-jars-vacuum-sealing.webp`,
  variety: `${DESC_IMG}/limitless-variety-lava-vacuum-sealing-machines.webp`,
  germany: `${DESC_IMG}/lava-vacuum-sealers-quality-without-compromise.webp`,
};

/** Default gallery index per block (0-based, sorted gallery incl. primary) */
export const BENEFIT_DEFAULT_GALLERY_INDEX: Record<BenefitBlockId, number | "primary"> = {
  welding: "primary",
  double_seal: 0,
  containers: 1,
  variety: 2,
  germany: "primary",
};

export const DEFAULT_MACHINE_BENEFITS: MachineBenefitsConfig = {
  welding: {
    overline: "One-button simplicity",
    title: "Welding at the Touch of a Button",
    paragraph1:
      "Drop the bag in. Push down. Walk away. The Lava handles vacuum, seal, and release as one fluid motion — no menus, no settings, no fuss.",
    paragraph2:
      "For everything else — delicate foods, marinades, partial vacuums — the manual mode gives you complete control over the suction level. Both worlds, one machine.",
  },
  double_seal: {
    overline: "Twice the seal, twice the security",
    title: "Double Sealing with LAVA Vacuum Machines",
    paragraph1:
      "Two parallel weld lines instead of one. If the first seal ever fails — under freezer pressure, sous-vide heat, or transport — the second seal holds.",
    paragraph2:
      "This is the difference between a bag that holds for years and one that vents after a month. It's why professional butcheries and hunters trust Lava with their entire season's harvest.",
    enabled: true,
  },
  containers: {
    overline: "Beyond bags",
    title: "For Containers and Jars Vacuum Sealing",
    paragraph1:
      "Every Lava vacuum sealer ships with a hose attachment — extend the same machine to vacuum-seal Lava containers, glass jars, wine bottles and even pots. One device, dozens of use cases.",
    paragraph2: "",
    enabled: true,
    linkHref: "/products/containers-lids",
    linkLabel: "Browse the containers & jars range",
  },
  variety: {
    overline: "From kitchen to camp",
    title: "Limitless Variety with LAVA Vacuum Sealing Machines",
    paragraph1:
      "Game meat. Biltong. Fish. Sous-vide cuts. Marinades. Cheese. Coffee beans. Dry goods. Documents. Camera lenses. Ammunition. Anything that benefits from being air-free and moisture-free.",
    paragraph2:
      "South African home cooks, hunters, anglers, butchers, and food producers have used Lava machines daily since 2007 across every imaginable application.",
    enabled: true,
  },
  germany: {
    overline: "Made in Germany since 1982",
    title: "LAVA Vacuum Sealers: Quality without Compromise",
    paragraph1:
      "Every Lava is engineered, machined and assembled in Bad Saulgau, Baden-Württemberg by the Landig family. The same factory, the same tolerances, the same obsession with build quality for over four decades.",
    paragraph2: "",
    quote:
      "I've used my Lava daily in the butchery for nine years. Not one repair, not one missed seal. It just works.",
    quoteAttribution: "Pieter K. — Butcher, Bloemfontein",
  },
};

export const BENEFIT_BLOCK_ORDER: BenefitBlockId[] = [
  "welding",
  "double_seal",
  "containers",
  "variety",
  "germany",
];

export type GalleryImage = {
  id?: string;
  url: string;
  alt?: string | null;
  is_primary?: boolean;
  sort_order?: number;
};

export function sortGalleryImages(images: GalleryImage[]): GalleryImage[] {
  return [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

export function getGalleryUrls(images: GalleryImage[]): string[] {
  return sortGalleryImages(images).map((img) => img.url);
}

export function getVisibleBenefitBlocks(
  config: MachineBenefitsConfig
): BenefitBlockId[] {
  return BENEFIT_BLOCK_ORDER.filter((id) => {
    if (id === "welding" || id === "germany") return true;
    return config[id].enabled !== false;
  });
}

export function defaultBenefitImageUrl(
  blockId: BenefitBlockId,
  galleryUrls: string[],
  primaryImageUrl: string | null | undefined
): string {
  const primary = primaryImageUrl || galleryUrls[0] || "";
  const idx = BENEFIT_DEFAULT_GALLERY_INDEX[blockId];

  if (idx === "primary") return primary || BENEFIT_FALLBACK_IMAGES[blockId];
  return galleryUrls[idx] ?? primary ?? BENEFIT_FALLBACK_IMAGES[blockId];
}

export function resolveBenefitImageUrl(
  blockId: BenefitBlockId,
  block: MachineBenefitBlockConfig,
  galleryUrls: string[],
  primaryImageUrl: string | null | undefined
): string {
  if (blockId === "welding") {
    return primaryImageUrl || galleryUrls[0] || BENEFIT_FALLBACK_IMAGES[blockId];
  }
  if (block.imageUrl?.trim()) return block.imageUrl.trim();
  return defaultBenefitImageUrl(blockId, galleryUrls, primaryImageUrl);
}

function normalizeBlock(
  id: BenefitBlockId,
  base: MachineBenefitBlockConfig,
  raw: Partial<MachineBenefitBlockConfig> & { imageChoice?: string }
): MachineBenefitBlockConfig {
  const next: MachineBenefitBlockConfig = { ...base };

  if (raw.overline !== undefined) next.overline = String(raw.overline);
  if (raw.title !== undefined) next.title = String(raw.title);
  if (raw.paragraph1 !== undefined) next.paragraph1 = String(raw.paragraph1);
  if (raw.paragraph2 !== undefined) next.paragraph2 = String(raw.paragraph2);
  if (raw.imageUrl !== undefined) next.imageUrl = String(raw.imageUrl);
  if (raw.linkHref !== undefined) next.linkHref = String(raw.linkHref);
  if (raw.linkLabel !== undefined) next.linkLabel = String(raw.linkLabel);
  if (raw.quote !== undefined) next.quote = String(raw.quote);
  if (raw.quoteAttribution !== undefined) {
    next.quoteAttribution = String(raw.quoteAttribution);
  }
  if (OPTIONAL_BENEFIT_BLOCKS.includes(id) && raw.enabled !== undefined) {
    next.enabled = Boolean(raw.enabled);
  }

  // Legacy imageChoice field — ignore (gallery defaults used instead)
  void raw.imageChoice;

  return next;
}

function blocksEqual(
  a: MachineBenefitBlockConfig,
  b: MachineBenefitBlockConfig
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function parseMachineBenefitsFromSpecs(
  specs: Record<string, unknown> | null | undefined
): MachineBenefitsConfig {
  const merged = { ...DEFAULT_MACHINE_BENEFITS };
  const raw = specs?.machine_benefits;
  if (!raw || typeof raw !== "object") return merged;

  for (const id of BENEFIT_BLOCK_ORDER) {
    const block = (raw as Record<string, unknown>)[id];
    if (!block || typeof block !== "object") continue;
    merged[id] = normalizeBlock(
      id,
      merged[id],
      block as Partial<MachineBenefitBlockConfig> & { imageChoice?: string }
    );
  }
  return merged;
}

export function machineBenefitsToSpecs(
  existingSpecs: Record<string, unknown> | null | undefined,
  benefits: MachineBenefitsConfig
): Record<string, unknown> {
  const next = { ...(existingSpecs ?? {}) };
  const hasCustom = BENEFIT_BLOCK_ORDER.some(
    (id) => !blocksEqual(benefits[id], DEFAULT_MACHINE_BENEFITS[id])
  );
  if (hasCustom) {
    next.machine_benefits = benefits;
  } else {
    delete next.machine_benefits;
  }
  return next;
}
