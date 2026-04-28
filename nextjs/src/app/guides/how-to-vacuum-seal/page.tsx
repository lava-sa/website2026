import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Vacuum Seal | Tutorials & Videos",
  description:
    "Step-by-step vacuum sealing guide with linked tutorials for bags, rolls, containers, wet products, and pressure-sensitive foods.",
};

const HOW_TO_CLUSTERS = [
  ["/lava-tv", "Lava TV Video Tutorials"],
  ["/vacuum-packaging/expert-tips", "Expert Tips Guide"],
  ["/vacuum-packaging/bags-guide", "Vacuum Bags Guide"],
  ["/vacuum-packaging/shelf-life-chart", "Shelf-Life Chart"],
  ["/help/faq", "Troubleshooting FAQ"],
] as const;

export default function HowToVacuumSealPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-14">
        <div className="section-container max-w-4xl">
          <p className="overline text-secondary mb-3">Pillar Guide</p>
          <h1 className="text-4xl font-bold text-white leading-tight">How to Vacuum Seal (Step-by-Step)</h1>
          <p className="mt-4 text-on-dark-muted text-lg">
            A practical workflow for first-time users and advanced operators.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-container max-w-4xl space-y-4 text-copy leading-relaxed">
          <p>1) Choose correct bag thickness and clean sealing edge.</p>
          <p>2) Select automatic mode for speed or manual mode for delicate/wet products.</p>
          <p>3) Use pressure regulation for bread, berries, fish, and liquids.</p>
          <p>4) Validate seam quality and storage labeling before freezing.</p>
          <p className="font-semibold text-primary pt-2">Cluster resources from this pillar:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HOW_TO_CLUSTERS.map(([href, label]) => (
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
