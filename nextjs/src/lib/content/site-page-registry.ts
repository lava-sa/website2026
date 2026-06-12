import { blogPosts } from "@/lib/blog-posts";
import type { SitePageField, SitePageGroup, SitePageRegistryEntry } from "@/lib/content/site-pages-types";

const CORE: SitePageRegistryEntry[] = [
  {
    slug: "home",
    title: "Homepage",
    path: "/",
    group: "Marketing",
    fields: ["seo", "hero", "stats", "ctas", "trustBadge"],
  },
  {
    slug: "about",
    title: "About Lava-SA",
    path: "/about",
    group: "Marketing",
    fields: ["seo", "hero", "stats", "blocks"],
  },
  {
    slug: "contact",
    title: "Contact",
    path: "/contact",
    group: "Marketing",
    fields: ["seo", "hero", "blocks"],
  },
  {
    slug: "blog-index",
    title: "Blog index",
    path: "/blog",
    group: "Marketing",
    fields: ["seo", "hero", "blocks"],
  },
  {
    slug: "rewards",
    title: "LAVA Points / Rewards",
    path: "/rewards",
    group: "Marketing",
    fields: ["seo", "hero", "bodyHtml"],
  },
  {
    slug: "lava-tv",
    title: "LAVA TV",
    path: "/lava-tv",
    group: "Marketing",
    fields: ["seo", "hero", "bodyHtml"],
  },
];

const ABOUT_SUB: SitePageRegistryEntry[] = [
  ["about-sustainable-sealing", "Sustainable Sealing", "/about/sustainable-sealing"],
  ["about-green-mission", "Green Mission", "/about/green-mission"],
  ["about-lasting-quality", "Lasting Quality", "/about/lasting-quality"],
].map(([slug, title, path]) => ({
  slug,
  title,
  path,
  group: "About" as SitePageGroup,
  fields: ["seo", "hero", "bodyHtml"] as SitePageField[],
}));

const HELP: SitePageRegistryEntry[] = [
  ["help", "Help centre", "/help"],
  ["help-faq", "FAQ", "/help/faq"],
  ["help-delivery", "Delivery", "/help/delivery"],
  ["help-warranty", "Warranty", "/help/warranty"],
].map(([slug, title, path]) => ({
  slug,
  title,
  path,
  group: "Help" as SitePageGroup,
  fields: ["seo", "hero", "bodyHtml"] as SitePageField[],
}));

const LEGAL: SitePageRegistryEntry[] = [
  ["legal-terms", "Terms & Guarantee", "/legal/terms"],
  ["legal-privacy", "Privacy Policy", "/legal/privacy"],
  ["legal-conditions", "Conditions of Sale", "/legal/conditions"],
  ["legal-shipping-returns", "Shipping & Returns", "/legal/shipping-returns"],
].map(([slug, title, path]) => ({
  slug,
  title,
  path,
  group: "Legal" as SitePageGroup,
  fields: ["seo", "hero", "bodyHtml"] as SitePageField[],
}));

const APPLICATIONS: SitePageRegistryEntry[] = [
  ["applications", "Applications hub", "/applications"],
  ["applications-butchery", "Butchery", "/applications/butchery"],
  ["applications-catering", "Catering", "/applications/catering"],
  ["applications-food-production", "Food production", "/applications/food-production"],
  ["applications-kitchen", "Home kitchen", "/applications/kitchen"],
  ["applications-biltong", "Biltong", "/applications/biltong"],
  ["applications-hunter-game", "Hunter & game", "/applications/hunter-game"],
  ["applications-angler-fishing", "Angler & fishing", "/applications/angler-fishing"],
].map(([slug, title, path]) => ({
  slug,
  title,
  path,
  group: "Applications" as SitePageGroup,
  fields: ["seo", "hero", "bodyHtml"] as SitePageField[],
}));

const GUIDES: SitePageRegistryEntry[] = [
  ["guides", "Guides hub", "/guides"],
  ["guides-how-to-vacuum-seal", "How to vacuum seal", "/guides/how-to-vacuum-seal"],
  [
    "guides-vacuum-sealing-applications",
    "Vacuum sealing applications",
    "/guides/vacuum-sealing-applications",
  ],
  [
    "guides-food-preservation-reducing-waste",
    "Food preservation & waste",
    "/guides/food-preservation-reducing-waste",
  ],
].map(([slug, title, path]) => ({
  slug,
  title,
  path,
  group: "Guides" as SitePageGroup,
  fields: ["seo", "hero", "bodyHtml"] as SitePageField[],
}));

const VACUUM_PACKAGING: SitePageRegistryEntry[] = [
  ["vacuum-packaging", "Vacuum packaging hub", "/vacuum-packaging"],
  ["vacuum-packaging-advantages", "Advantages", "/vacuum-packaging/advantages"],
  ["vacuum-packaging-shelf-life-chart", "Shelf life chart", "/vacuum-packaging/shelf-life-chart"],
  ["vacuum-packaging-dry-aging", "Dry aging", "/vacuum-packaging/dry-aging"],
  ["vacuum-packaging-meat-aging", "Meat aging", "/vacuum-packaging/meat-aging"],
  ["vacuum-packaging-expert-tips", "Expert tips", "/vacuum-packaging/expert-tips"],
  ["vacuum-packaging-bags-guide", "Bags guide", "/vacuum-packaging/bags-guide"],
  ["vacuum-packaging-gift-ideas", "Gift ideas", "/vacuum-packaging/gift-ideas"],
].map(([slug, title, path]) => ({
  slug,
  title,
  path,
  group: "Vacuum Packaging" as SitePageGroup,
  fields: ["seo", "hero", "bodyHtml"] as SitePageField[],
}));

const BLOG: SitePageRegistryEntry[] = blogPosts.map((post) => ({
  slug: `blog-${post.slug}`,
  title: post.title,
  path: `/blog/${post.slug}`,
  group: "Blog" as SitePageGroup,
  fields: ["seo", "hero", "excerpt", "bodyHtml"] as SitePageField[],
}));

export const SITE_PAGE_REGISTRY: SitePageRegistryEntry[] = [
  ...CORE,
  ...ABOUT_SUB,
  ...BLOG,
  ...HELP,
  ...LEGAL,
  ...APPLICATIONS,
  ...GUIDES,
  ...VACUUM_PACKAGING,
];

export function getRegistryEntry(slug: string): SitePageRegistryEntry | undefined {
  return SITE_PAGE_REGISTRY.find((e) => e.slug === slug);
}

export function isValidSitePageSlug(slug: string): boolean {
  return SITE_PAGE_REGISTRY.some((e) => e.slug === slug);
}

export const SITE_PAGE_GROUPS: SitePageGroup[] = [
  "Marketing",
  "About",
  "Blog",
  "Help",
  "Legal",
  "Applications",
  "Guides",
  "Vacuum Packaging",
];
