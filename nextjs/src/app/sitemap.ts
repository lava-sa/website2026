import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/about",
  "/contact",
  "/v300-premium-x",
  "/lp/v300-premium-x",
  "/blog",
  "/lava-tv",
  "/applications",
  "/applications/angler-fishing",
  "/applications/biltong",
  "/applications/butchery",
  "/applications/catering",
  "/applications/food-production",
  "/applications/hunter-game",
  "/applications/kitchen",
  "/products",
  "/products/vacuum-machines",
  "/products/vacuum-bags",
  "/products/vacuum-rolls",
  "/products/bags-rolls",
  "/products/containers-lids",
  "/products/acrylic-lids",
  "/products/butchery-accessories",
  "/products/knives",
  "/products/scales",
  "/products/hooks-gambrels",
  "/products/sous-vide",
  "/products/spare-parts",
  "/products/vacuum-seals",
  "/products/sealing-strips",
  "/products/liquid-trap-lids",
  "/products/protective-gear",
  "/products/accessories",
  "/rewards",
  "/submit-review",
  "/help/faq",
  "/help/delivery",
  "/help/returns",
  "/help/warranty",
  "/legal/terms",
  "/legal/privacy",
  "/legal/conditions",
  "/legal/shipping-returns",
  "/blog/best-vacuum-sealer-south-africa-2026",
  "/blog/embracing-sustainability-lava-quality",
  "/blog/how-long-does-vacuum-sealed-food-last",
  "/blog/how-to-vacuum-seal-biltong",
  "/blog/lava-family-business-germany-south-africa",
  "/blog/planting-roots-sustainable-tomorrow",
  "/blog/vacuum-sealing-during-load-shedding",
  "/blog/vacuum-sealing-fish-south-africa",
  "/blog/vacuum-sealing-game-meat-south-africa",
  "/blog/you-can-rely-on-our-quality",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.startsWith("/products/") ? 0.8 : 0.6,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllProductSlugs();
    productEntries = slugs.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch {
    // Supabase unavailable — skip dynamic product URLs
  }

  return [...staticEntries, ...productEntries];
}
