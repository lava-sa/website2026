export type CmsStat = { value: string; label: string };

export type CmsBlock = {
  id: string;
  overline?: string;
  heading: string;
  bodyHtml: string;
};

export type CmsImage = {
  src: string;
  alt: string;
  captionLocation?: string;
  captionTitle?: string;
  captionSubtitle?: string;
};

export type CmsQuote = {
  text: string;
  attribution: string;
};

export type CmsTimelineItem = {
  year: string;
  event: string;
  highlight?: boolean;
  highlightLabel?: string;
};

export type CmsPillarItem = {
  icon: "award" | "shield" | "wrench" | "leaf";
  title: string;
  body: string;
};

export type CmsSplitSection = {
  id: string;
  overline: string;
  heading: string;
  bodyHtml: string;
  image?: CmsImage;
  imageSide?: "left" | "right";
};

/** Structured sections for /about — images + all major content blocks */
export type AboutPageContent = {
  heroImage: CmsImage;
  origin: CmsSplitSection & { quote: CmsQuote };
  timeline: {
    overline: string;
    heading: string;
    items: CmsTimelineItem[];
  };
  saFounders: CmsSplitSection;
  pillars: {
    overline: string;
    heading: string;
    subtitle: string;
    items: CmsPillarItem[];
  };
  quality: CmsSplitSection & { features: string[] };
  sustainability: CmsSplitSection & { impactStats: CmsStat[] };
  service: {
    overline: string;
    heading: string;
    subtitle: string;
  };
  finalCta: {
    overline: string;
    headingHtml: string;
    subtitle: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export type SitePageContent = {
  seo: { title: string; description: string };
  hero: {
    overline?: string;
    heading?: string;
    headingEmphasis?: string;
    subtitle?: string;
  };
  ctas?: {
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  stats?: CmsStat[];
  blocks?: CmsBlock[];
  /** Full-page HTML for simple content pages */
  bodyHtml?: string;
  /** Blog listing card + SEO */
  excerpt?: string;
  category?: string;
  trustBadge?: { title?: string; subtitle?: string };
  /** Full About page sections (images, timeline, pillars, etc.) */
  aboutPage?: AboutPageContent;
};

export type SitePageGroup =
  | "Marketing"
  | "About"
  | "Blog"
  | "Help"
  | "Legal"
  | "Applications"
  | "Guides"
  | "Vacuum Packaging";

export type SitePageField =
  | "seo"
  | "hero"
  | "stats"
  | "ctas"
  | "blocks"
  | "bodyHtml"
  | "excerpt"
  | "trustBadge"
  | "aboutPage";

export type SitePageRegistryEntry = {
  slug: string;
  title: string;
  path: string;
  group: SitePageGroup;
  fields: SitePageField[];
};
