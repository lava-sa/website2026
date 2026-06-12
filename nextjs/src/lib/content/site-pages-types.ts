export type CmsStat = { value: string; label: string };

export type CmsBlock = {
  id: string;
  overline?: string;
  heading: string;
  bodyHtml: string;
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
  | "trustBadge";

export type SitePageRegistryEntry = {
  slug: string;
  title: string;
  path: string;
  group: SitePageGroup;
  fields: SitePageField[];
};
