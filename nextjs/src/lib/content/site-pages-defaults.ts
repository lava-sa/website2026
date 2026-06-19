import { blogPosts } from "@/lib/blog-posts";
import { DEFAULT_ABOUT_PAGE } from "@/lib/content/about-page-defaults";
import { getRegistryEntry, SITE_PAGE_REGISTRY } from "@/lib/content/site-page-registry";
import type { SitePageContent } from "@/lib/content/site-pages-types";

export const DEFAULT_HOME: SitePageContent = {
  seo: {
    title:
      "LAVA Vacuum Sealers South Africa | Premium German Food Preservation Since 2007 | Lava-SA",
    description:
      "LAVA vacuum sealers South Africa — German-engineered V.300 Premium X, bags, rolls & accessories. Nationwide courier delivery. Since 2007.",
  },
  hero: {
    overline: "Trusted by 350,000+ Customers Worldwide",
    heading: "Preserve food.",
    headingEmphasis: "Like a professional.",
    subtitle:
      "German-engineered vacuum sealers and accessories that chefs, hunters, and households rely on. For over 44 years, Lava has set the standard for precision food preservation.",
  },
  ctas: {
    primaryLabel: "Shop Vacuum Sealers",
    primaryHref: "/products/vacuum-machines",
    secondaryLabel: "Explore Applications",
    secondaryHref: "/applications",
  },
  stats: [
    { value: "40+", label: "Years German Engineering" },
    { value: "350k+", label: "Customers Worldwide" },
    { value: "Since '07", label: "Exclusive SA Distributor" },
  ],
  trustBadge: {
    title: "SA Distributor Since 2007",
    subtitle: "Exclusively authorised for South Africa",
  },
};

export const DEFAULT_ABOUT: SitePageContent = {
  seo: {
    title: "About Lava-SA — German Vacuum Sealers Since 2007",
    description:
      "Lava South Africa is the exclusive distributor of German-engineered LAVA vacuum sealers since 2007. Built on quality, sustainability and a passion for food preservation.",
  },
  hero: {
    overline: "Our Story",
    heading: "44 years of German",
    headingEmphasis: "obsession. Now South Africa's own.",
    subtitle:
      "We didn't invent vacuum sealing. We perfected it — in a family workshop in Baden-Württemberg, machine by machine, since 1982.",
  },
  stats: [
    { value: "1982", label: "LAVA founded in Germany" },
    { value: "2007", label: "SA distributor established" },
    { value: "44+", label: "Years of German engineering" },
    { value: "350k+", label: "Customers worldwide" },
  ],
  aboutPage: DEFAULT_ABOUT_PAGE,
};

export const DEFAULT_CONTACT: SitePageContent = {
  seo: {
    title: "Contact Lava-SA — Speak to Anneke",
    description:
      "Contact Lava-SA for vacuum sealer advice, orders, warranty and spare parts. Anneke answers personally — Mon–Fri, 08:00–15:30.",
  },
  hero: {
    overline: "We're Here to Help",
    heading: "We're always ready to help.",
    subtitle:
      "When you contact Lava-SA, Anneke answers personally — every call, every email, and every product enquiry.",
  },
  blocks: [
    {
      id: "form",
      overline: "Get in touch",
      heading: "Send Us a Message",
      bodyHtml:
        "<p>Fill in the form below and we'll get back to you within one business day.</p>",
    },
  ],
};

export const DEFAULT_BLOG_INDEX: SitePageContent = {
  seo: {
    title: "Lava Blog — Vacuum Sealing Guides, Tips & South African Food Stories",
    description:
      "Expert guides on vacuum sealing game meat, biltong, fish and everyday food. Tips for South African kitchens, hunters and fishermen.",
  },
  hero: {
    overline: "Knowledge Hub",
    heading: "Lava Blog",
    subtitle:
      "Guides for South African hunters, fishermen, home cooks and butchers — written by people who actually use vacuum sealers every day.",
  },
  blocks: [
    {
      id: "guides-cta",
      overline: "Deep Dives",
      heading: "Vacuum Packaging Guides",
      bodyHtml:
        "<p>From shelf life charts to dry aging technique — detailed guides for getting the most out of your LAVA system.</p>",
    },
  ],
};

function genericDefault(title: string, path: string): SitePageContent {
  return {
    seo: {
      title: `${title} | Lava-SA`,
      description: `${title} — Lava-SA, exclusive South African distributor of German LAVA vacuum sealers since 2007.`,
    },
    hero: {
      overline: "Lava-SA",
      heading: title,
      subtitle: "",
    },
    bodyHtml: "",
  };
}

function blogPostDefault(slug: string): SitePageContent | null {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return {
    seo: {
      title: post.title,
      description: post.excerpt,
    },
    hero: {
      overline: post.category,
      heading: post.title,
      subtitle: post.excerpt,
    },
    excerpt: post.excerpt,
    category: post.category,
    bodyHtml: "",
  };
}

export function getDefaultSitePageContent(slug: string): SitePageContent {
  switch (slug) {
    case "home":
      return structuredClone(DEFAULT_HOME);
    case "about":
      return structuredClone(DEFAULT_ABOUT);
    case "contact":
      return structuredClone(DEFAULT_CONTACT);
    case "blog-index":
      return structuredClone(DEFAULT_BLOG_INDEX);
    default:
      break;
  }

  if (slug.startsWith("blog-")) {
    const postSlug = slug.replace(/^blog-/, "");
    const blog = blogPostDefault(postSlug);
    if (blog) return structuredClone(blog);
  }

  const entry = getRegistryEntry(slug);
  if (entry) {
    return genericDefault(entry.title, entry.path);
  }

  return genericDefault(slug, "/");
}

export function getAllSitePageSlugs(): string[] {
  return SITE_PAGE_REGISTRY.map((e) => e.slug);
}
