import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Food Preservation & Reducing Waste Guide",
  description:
    "A practical food preservation system to reduce spoilage, freezer burn, and household food waste with vacuum sealing.",
};

const CLUSTERS = [
  ["/vacuum-packaging/shelf-life-chart", "Shelf-Life Chart"],
  ["/vacuum-packaging/advantages", "Advantages of Vacuum Packaging"],
  ["/about/sustainable-sealing", "Sustainable Sealing"],
  ["/about/green-mission", "Green Mission"],
  ["/blog/how-long-does-vacuum-sealed-food-last", "How Long Food Lasts"],
] as const;

export default function FoodPreservationWasteGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-14">
        <div className="section-container max-w-4xl">
          <p className="overline text-secondary mb-3">Pillar Guide</p>
          <h1 className="text-4xl font-bold text-white leading-tight">Food Preservation & Reducing Waste Guide</h1>
          <p className="mt-4 text-on-dark-muted text-lg">
            Build a repeatable system for buying, sealing, labeling, freezing, and rotation.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-container max-w-4xl space-y-5 text-copy leading-relaxed">
          <p>
            The core objective is not only longer shelf life. It is predictable inventory, fewer emergency purchases,
            and lower spoilage across meat, fish, vegetables, prepared meals, and pantry goods.
          </p>
          <p>
            Use a simple cycle: batch buy -> portion -> vacuum seal -> date label -> first-in-first-out rotation.
            This lowers waste and improves cash-flow efficiency for households and small businesses.
          </p>
          <p className="font-semibold text-primary">Cluster resources from this pillar:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLUSTERS.map(([href, label]) => (
              <Link key={href} href={href} className="border border-border px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors">
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
