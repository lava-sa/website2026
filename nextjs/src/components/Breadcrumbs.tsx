"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Breadcrumb mapping: pathname → [{ label, href }, ...]
// ─────────────────────────────────────────────────────────────────────────────
const BREADCRUMB_MAP: Record<string, Array<{ label: string; href?: string }>> = {
  // Blog
  "/blog": [{ label: "Blog" }],
  "/blog/lava-family-business-germany-south-africa": [
    { label: "Blog", href: "/blog" },
    { label: "Lava Family Business: Germany & South Africa" },
  ],
  "/blog/you-can-rely-on-our-quality": [
    { label: "Blog", href: "/blog" },
    { label: "You Can Rely on Our Quality" },
  ],
  "/blog/embracing-sustainability-lava-quality": [
    { label: "Blog", href: "/blog" },
    { label: "Embracing Sustainability: Lava Quality" },
  ],
  "/blog/planting-roots-sustainable-tomorrow": [
    { label: "Blog", href: "/blog" },
    { label: "Planting Roots: Sustainable Tomorrow" },
  ],
  "/blog/how-long-does-vacuum-sealed-food-last": [
    { label: "Blog", href: "/blog" },
    { label: "How Long Does Vacuum-Sealed Food Last?" },
  ],
  "/blog/vacuum-sealing-game-meat-south-africa": [
    { label: "Blog", href: "/blog" },
    { label: "Vacuum Sealing Game Meat in South Africa" },
  ],
  "/blog/vacuum-sealing-fish-south-africa": [
    { label: "Blog", href: "/blog" },
    { label: "Vacuum Sealing Fish in South Africa" },
  ],
  "/blog/vacuum-sealing-during-load-shedding": [
    { label: "Blog", href: "/blog" },
    { label: "Vacuum Sealing During Load Shedding" },
  ],
  "/blog/best-vacuum-sealer-south-africa-2026": [
    { label: "Blog", href: "/blog" },
    { label: "Best Vacuum Sealer in South Africa 2026" },
  ],
  "/blog/how-to-vacuum-seal-biltong": [
    { label: "Blog", href: "/blog" },
    { label: "How to Vacuum Seal Biltong" },
  ],

  // Vacuum Packaging Guides
  "/vacuum-packaging/advantages": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Advantages of Vacuum Packaging" },
  ],
  "/vacuum-packaging/shelf-life-chart": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Shelf Life Chart" },
  ],
  "/vacuum-packaging/expert-tips": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Expert Tips" },
  ],
  "/vacuum-packaging/dry-aging": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Dry Aging Under Vacuum" },
  ],
  "/vacuum-packaging/meat-aging": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Meat Aging in a Vacuum" },
  ],
  "/vacuum-packaging/gift-ideas": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Lava Gift Ideas" },
  ],
  "/vacuum-packaging/bags-guide": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Our Vacuum Bags" },
  ],

  // Applications
  "/applications": [{ label: "Applications" }],
  "/applications/kitchen": [
    { label: "Applications", href: "/applications" },
    { label: "Home Kitchen" },
  ],
  "/applications/hunter-game": [
    { label: "Applications", href: "/applications" },
    { label: "Hunters & Game" },
  ],
  "/applications/angler-fishing": [
    { label: "Applications", href: "/applications" },
    { label: "Anglers & Fishing" },
  ],
  "/applications/butchery": [
    { label: "Applications", href: "/applications" },
    { label: "Butchery" },
  ],
  "/applications/biltong": [
    { label: "Applications", href: "/applications" },
    { label: "Biltong & Charcuterie" },
  ],
  "/applications/food-production": [
    { label: "Applications", href: "/applications" },
    { label: "Food Production" },
  ],
  "/applications/catering": [
    { label: "Applications", href: "/applications" },
    { label: "Catering" },
  ],

  // Products - Category Landing Pages
  "/products/vacuum-machines": [
    { label: "Products", href: "/products" },
    { label: "Vacuum Machines" },
  ],
  "/products/bags-rolls": [
    { label: "Products", href: "/products" },
    { label: "Vacuum Bags & Rolls" },
  ],
  "/products/containers-lids": [
    { label: "Products", href: "/products" },
    { label: "Containers & Lids" },
  ],
  "/products/glass-containers": [
    { label: "Products", href: "/products" },
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Glass Containers" },
  ],
  "/products/stainless-containers": [
    { label: "Products", href: "/products" },
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Stainless Containers" },
  ],
  "/products/acrylic-lids": [
    { label: "Products", href: "/products" },
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Acrylic Lids" },
  ],
  "/products/butchery-accessories": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories" },
  ],
  "/products/butchery-knives": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Knives & Sharpeners" },
  ],
  "/products/butchery-protective": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Protective Gear" },
  ],
  "/products/butchery-tools": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Tools & Equipment" },
  ],
  "/products/butchery-scales": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Scales & Displays" },
  ],
  "/products/butchery-hanging": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Hanging Systems" },
  ],
  "/products/butchery-boards": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Cutting Boards" },
  ],
  "/products/butchery-machinery": [
    { label: "Products", href: "/products" },
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Machinery" },
  ],
  "/products/spare-parts": [
    { label: "Products", href: "/products" },
    { label: "Spare Parts" },
  ],

  // Help
  "/help/delivery": [
    { label: "Help", href: "/help" },
    { label: "Delivery & Shipping" },
  ],
  "/help/returns": [
    { label: "Help", href: "/help" },
    { label: "Returns & Exchanges" },
  ],
  "/help/warranty": [
    { label: "Help", href: "/help" },
    { label: "2-Year Warranty" },
  ],
  "/help/faq": [
    { label: "Help", href: "/help" },
    { label: "FAQ" },
  ],

  // Legal
  "/legal/terms": [
    { label: "Legal", href: "/legal" },
    { label: "Terms & Conditions" },
  ],
  "/legal/privacy": [
    { label: "Legal", href: "/legal" },
    { label: "Privacy Policy" },
  ],
  "/legal/conditions": [
    { label: "Legal", href: "/legal" },
    { label: "Conditions of Use" },
  ],
  "/legal/shipping-returns": [
    { label: "Legal", href: "/legal" },
    { label: "Shipping & Returns" },
  ],

  // Other
  "/about": [{ label: "About Lava-SA" }],
  "/contact": [{ label: "Contact" }],
  "/lava-tv": [{ label: "Lava TV" }],
  "/submit-review": [{ label: "Submit a Review" }],
  "/account": [{ label: "My Account" }],
  "/rewards": [{ label: "Lava Points" }],
  "/account/dashboard": [
    { label: "My Account", href: "/account" },
    { label: "My Dashboard" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Breadcrumbs Component
// ─────────────────────────────────────────────────────────────────────────────
export function Breadcrumbs() {
  const pathname = usePathname();

  // Find breadcrumb config for this path
  let breadcrumbs = BREADCRUMB_MAP[pathname];

  // If exact match not found, try dynamic routes
  if (!breadcrumbs) {
    // Handle dynamic product pages: /products/[slug]
    if (pathname.startsWith("/products/") && pathname.split("/").length === 3) {
      const slug = pathname.split("/")[2];
      // Extract readable name from slug (v300-premium-x → V300 Premium X)
      const name = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs = [
        { label: "Products", href: "/products" },
        { label: name },
      ];
    }
  }

  // Don't render if no breadcrumbs found or on homepage
  if (!breadcrumbs || pathname === "/") return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 bg-surface/30 border-b border-border/40">
      <div className="section-container">
        <ol className="flex items-center gap-2 text-sm">
          {/* Always include Home */}
          <li>
            <Link href="/" className="text-primary hover:text-secondary transition-colors font-medium">
              Home
            </Link>
          </li>

          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-copy-muted" />
              {crumb.href ? (
                <Link href={crumb.href} className="text-primary hover:text-secondary transition-colors font-medium">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-copy-muted">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
