import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vacuum Sealing Guides Hub | Lava-SA",
  description:
    "Pillar guide hub for vacuum sealer buying, how-to tutorials, food preservation and waste reduction, and real-world applications for hunters, chefs, butcheries, and sous vide users.",
};

const PILLARS = [
  {
    title: "Vacuum Sealer Buying Guide",
    href: "/guides/vacuum-sealer-buying-guide",
    body: "Compare models, match machine specs to your use case, and avoid expensive buying mistakes.",
  },
  {
    title: "How to Vacuum Seal (Step-by-Step)",
    href: "/guides/how-to-vacuum-seal",
    body: "Core sealing workflows, troubleshooting, and practical tutorials linked to Lava TV videos.",
  },
  {
    title: "Food Preservation & Reducing Waste Guide",
    href: "/guides/food-preservation-reducing-waste",
    body: "Shelf-life strategy, freezer planning, and sustainability-focused food-saving systems.",
  },
  {
    title: "Applications Guide (Hunters, Chefs, Butchery, Sous Vide)",
    href: "/guides/vacuum-sealing-applications",
    body: "Application-specific playbooks and machine recommendations for South African workflows.",
  },
];

export default function GuidesHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-16">
        <div className="section-container max-w-4xl">
          <p className="overline text-secondary mb-3">Pillar Hub</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">LAVA Guides & Pillar Content</h1>
          <p className="mt-4 text-on-dark-muted text-lg leading-relaxed">
            Start here for the core vacuum-sealing knowledge base. Each pillar page links to cluster guides, product pages,
            and practical implementation content.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.href}
                href={pillar.href}
                className="border border-border bg-white p-6 hover:border-primary hover:shadow-sm transition-all"
              >
                <h2 className="text-xl font-bold text-primary mb-2">{pillar.title}</h2>
                <p className="text-sm text-copy-muted leading-relaxed">{pillar.body}</p>
                <p className="mt-4 text-xs font-bold text-secondary uppercase tracking-wide">Open pillar →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
