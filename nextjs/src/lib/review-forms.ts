export type ReviewFormVariant = "machines" | "bags-rolls" | "containers";

export type ReviewQuestion = {
  id: string;
  label: string;
  placeholder: string;
  hint?: string;
  minLength?: number;
  rows?: number;
};

export type ReviewFormConfig = {
  variant: ReviewFormVariant;
  categoryLabel: string;
  pageTitle: string;
  pageDescription: string;
  heroSubtitle: string;
  productLabel: string;
  productOptions: string[];
  questions: ReviewQuestion[];
  videoPrompts: string[];
  successLink: string;
  successLinkLabel: string;
};

export const REVIEW_FORM_CONFIGS: Record<ReviewFormVariant, ReviewFormConfig> = {
  machines: {
    variant: "machines",
    categoryLabel: "Vacuum Machines",
    pageTitle: "Review Your LAVA Vacuum Machine",
    pageDescription:
      "Share a detailed review of your LAVA vacuum sealer. Specific answers help other buyers — and help Google and AI search understand real-world results.",
    heroSubtitle:
      "Tell us how your machine performs in the real world. Detailed, specific reviews help hunters, butchers, and home cooks choose with confidence.",
    productLabel: "Which LAVA vacuum machine do you own?",
    productOptions: [
      "LAVA V.100 Premium",
      "LAVA V.100 Premium X",
      "LAVA V.300 Premium X",
      "LAVA V.300 Premium Black",
      "LAVA V.300 Premium White",
      "LAVA V.333 Chrome",
      "LAVA V.400 Premium",
      "LAVA V.500 Premium (72 cm)",
      "LAVA V.500 Premium XXL (121 cm)",
      "Older / different LAVA model",
    ],
    questions: [
      {
        id: "ownership_duration",
        label: "How long have you had your LAVA machine?",
        placeholder:
          "e.g. Since March 2019 — about six years of daily use in our butchery.",
        hint: "Approximate date or years owned is fine — be specific.",
        minLength: 10,
        rows: 2,
      },
      {
        id: "business_impact",
        label: "How has your LAVA machine streamlined your business or daily routine?",
        placeholder:
          "Describe what you vacuum, how often, time saved, waste reduced, or how it changed your workflow…",
        hint: "Think: before vs after LAVA, volume, consistency, or peace of mind.",
        minLength: 40,
        rows: 4,
      },
      {
        id: "build_quality",
        label: "How do you find the quality and build of the machine?",
        placeholder:
          "Describe the materials, seals, pump performance, durability, and anything that stood out after months of use…",
        minLength: 40,
        rows: 4,
      },
      {
        id: "daily_operation",
        label: "Describe your day-to-day experience operating the machine",
        placeholder:
          "What do you seal most often? Which modes or features do you use? How intuitive is it for you or your staff in practice?",
        hint: "Please explain in your own words — not just yes or no.",
        minLength: 40,
        rows: 4,
      },
      {
        id: "service_support",
        label: "What service and support have you received from Anneke and the team at Lava-SA?",
        placeholder:
          "Delivery, setup advice, spare parts, WhatsApp support, warranty — tell us what happened and how the team helped…",
        minLength: 30,
        rows: 4,
      },
    ],
    videoPrompts: [
      "Introduce yourself — name, town, and which LAVA machine you own (and how long)",
      "Explain how the machine streamlined your business or kitchen routine — be specific",
      "Describe the build quality and reliability you have seen over time",
      "Show or explain how you use it day to day — what you seal and how easy it is",
      "Share your experience with Anneke and the Lava-SA team",
    ],
    successLink: "/products/vacuum-machines",
    successLinkLabel: "Browse vacuum machines",
  },

  "bags-rolls": {
    variant: "bags-rolls",
    categoryLabel: "Vacuum Bags & Rolls",
    pageTitle: "Review Your LAVA Bags or Rolls",
    pageDescription:
      "Share your experience with LAVA embossed bags and rolls — seal strength, clarity, freezer performance, and value.",
    heroSubtitle:
      "Your detail helps other customers pick the right bag or roll size — and shows Google real-world results.",
    productLabel: "Which LAVA bags or rolls do you use?",
    productOptions: [
      "Embossed vacuum bags (pre-cut)",
      "Embossed vacuum rolls",
      "Smooth / chamber pouches",
      "Multiple sizes — I will specify below",
      "Other LAVA bags or rolls",
    ],
    questions: [
      {
        id: "usage_duration",
        label: "How long have you been using LAVA bags or rolls?",
        placeholder: "e.g. Over two years — we order monthly for our biltong production.",
        minLength: 10,
        rows: 2,
      },
      {
        id: "primary_use",
        label: "What do you mainly use them for?",
        placeholder:
          "Game meat, biltong, meal prep, sous-vide, commercial production — describe your typical use…",
        minLength: 30,
        rows: 3,
      },
      {
        id: "seal_performance",
        label: "How do the bags or rolls perform when sealing?",
        placeholder:
          "Seal strength, clarity, embossed texture, leak resistance, freezer or sous-vide results…",
        minLength: 40,
        rows: 4,
      },
      {
        id: "machine_fit",
        label: "How well do they work with your LAVA machine?",
        placeholder:
          "Which machine do you use, which sizes or roll widths, and how consistent are the results?",
        minLength: 30,
        rows: 3,
      },
      {
        id: "service_support",
        label: "What has your experience been with ordering and support from Lava-SA?",
        placeholder:
          "Delivery, sizing advice from Anneke, repeat orders, stock availability — tell us what stood out…",
        minLength: 30,
        rows: 4,
      },
    ],
    videoPrompts: [
      "Say which LAVA bags or rolls you use and for how long",
      "Show a sealed bag or roll and explain what you use it for",
      "Describe seal quality, clarity, and freezer or sous-vide results",
      "Mention which LAVA machine you use and how well the material feeds and seals",
      "Share any support or advice you received from Anneke and the team",
    ],
    successLink: "/products/bags-rolls",
    successLinkLabel: "Browse bags & rolls",
  },

  containers: {
    variant: "containers",
    categoryLabel: "Vacuum Containers & Lids",
    pageTitle: "Review Your LAVA Containers, Lids or Sous Vide Gear",
    pageDescription:
      "Review LAVA containers, acrylic lids, glass systems, jar sealers, or sous vide accessories — real detail helps other customers.",
    heroSubtitle:
      "Tell us how LAVA containers or sous vide products perform in your kitchen, deli, or production setup.",
    productLabel: "Which product are you reviewing?",
    productOptions: [
      "LAVA Fresh boxes / ES stainless containers",
      "LAVA glass containers (G-Line)",
      "Universal acrylic lids",
      "Glass jar sealer / Easy Pump",
      "Sous vide accessories",
      "Other LAVA containers or lids",
    ],
    questions: [
      {
        id: "usage_duration",
        label: "How long have you been using this product?",
        placeholder: "e.g. Eighteen months — we use the G-Line set daily in our prep kitchen.",
        minLength: 10,
        rows: 2,
      },
      {
        id: "primary_use",
        label: "What do you store or prepare with it?",
        placeholder:
          "Leftovers, meal prep, marinades, sous-vide portions, deli display — describe your typical use…",
        minLength: 30,
        rows: 3,
      },
      {
        id: "seal_performance",
        label: "How well does it hold vacuum and keep food fresh?",
        placeholder:
          "Seal duration, lid fit, fridge/freezer performance, clarity, durability after washing…",
        minLength: 40,
        rows: 4,
      },
      {
        id: "ease_of_use",
        label: "How easy is it to use with your LAVA machine or pump?",
        placeholder:
          "Attaching lids, hose connection, opening and closing, cleaning — explain your experience in practice.",
        minLength: 30,
        rows: 4,
      },
      {
        id: "service_support",
        label: "What service and support have you received from Anneke and the team at Lava-SA?",
        placeholder:
          "Sizing advice, which lid fits which container, orders, replacements — tell us what helped…",
        minLength: 30,
        rows: 4,
      },
    ],
    videoPrompts: [
      "Introduce yourself and which LAVA container, lid, or sous vide product you use",
      "Show what you store or prepare and how long you have used it",
      "Demonstrate the vacuum seal and explain how long food stays fresh",
      "Explain how easy it is to use with your machine or pump",
      "Share your experience with Anneke and the Lava-SA team",
    ],
    successLink: "/products/containers-lids",
    successLinkLabel: "Browse containers & lids",
  },
};

export function getReviewFormConfig(variant: ReviewFormVariant): ReviewFormConfig {
  return REVIEW_FORM_CONFIGS[variant];
}

export function emptyAnswers(questions: ReviewQuestion[]): Record<string, string> {
  return Object.fromEntries(questions.map((q) => [q.id, ""]));
}

export function compileStructuredReview(
  questions: ReviewQuestion[],
  answers: Record<string, string>
): string {
  return questions
    .map((q) => `${q.label}\n${answers[q.id]?.trim() ?? ""}`)
    .join("\n\n");
}

export function reviewProductField(categoryLabel: string, product: string): string {
  return `[${categoryLabel}] ${product}`;
}

/** PDP / category pages → correct review form URL */
export function reviewFormHrefForCategory(categorySlug?: string | null): string {
  switch (categorySlug) {
    case "vacuum-bags":
    case "vacuum-rolls":
      return "/submit-review/bags-rolls";
    case "containers-lids":
    case "sous-vide":
      return "/submit-review/containers";
    case "vacuum-machines":
    default:
      return "/submit-review";
  }
}
