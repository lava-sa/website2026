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

export type BenefitImageChoice = "primary" | "001" | "002" | "003" | "004";

export interface MachineBenefitBlockConfig {
  overline: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  /** welding always uses primary product image */
  imageChoice: BenefitImageChoice;
  linkHref?: string;
  linkLabel?: string;
  quote?: string;
  quoteAttribution?: string;
}

export type MachineBenefitsConfig = Record<BenefitBlockId, MachineBenefitBlockConfig>;

const DESC_IMG = "/images/products/descriptions";

/** Site-wide fallback images when machine folder image is missing */
export const BENEFIT_FALLBACK_IMAGES: Record<BenefitBlockId, string> = {
  welding: `${DESC_IMG}/welding-at-the-touch-of-a-button.webp`,
  double_seal: `${DESC_IMG}/double-sealing-lava-vacuum-machines.webp`,
  containers: `${DESC_IMG}/for-containers-and-jars-vacuum-sealing.webp`,
  variety: `${DESC_IMG}/limitless-variety-lava-vacuum-sealing-machines.webp`,
  germany: `${DESC_IMG}/lava-vacuum-sealers-quality-without-compromise.webp`,
};

/** Default image choice per block when admin has not set one */
export const BENEFIT_DEFAULT_IMAGE_CHOICE: Record<BenefitBlockId, BenefitImageChoice> = {
  welding: "primary",
  double_seal: "001",
  containers: "002",
  variety: "003",
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
    imageChoice: "primary",
  },
  double_seal: {
    overline: "Twice the seal, twice the security",
    title: "Double Sealing with LAVA Vacuum Machines",
    paragraph1:
      "Two parallel weld lines instead of one. If the first seal ever fails — under freezer pressure, sous-vide heat, or transport — the second seal holds.",
    paragraph2:
      "This is the difference between a bag that holds for years and one that vents after a month. It's why professional butcheries and hunters trust Lava with their entire season's harvest.",
    imageChoice: "001",
  },
  containers: {
    overline: "Beyond bags",
    title: "For Containers and Jars Vacuum Sealing",
    paragraph1:
      "Every Lava vacuum sealer ships with a hose attachment — extend the same machine to vacuum-seal Lava containers, glass jars, wine bottles and even pots. One device, dozens of use cases.",
    paragraph2: "",
    imageChoice: "002",
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
    imageChoice: "003",
  },
  germany: {
    overline: "Made in Germany since 1982",
    title: "LAVA Vacuum Sealers: Quality without Compromise",
    paragraph1:
      "Every Lava is engineered, machined and assembled in Bad Saulgau, Baden-Württemberg by the Landig family. The same factory, the same tolerances, the same obsession with build quality for over four decades.",
    paragraph2: "",
    imageChoice: "primary",
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

export function machineBenefitImagePath(
  productSlug: string,
  choice: BenefitImageChoice
): string {
  if (choice === "primary") return "";
  return `/images/products/machines/${productSlug}/image-${choice}.webp`;
}

export function resolveBenefitImageUrl(
  blockId: BenefitBlockId,
  productSlug: string,
  primaryImageUrl: string | null | undefined,
  imageChoice: BenefitImageChoice
): string {
  if (blockId === "welding" || imageChoice === "primary") {
    return primaryImageUrl || BENEFIT_FALLBACK_IMAGES[blockId];
  }
  return machineBenefitImagePath(productSlug, imageChoice) || BENEFIT_FALLBACK_IMAGES[blockId];
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
    const b = block as Partial<MachineBenefitBlockConfig>;
    merged[id] = {
      ...merged[id],
      ...(b.overline !== undefined && { overline: String(b.overline) }),
      ...(b.title !== undefined && { title: String(b.title) }),
      ...(b.paragraph1 !== undefined && { paragraph1: String(b.paragraph1) }),
      ...(b.paragraph2 !== undefined && { paragraph2: String(b.paragraph2) }),
      ...(b.imageChoice !== undefined && { imageChoice: b.imageChoice as BenefitImageChoice }),
      ...(b.linkHref !== undefined && { linkHref: String(b.linkHref) }),
      ...(b.linkLabel !== undefined && { linkLabel: String(b.linkLabel) }),
      ...(b.quote !== undefined && { quote: String(b.quote) }),
      ...(b.quoteAttribution !== undefined && {
        quoteAttribution: String(b.quoteAttribution),
      }),
    };
  }
  return merged;
}

export function machineBenefitsToSpecs(
  existingSpecs: Record<string, unknown> | null | undefined,
  benefits: MachineBenefitsConfig
): Record<string, unknown> {
  const next = { ...(existingSpecs ?? {}) };
  const hasCustom = BENEFIT_BLOCK_ORDER.some((id) => {
    const current = benefits[id];
    const def = DEFAULT_MACHINE_BENEFITS[id];
    return JSON.stringify(current) !== JSON.stringify(def);
  });
  if (hasCustom) {
    next.machine_benefits = benefits;
  } else {
    delete next.machine_benefits;
  }
  return next;
}
