export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  imageBg?: string;
  videoId?: string;
  tags?: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  // ── Brand & Story ──────────────────────────────────────────────────────────
  {
    slug: "lava-family-business-germany-south-africa",
    title: "A Family Business from Baden-Württemberg — 40 Years of Precision, Now in South Africa",
    excerpt: "The Landig family have been building vacuum sealers in southern Germany since 1982. Here's how their obsession with quality found a home in South Africa.",
    category: "Our Story",
    date: "2026-04-01",
    readTime: "5 min read",
    image: "/images/blog/lava-0003.jpg",
    videoId: "yn-qpoAtbVI",
    tags: ["brand", "germany", "history", "quality"],
    featured: true,
  },
  {
    slug: "you-can-rely-on-our-quality",
    title: "You Can Rely on Our Quality — Why LAVA Machines Are Built to Last a Lifetime",
    excerpt: "Cheap vacuum sealers fail within a year. LAVA machines are still sealing perfectly after 20 years. Here's what genuine German engineering looks like on the inside.",
    category: "Quality",
    date: "2026-04-02",
    readTime: "4 min read",
    image: "/images/blog/lava-0008.jpg",
    videoId: "WFt1dapyhvk",
    tags: ["quality", "german engineering", "durability"],
    featured: true,
  },
  {
    slug: "embracing-sustainability-lava-quality",
    title: "Embracing Sustainability — How LAVA's Longevity Reduces Waste",
    excerpt: "A machine that lasts 20 years is the most sustainable machine you can buy. How LAVA's build quality aligns with a reduced-waste lifestyle.",
    category: "Sustainability",
    date: "2026-04-03",
    readTime: "4 min read",
    image: "/images/blog/lava-0002.jpg",
    tags: ["sustainability", "environment", "food waste"],
    featured: true,
  },
  {
    slug: "planting-roots-sustainable-tomorrow",
    title: "Planting Roots for a Sustainable Tomorrow — LAVA's Reforestation Commitment",
    excerpt: "Every LAVA machine sold contributes to global reforestation. How a family business in Baden-Württemberg is helping plant the future.",
    category: "Sustainability",
    date: "2026-04-04",
    readTime: "3 min read",
    image: "/images/about/lava-reforestation.webp",
    tags: ["sustainability", "reforestation", "environment"],
    featured: false,
  },

  // ── South African How-To ───────────────────────────────────────────────────
  {
    slug: "how-long-does-vacuum-sealed-food-last",
    title: "How Long Does Vacuum Sealed Food Last? The Complete South African Guide",
    excerpt: "From venison in the deep freeze to snoek in the fridge — exact shelf life figures for every food type South Africans store, with and without vacuum sealing.",
    category: "Food Guide",
    date: "2026-04-05",
    readTime: "7 min read",
    image: "/images/blog/header-006.jpg",
    videoId: "yn-qpoAtbVI",
    tags: ["shelf life", "food storage", "freezer", "guide"],
    featured: true,
  },
  {
    slug: "vacuum-sealing-game-meat-south-africa",
    title: "The Hunter's Guide to Vacuum Sealing Game Meat in South Africa",
    excerpt: "Blesbok, kudu, impala, warthog — how to process, portion and vacuum seal wild game properly so nothing goes to waste after the hunt.",
    category: "Hunting & Game",
    date: "2026-04-06",
    readTime: "6 min read",
    image: "/images/blog/header-001.jpg",
    videoId: "yaf_L7C6N6U",
    tags: ["hunting", "game meat", "venison", "south africa"],
    featured: true,
  },
  {
    slug: "how-to-vacuum-seal-biltong",
    title: "How to Vacuum Seal Biltong — Keep It Dry, Tender and Perfectly Preserved",
    excerpt: "Biltong and vacuum sealing seem like opposites. Here's the correct technique to seal biltong without ruining the texture — wet, dry and sliced.",
    category: "South African Food",
    date: "2026-04-07",
    readTime: "5 min read",
    image: "/images/blog/header-001.jpg",
    videoId: "yaf_L7C6N6U",
    tags: ["biltong", "south africa", "dry meat", "how-to"],
    featured: false,
  },
  {
    slug: "vacuum-sealing-fish-south-africa",
    title: "How to Vacuum Seal Fish After a Day on the Water",
    excerpt: "Snoek, yellowtail, cob, kingklip — how to handle, fillet, portion and vacuum seal fresh catch the right way so it tastes the same six months later.",
    category: "Fishing",
    date: "2026-04-08",
    readTime: "5 min read",
    image: "/images/blog/lava-0004.jpg",
    videoId: "XEdT5cCNiwk",
    tags: ["fishing", "fish", "seafood", "snoek", "yellowtail"],
    featured: false,
  },
  {
    slug: "dry-aging-beef-at-home-south-africa",
    title: "Dry Aging Beef at Home in South Africa — A Complete Guide",
    excerpt: "Dry-aged steak costs R400+ at a restaurant. With a LAVA vacuum sealer and your fridge, you can achieve the same results at home for a fraction of the price.",
    category: "Cooking",
    date: "2026-04-09",
    readTime: "8 min read",
    image: "/images/blog/lava-0008.jpg",
    videoId: "WFt1dapyhvk",
    tags: ["dry aging", "steak", "beef", "cooking", "technique"],
    featured: false,
  },
  {
    slug: "vacuum-sealing-during-load-shedding",
    title: "Vacuum Sealing & Load Shedding — How to Protect Your Food During Power Outages",
    excerpt: "Load shedding puts your freezer at risk. Vacuum sealed food survives power outages far better than loose food. Here's your complete load-shedding food strategy.",
    category: "South African Living",
    date: "2026-04-10",
    readTime: "5 min read",
    image: "/images/blog/header-006.jpg",
    videoId: "4Ut74sEOf1I",
    tags: ["load shedding", "power outage", "food safety", "south africa"],
    featured: true,
  },
  {
    slug: "best-vacuum-sealer-south-africa-2026",
    title: "Best Vacuum Sealer in South Africa 2026 — Honest Comparison Guide",
    excerpt: "What to look for, what to avoid, and which LAVA model fits your needs and budget. An honest guide from South Africa's official LAVA distributor.",
    category: "Buying Guide",
    date: "2026-04-11",
    readTime: "8 min read",
    image: "/images/blog/lava-0009.jpg",
    videoId: "4Ut74sEOf1I",
    tags: ["buying guide", "comparison", "best vacuum sealer", "2026"],
    featured: true,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}
