"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Breadcrumb mapping: pathname → [{ label, href }, ...]
// Home is always prepended automatically — do NOT include it here.
// ─────────────────────────────────────────────────────────────────────────────
const BREADCRUMB_MAP: Record<string, Array<{ label: string; href?: string }>> = {
  // Blog
  "/blog": [{ label: "Blog" }],
  "/blog/lava-family-business-germany-south-africa": [
    { label: "Blog", href: "/blog" },
    { label: "A Family Business from Baden-Württemberg — 40 Years of Precision. Now in South Africa." },
  ],
  "/blog/you-can-rely-on-our-quality": [
    { label: "Blog", href: "/blog" },
    { label: "You Can Rely on Our Quality" },
  ],
  "/blog/embracing-sustainability-lava-quality": [
    { label: "Blog", href: "/blog" },
    { label: "Embracing Sustainability — How LAVA's Long-Lasting Quality Reduces Waste" },
  ],
  "/blog/planting-roots-sustainable-tomorrow": [
    { label: "Blog", href: "/blog" },
    { label: "Planting Roots for a Sustainable Tomorrow" },
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
    { label: "How to Vacuum Seal Fish After a Day on the Water" },
  ],
  "/blog/vacuum-sealing-during-load-shedding": [
    { label: "Blog", href: "/blog" },
    { label: "Vacuum Sealing & Load Shedding — How to Protect Your Food During Power Outages" },
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
  "/vacuum-packaging": [{ label: "Vacuum Packaging" }],
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
    { label: "Expert Vacuum Sealing Tips" },
  ],
  "/vacuum-packaging/dry-aging": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Dry Aging Beef at Home" },
  ],
  "/vacuum-packaging/meat-aging": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Meat Aging in a Vacuum" },
  ],
  "/vacuum-packaging/gift-ideas": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Gift Ideas" },
  ],
  "/vacuum-packaging/bags-guide": [
    { label: "Vacuum Packaging", href: "/vacuum-packaging" },
    { label: "Our Vacuum Bags" },
  ],

  // Applications
  "/applications": [{ label: "Applications" }],
  "/applications/kitchen": [
    { label: "Applications", href: "/applications" },
    { label: "Home Kitchen & Meal Prep" },
  ],
  "/applications/hunter-game": [
    { label: "Applications", href: "/applications" },
    { label: "Hunters & Game Processing" },
  ],
  "/applications/angler-fishing": [
    { label: "Applications", href: "/applications" },
    { label: "Anglers & Fishing" },
  ],
  "/applications/butchery": [
    { label: "Applications", href: "/applications" },
    { label: "Butchery & Meat Processing" },
  ],
  "/applications/biltong": [
    { label: "Applications", href: "/applications" },
    { label: "Biltong & Charcuterie" },
  ],
  "/applications/food-production": [
    { label: "Applications", href: "/applications" },
    { label: "Food Production & Small Business" },
  ],
  "/applications/catering": [
    { label: "Applications", href: "/applications" },
    { label: "Catering & Restaurants" },
  ],

  // Products — Category pages (no "Products" intermediate — Home > Category)
  "/products/vacuum-machines": [{ label: "LAVA Vacuum Sealing Machines" }],
  "/products/vacuum-bags":     [{ label: "Vacuum Bags" }],
  "/products/vacuum-rolls":    [{ label: "Vacuum Rolls" }],
  "/products/bags-rolls":      [{ label: "Vacuum Bags & Rolls" }],
  "/products/containers-lids": [{ label: "Containers & Lids" }],
  "/products/glass-containers": [
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Glass Vacuum Containers" },
  ],
  "/products/stainless-containers": [
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Stainless Steel Vacuum Containers" },
  ],
  "/products/acrylic-lids": [
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Universal Acrylic Vacuum Lids" },
  ],
  "/products/glass-jar-sealer": [
    { label: "Containers & Lids", href: "/products/containers-lids" },
    { label: "Vacuum Sealer for Glass Jars" },
  ],
  "/products/butchery-accessories": [{ label: "Butchery Accessories" }],
  "/products/butchery-knives": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Professional Butchery Knives" },
  ],
  "/products/butchery-protective": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Protective Butchery Clothing" },
  ],
  "/products/butchery-tools": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Specialized Butchery Tools" },
  ],
  "/products/butchery-scales": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Precision Butchery Scales" },
  ],
  "/products/butchery-hanging": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Butchery Hanging Systems" },
  ],
  "/products/butchery-boards": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Cutting and Display Boards" },
  ],
  "/products/butchery-machinery": [
    { label: "Butchery Accessories", href: "/products/butchery-accessories" },
    { label: "Machinery" },
  ],
  "/products/spare-parts":    [{ label: "Spare Parts" }],
  "/products/sous-vide":      [{ label: "Sous Vide" }],
  "/products/special-offers": [{ label: "Special Offers" }],

  // Shopping Help
  "/help": [{ label: "Shopping Help" }],
  "/help/delivery": [
    { label: "Shopping Help", href: "/help" },
    { label: "Delivery & Shipping" },
  ],
  "/help/returns": [
    { label: "Shopping Help", href: "/help" },
    { label: "Returns & Exchanges" },
  ],
  "/help/warranty": [
    { label: "Shopping Help", href: "/help" },
    { label: "2-Year Warranty" },
  ],
  "/help/faq": [
    { label: "Shopping Help", href: "/help" },
    { label: "Frequently Asked Questions" },
  ],

  // Legal
  "/legal": [{ label: "Legal" }],
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

  // About
  "/about": [{ label: "About Lava-SA" }],
  "/about/lasting-quality": [
    { label: "About Lava-SA", href: "/about" },
    { label: "Lasting Quality" },
  ],
  "/about/sustainable-sealing": [
    { label: "About Lava-SA", href: "/about" },
    { label: "Sustainable Sealing" },
  ],
  "/about/green-mission": [
    { label: "About Lava-SA", href: "/about" },
    { label: "Green Mission" },
  ],

  // Other static pages
  "/contact":        [{ label: "Contact" }],
  "/lava-tv":        [{ label: "Lava TV" }],
  "/submit-review":  [{ label: "Share Your Lava Story" }],
  "/account":        [{ label: "My Account" }],
  "/rewards":        [{ label: "Lava Points" }],
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

  const breadcrumbs = BREADCRUMB_MAP[pathname];

  // Don't render on homepage, on dynamic product detail pages (they render
  // their own inline breadcrumb), or on any path not in the map.
  if (!breadcrumbs || pathname === "/") return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 bg-surface/30 border-b border-border/40">
      <div className="section-container">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          <li>
            <Link href="/" className="text-primary hover:text-secondary transition-colors font-medium">
              Home
            </Link>
          </li>

          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-copy-muted shrink-0" />
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
