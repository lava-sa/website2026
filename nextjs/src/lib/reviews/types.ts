export type ReviewScope = "general" | "product";

export type ReviewAnswer = {
  question: string;
  answer: string;
};

export type DbReview = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  company: string | null;
  city: string | null;
  machine: string | null;
  product_slug: string | null;
  review_scope: ReviewScope | null;
  rating: number | null;
  headline: string | null;
  review: string | null;
  answers_json: ReviewAnswer[] | null;
  approved: boolean;
  review_type: "written" | "text" | "video" | null;
  video_url: string | null;
  featured: boolean | null;
};

/** Normalised review for public display (DB + static JSON). */
export type DisplayReview = {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  headline?: string;
  text?: string;
  answers?: ReviewAnswer[];
  videoUrl?: string;
  isVideo?: boolean;
  productLabel?: string;
  avatarUrl?: string;
  source: "db" | "static";
};

export type ReviewBlock = {
  average_rating: number;
  total_reviews: number;
  reviews: DisplayReview[];
};

export type ProductLinkOption = {
  slug: string;
  name: string;
  category: string;
};

export const GENERAL_REVIEW_PRODUCT_LABEL = "General — service & support only";

export type ReviewProductOption = {
  label: string;
  slug: string | null;
  scope: ReviewScope;
  categoryLabel: string;
};

/** All product/machine options for the general review form (homepage + /submit-review). */
export const GENERAL_REVIEW_PRODUCT_OPTIONS: ReviewProductOption[] = [
  { label: GENERAL_REVIEW_PRODUCT_LABEL, slug: null, scope: "general", categoryLabel: "General" },
  { label: "LAVA V.100 Premium", slug: "v100-premium", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.100 Premium X", slug: "v100-premium-x", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.300 Premium X", slug: "v300-premium-x", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.300 Premium Black", slug: "v300-black", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.300 Premium White", slug: "v300-white", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.333 Chrome", slug: "v333-chrome", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.400 Premium", slug: "v400-premium", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.500 Premium (72 cm)", slug: "v500-premium", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "LAVA V.500 Premium XXL (121 cm)", slug: "v500-premium-xxl", scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "Older / different LAVA machine", slug: null, scope: "product", categoryLabel: "Vacuum Machines" },
  { label: "Embossed vacuum bags (pre-cut)", slug: null, scope: "product", categoryLabel: "Vacuum Bags & Rolls" },
  { label: "Embossed vacuum rolls", slug: null, scope: "product", categoryLabel: "Vacuum Bags & Rolls" },
  { label: "Smooth / chamber pouches", slug: null, scope: "product", categoryLabel: "Vacuum Bags & Rolls" },
  { label: "LAVA Fresh boxes / ES stainless containers", slug: null, scope: "product", categoryLabel: "Vacuum Containers & Lids" },
  { label: "LAVA glass containers (G-Line)", slug: null, scope: "product", categoryLabel: "Vacuum Containers & Lids" },
  { label: "Universal acrylic lids", slug: null, scope: "product", categoryLabel: "Vacuum Containers & Lids" },
  { label: "Glass jar sealer / Easy Pump", slug: "vacuum-sealer-attachment-for-glass-jars-8-9-cm-diameter", scope: "product", categoryLabel: "Vacuum Containers & Lids" },
  { label: "Sous vide accessories", slug: null, scope: "product", categoryLabel: "Vacuum Containers & Lids" },
  { label: "Other LAVA product", slug: null, scope: "product", categoryLabel: "Other" },
];

export function resolveReviewProductOption(label: string): ReviewProductOption {
  return (
    GENERAL_REVIEW_PRODUCT_OPTIONS.find((o) => o.label === label) ?? {
      label,
      slug: null,
      scope: "product",
      categoryLabel: "Other",
    }
  );
}

export function reviewProductField(categoryLabel: string, product: string): string {
  if (product === GENERAL_REVIEW_PRODUCT_LABEL) return "[General] Service & Support";
  return `[${categoryLabel}] ${product}`;
}
