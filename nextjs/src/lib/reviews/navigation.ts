import type { DisplayReview } from "./types";

/** Vacuum machines — same order as the site category bar. */
export const VACUUM_MACHINE_REVIEW_ORDER: { slug: string; label: string }[] = [
  { slug: "v100-premium", label: "V.100® Premium" },
  { slug: "v100-premium-x", label: "V.100® Premium X" },
  { slug: "v300-premium-x", label: "V.300® Premium X" },
  { slug: "v300-white", label: "V.300® White (Limited Edition)" },
  { slug: "v300-black", label: "V.300® Black (Limited Edition)" },
  { slug: "v400-premium", label: "V.400® Premium (Commercial)" },
  { slug: "v500-premium", label: "V.500® Premium (72 cm)" },
  { slug: "v500-premium-xxl", label: "V.500® Premium XXL (121 cm)" },
];

export type ReviewSectionId =
  | "general"
  | "vacuum-machines"
  | "bags-rolls"
  | "containers-lids"
  | "videos";

export type ReviewSectionConfig = {
  id: ReviewSectionId;
  label: string;
  description: string;
  /** Fixed product slugs for this section (machines). Other sections use inferred slugs. */
  productOrder?: { slug: string; label: string }[];
};

export const REVIEW_SECTIONS: ReviewSectionConfig[] = [
  {
    id: "general",
    label: "General Reviews",
    description: "Overall service, support and experience with Anneke and the Lava-SA team.",
  },
  {
    id: "vacuum-machines",
    label: "Vacuum Machines",
    description: "Customer feedback on specific LAVA vacuum sealer models.",
    productOrder: VACUUM_MACHINE_REVIEW_ORDER,
  },
  {
    id: "bags-rolls",
    label: "Vacuum Bags & Rolls",
    description: "Reviews on embossed bags, rolls and sealing accessories.",
  },
  {
    id: "containers-lids",
    label: "Containers & Lids",
    description: "Reviews on vacuum containers, glass jars and lids.",
  },
  {
    id: "videos",
    label: "Video Testimonials",
    description: "Video stories from LAVA customers.",
  },
];

const MACHINE_SLUGS = new Set(VACUUM_MACHINE_REVIEW_ORDER.map((p) => p.slug));

export function inferReviewSectionForSlug(slug: string): ReviewSectionId {
  if (MACHINE_SLUGS.has(slug)) return "vacuum-machines";
  if (
    slug.includes("embossed-vacuum") ||
    slug.includes("vacuum-roll") ||
    slug.includes("vacuum-bag") ||
    slug.includes("smooth") ||
    slug.includes("chamber-pouch")
  ) {
    return "bags-rolls";
  }
  if (
    slug.includes("container") ||
    slug.includes("glass") ||
    slug.includes("jar") ||
    slug.includes("lid") ||
    slug.includes("fresh-box") ||
    slug.includes("es-line")
  ) {
    return "containers-lids";
  }
  return "bags-rolls";
}

export type ReviewProductEntry = {
  slug: string;
  label: string;
  reviews: DisplayReview[];
  reviewCount: number;
};

export type ReviewCatalog = {
  general: DisplayReview[];
  videos: DisplayReview[];
  bySection: Map<ReviewSectionId, ReviewProductEntry[]>;
  totalReviewCount: number;
};

function labelForSlug(slug: string, nameBySlug: Map<string, string>): string {
  const fixed = VACUUM_MACHINE_REVIEW_ORDER.find((p) => p.slug === slug);
  if (fixed) return fixed.label;
  return nameBySlug.get(slug) ?? slug.replace(/-/g, " ");
}

export function buildReviewCatalog(
  data: {
    general: DisplayReview[];
    byProduct: Map<string, DisplayReview[]>;
    videos: DisplayReview[];
  },
  nameBySlug: Map<string, string>
): ReviewCatalog {
  const bySection = new Map<ReviewSectionId, ReviewProductEntry[]>();

  for (const section of REVIEW_SECTIONS) {
    if (section.id === "general" || section.id === "videos") continue;
    bySection.set(section.id, []);
  }

  for (const [slug, reviews] of data.byProduct.entries()) {
    if (reviews.length === 0) continue;
    const sectionId = inferReviewSectionForSlug(slug);
    if (sectionId === "general" || sectionId === "videos") continue;
    const list = bySection.get(sectionId) ?? [];
    list.push({
      slug,
      label: labelForSlug(slug, nameBySlug),
      reviews,
      reviewCount: reviews.length,
    });
    bySection.set(sectionId, list);
  }

  for (const section of REVIEW_SECTIONS) {
    if (!section.productOrder || section.id === "general" || section.id === "videos") continue;
    const list = bySection.get(section.id) ?? [];
    const bySlug = new Map(list.map((e) => [e.slug, e]));
    const ordered: ReviewProductEntry[] = [];
    for (const product of section.productOrder) {
      const entry = bySlug.get(product.slug);
      if (entry) ordered.push({ ...entry, label: product.label });
    }
    for (const entry of list) {
      if (!section.productOrder.some((p) => p.slug === entry.slug)) {
        ordered.push(entry);
      }
    }
    bySection.set(section.id, ordered);
  }

  for (const [sectionId, list] of bySection.entries()) {
    if (sectionId !== "vacuum-machines") {
      list.sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  const productTotal = Array.from(data.byProduct.values()).reduce((n, list) => n + list.length, 0);
  const totalReviewCount = data.general.length + productTotal + data.videos.length;

  return {
    general: data.general,
    videos: data.videos,
    bySection,
    totalReviewCount,
  };
}

export function resolveDefaultSection(catalog: ReviewCatalog): ReviewSectionId {
  if (catalog.general.length > 0) return "general";
  for (const section of REVIEW_SECTIONS) {
    if (section.id === "general" || section.id === "videos") continue;
    const list = catalog.bySection.get(section.id) ?? [];
    if (list.length > 0) return section.id;
  }
  if (catalog.videos.length > 0) return "videos";
  return "general";
}

export function sectionReviewCount(catalog: ReviewCatalog, sectionId: ReviewSectionId): number {
  if (sectionId === "general") return catalog.general.length;
  if (sectionId === "videos") return catalog.videos.length;
  return (catalog.bySection.get(sectionId) ?? []).reduce((n, p) => n + p.reviewCount, 0);
}

export function reviewsHref(section: ReviewSectionId, product?: string): string {
  const params = new URLSearchParams({ section });
  if (product) params.set("product", product);
  return `/reviews?${params.toString()}`;
}
