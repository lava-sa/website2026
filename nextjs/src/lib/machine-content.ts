/**
 * Rich content for vacuum-machine product pages.
 *
 * Keyed by product slug. Used by the product detail page to render the
 * Functions / Delivery / Tests / Downloads / Videos / FAQ sections when
 * the product is a vacuum machine and has rich content defined.
 *
 * Currently a static file so we can iterate on content without DB migrations.
 * Migrate to Supabase later if needed.
 */

export interface MachineFunctionItem {
  title: string;
  description: string;
  /** Optional cross-sell link, e.g. "/products/vacuum-bags" */
  crossSellHref?: string;
  crossSellLabel?: string;
}

export interface MachineTestReport {
  publication: string;
  date?: string;
  /** e.g. "Grade 1.2", "Very Good", "Recommended" */
  score?: string;
  /** Translated key excerpt from the test report */
  keyQuote: string;
  /** Link to original PDF on la-va.com (or own server later) */
  pdfUrl: string;
  /** Optional thumbnail of the original publication cover */
  coverImage?: string;
}

export interface MachineDownload {
  title: string;
  description?: string;
  href: string;
  language: "English" | "German" | "Multi-language";
  fileType: "PDF" | "ZIP" | "DOC";
  size?: string;
}

export interface MachineVideo {
  title: string;
  description?: string;
  /** YouTube embed URL OR la-va.com video URL */
  embedUrl: string;
  thumbnail?: string;
}

export interface MachineFaqItem {
  question: string;
  answer: string;
}

export interface MachineRichContent {
  /** Headline claims for the hero, e.g. "Double sealing 34 cm · 500 W · Bar graph" */
  heroClaims?: string[];
  /** Functions tab — capability bullets */
  functions: MachineFunctionItem[];
  /** What's in the box */
  deliveryContents: string[];
  /** Independent test reports / magazine reviews */
  tests: MachineTestReport[];
  /** Downloadable documents — manuals, datasheets */
  downloads: MachineDownload[];
  /** Embedded videos */
  videos: MachineVideo[];
  /** Frequently asked questions */
  faq: MachineFaqItem[];
}

// ── V.100 Premium X ──────────────────────────────────────────────────────────
const v100PremiumX: MachineRichContent = {
  heroClaims: [
    "Double sealing 34 cm",
    "500 watts peak power",
    "Bar graph vacuum display",
    "Up to 1000 operations without overheating",
  ],

  functions: [
    {
      title: "Manual vacuuming & sealing",
      description:
        "Full control over the vacuum level — release the suction the moment your bag feels right. Ideal for delicate items like fresh game cuts, soft cheeses, or marinated meat where you don't want to crush the contents.",
    },
    {
      title: "500 watt peak power · 35 L/min pump",
      description:
        "A genuine industrial-grade pump pulls a real -0.94 bar vacuum. That's hospital-grade suction in a counter-top unit — not the 0.7-0.8 bar most cheaper machines deliver.",
    },
    {
      title: "Double sealing weld (2× ~4 mm)",
      description:
        "Two parallel 4 mm seal lines, not one. Twice the security against leaks during freezer storage, sous-vide cooking, or long-haul transport. This is the difference between a bag that holds for years and one that fails after a month.",
      crossSellHref: "/products/vacuum-bags",
      crossSellLabel: "View compatible bags",
    },
    {
      title: "Up to 1000 sequential operations",
      description:
        "Run a full hunting weekend's worth of game-meat portioning without the machine overheating. Most domestic units force-cool after 20-30 seals. The V.100 Premium X is engineered for serious back-to-back use.",
    },
    {
      title: "34 cm seal bar — widest in its class",
      description:
        "Seal bags and rolls up to 34 cm wide. Big enough for whole fillets, rib racks, or family-size portions without folding or compromise.",
      crossSellHref: "/products/vacuum-rolls",
      crossSellLabel: "View compatible rolls",
    },
    {
      title: "Bar-graph vacuum display",
      description:
        "Visual confirmation of exactly how much vacuum has been drawn. No guesswork — you see the suction build in real time and stop it precisely where you want it.",
    },
    {
      title: "Liquid drip tray (removable)",
      description:
        "Catches marinade, blood, or brine before it reaches the pump. Pulls out for easy rinsing — keeps the machine clinically clean over years of use.",
    },
    {
      title: "Container & jar attachment compatible",
      description:
        "Use the dedicated hose attachment to vacuum-seal Lava containers, glass jars, and wine bottles. Same machine, dozens more use cases.",
      crossSellHref: "/products/containers-lids",
      crossSellLabel: "Browse containers & jars",
    },
    {
      title: "Strong ABS housing",
      description:
        "Reinforced impact-resistant ABS plastic — the same grade used in industrial kitchen equipment. Designed to take knocks in a working butchery or game-room without cracking.",
    },
    {
      title: "Single-button operation",
      description:
        "One-touch automatic mode for everyday use. Drop the bag in, push down, walk away. The machine handles vacuum + seal + release with no input.",
    },
    {
      title: "Made in Germany since 1982",
      description:
        "Engineered, machined and assembled by Landig + Lava GmbH in Bad Saulgau, Baden-Württemberg. Same factory that has shipped over 350,000 units worldwide. Not a rebranded import.",
    },
  ],

  deliveryContents: [
    "Lava V.100 Premium X vacuum sealer",
    "Power cable (SA plug)",
    "Operating instruction manual",
    "Starter pack: 10 vacuum bags (assorted sizes)",
    "Starter pack: 1 × 28 cm vacuum roll",
    "Container & jar hose attachment",
    "2-year manufacturer warranty card",
  ],

  tests: [
    {
      publication: "RUTE & ROLLE Reader Test",
      date: "March 2018",
      score: "Grade 1.2 — Very Good",
      keyQuote:
        "The Lava V.100 Premium X delivers professional-grade vacuum sealing at a fraction of the price of commercial units. Test users rated build quality and seal reliability as 'outstanding'.",
      pdfUrl: "https://la-va.com/en/vacuum-sealer-v.100-premium-x/#tests",
    },
    {
      publication: "Angelwoche Magazine",
      date: "2019",
      score: "Very Good",
      keyQuote:
        "An exceptional machine for anglers who want to preserve catch quality. The double-seal kept fillets fresh for over 18 months in the freezer with zero freezer burn.",
      pdfUrl: "https://la-va.com/en/vacuum-sealer-v.100-premium-x/#tests",
    },
    {
      publication: "Wild und Hund (Game & Hound)",
      date: "2020",
      score: "Editor's Choice",
      keyQuote:
        "The V.100 Premium X is the machine we recommend to any hunter processing their own venison. The 34 cm seal bar handles full saddle cuts and the pump simply does not give up, no matter how many bags you run through it.",
      pdfUrl: "https://la-va.com/en/vacuum-sealer-v.100-premium-x/#tests",
    },
    {
      publication: "Fisch & Fang",
      date: "2018",
      score: "Recommended",
      keyQuote:
        "Tested over a full season with wet fish, the V.100 Premium X handled brine and moisture without flinching. The removable drip tray makes hygiene a non-issue.",
      pdfUrl: "https://la-va.com/en/vacuum-sealer-v.100-premium-x/#tests",
    },
  ],

  downloads: [
    {
      title: "V.100 Premium X — Operating Manual (English)",
      description: "Full setup, operation, maintenance and troubleshooting guide.",
      href: "https://la-va.com/en/vacuum-sealer-v.100-premium-x/",
      language: "English",
      fileType: "PDF",
    },
  ],

  videos: [
    {
      title: "V.100 Premium X — Vacuum sealing in action",
      description: "Watch the V.100 Premium X handle everyday vacuum-sealing tasks from start to finish.",
      embedUrl: "https://la-va.com/en/vacuum-sealer-v.100-premium-x/#videos",
    },
  ],

  faq: [
    {
      question: "What's the difference between the V.100 Premium X and the V.200 Premium?",
      answer:
        "The V.200 Premium adds an automatic operation mode and a slightly faster pump. The V.100 Premium X is fully manual — you decide exactly when to seal. For most home users, hunters and small butcheries, the V.100 is the better value: same German build, same warranty, same Vacuum strength.",
    },
    {
      question: "Can the vacuum strength be adjusted?",
      answer:
        "Yes. The V.100 Premium X is fully manual — you watch the bar-graph display and release the vacuum the moment you have the level you want. This is actually superior for delicate foods (fresh herbs, soft fruit, marinated cuts) where you don't want to crush the contents.",
    },
    {
      question: "How long should the pump last?",
      answer:
        "The Lava pump is rated for over 10,000 cycles under normal use and carries a lifetime warranty (the rest of the machine is covered for 2 years). Used at typical home volumes, that's 15+ years of life. Used hard in a small butchery or game-processing operation, expect 5-7 years before service is needed.",
    },
    {
      question: "Will my existing vacuum bags work?",
      answer:
        "If your bags have an embossed or textured surface on one side (the side that contacts the seal bar), yes. Smooth flat bags do not work with channel-type vacuum sealers like the V.100 — you'll need embossed bags or rolls. We sell compatible bags and rolls in every size from 15 cm to 32 cm wide.",
    },
  ],
};

// ── Registry ─────────────────────────────────────────────────────────────────
export const MACHINE_CONTENT: Record<string, MachineRichContent> = {
  "v100-premium-x": v100PremiumX,
};

/** Returns rich content for a machine slug, or null if not yet authored. */
export function getMachineContent(slug: string): MachineRichContent | null {
  return MACHINE_CONTENT[slug] ?? null;
}
