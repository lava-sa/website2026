import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Flame, Gift, ShoppingBag, Droplets, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Vacuum Packaging",
  description:
    "Everything you need to know about vacuum packaging — shelf life, techniques, bag guides, dry aging, and expert tips from LAVA South Africa.",
};

const GUIDES = [
  {
    icon: Star,
    title: "Advantages of Vacuum Packaging",
    description: "Why vacuum sealing is the smartest food preservation decision you can make.",
    href: "/vacuum-packaging/advantages",
  },
  {
    icon: Clock,
    title: "Shelf Life Chart",
    description: "Exactly how long vacuum-sealed food lasts in the fridge and freezer.",
    href: "/vacuum-packaging/shelf-life-chart",
  },
  {
    icon: ShoppingBag,
    title: "Vacuum Bags Guide",
    description: "Which bag or roll is right for your food, your machine, and your budget.",
    href: "/vacuum-packaging/bags-guide",
  },
  {
    icon: BookOpen,
    title: "Expert Tips",
    description: "Pro techniques for better seals, longer shelf life, and fewer mistakes.",
    href: "/vacuum-packaging/expert-tips",
  },
  {
    icon: Flame,
    title: "Dry Aging Under Vacuum",
    description: "How to dry age beef and game meat at home using your LAVA machine.",
    href: "/vacuum-packaging/dry-aging",
  },
  {
    icon: Droplets,
    title: "Meat Aging in a Vacuum",
    description: "Wet aging explained — tenderise without the fridge space of traditional aging.",
    href: "/vacuum-packaging/meat-aging",
  },
  {
    icon: Gift,
    title: "Gift Ideas",
    description: "The best LAVA gift bundles for hunters, foodies, and home cooks.",
    href: "/vacuum-packaging/gift-ideas",
  },
];

export default function VacuumPackagingPage() {
  return (
    <main className="min-h-screen bg-white">

      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Guides & Knowledge</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Vacuum Packaging
          </h1>
          <p className="mt-4 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Everything you need to get the most from your LAVA machine — shelf life charts,
            technique guides, bag selection, and expert tips.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map(({ icon: Icon, title, description, href }) => (
              <Link
                key={href}
                href={href}
                className="group border border-border bg-white p-6 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-copy-muted leading-relaxed">{description}</p>
                <p className="mt-4 text-xs font-bold text-secondary">Read guide →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface border-t border-border py-12 text-center">
        <div className="section-container max-w-xl mx-auto">
          <p className="text-copy-muted mb-4">Ready to buy?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/vacuum-machines" className="inline-block bg-primary text-white font-bold px-6 py-3 hover:bg-primary/90 transition-colors">
              Shop Vacuum Machines
            </Link>
            <Link href="/products/vacuum-bags" className="inline-block border border-border text-copy font-semibold px-6 py-3 hover:border-primary hover:text-primary transition-colors">
              Shop Vacuum Bags
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
