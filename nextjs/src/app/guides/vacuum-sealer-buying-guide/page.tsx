import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vacuum Sealer Buying Guide | Lava-SA",
  description:
    "How to choose the right vacuum sealer for home kitchens, hunters, anglers, butcheries, and commercial users in South Africa.",
};

const CLUSTERS = [
  ["/products/vacuum-machines", "Compare Vacuum Machines"],
  ["/products/v300-premium-x", "V.300 Premium X Product Page"],
  ["/products/sous-vide", "Sous Vide Equipment"],
  ["/help/faq", "Buying FAQ"],
  ["/blog/best-vacuum-sealer-south-africa-2026", "Best Vacuum Sealer 2026"],
] as const;

export default function BuyingGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-14">
        <div className="section-container max-w-4xl">
          <p className="overline text-secondary mb-3">Pillar Guide</p>
          <h1 className="text-4xl font-bold text-white leading-tight">Vacuum Sealer Buying Guide</h1>
          <p className="mt-4 text-on-dark-muted text-lg">
            Choose by usage intensity, food type, throughput, and control requirements - not by marketing labels.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-container max-w-4xl space-y-6 text-copy leading-relaxed">
          <p>
            Start with your real workload: occasional meal prep, seasonal hunting, weekly fish processing, or daily production.
            Then map that to sealing width, vacuum strength, control mode, and duty cycle.
          </p>
          <p>
            Home users usually start with V.100 or V.300. Mixed use and heavy home-industry workflows generally fit V.300+.
            Butcheries and continuous operations should evaluate V.333/V.400/V.500.
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
