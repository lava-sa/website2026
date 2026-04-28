import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Wrench, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "LAVA's Lasting Quality — Built to Last Decades",
  description:
    "Discover why LAVA vacuum sealers are engineered to perform for decades. German precision, stainless steel construction, and a 2-year warranty backed by 40+ years of manufacturing excellence.",
};

const PILLARS = [
  {
    icon: Shield,
    title: "2-Year Manufacturer's Warranty",
    body: "Every LAVA machine sold in South Africa carries a full 2-year manufacturer's warranty — not because it's required, but because we're confident in what we build. Failures within warranty are handled without argument.",
  },
  {
    icon: Wrench,
    title: "Repairable by Design",
    body: "Cheap appliances are built to be replaced. LAVA machines are built to be repaired. Every serviceable part — sealing strip, liquid trap lid, vacuum seal set — is stocked and available. A R200 sealing strip can add years to your machine's life.",
  },
  {
    icon: Clock,
    title: "Spare Parts for 10+ Years",
    body: "When LAVA discontinues a model, they don't abandon the owners. Parts are stocked and supplied for a minimum of 10 years after a model is retired. You'll never be left with an expensive paperweight.",
  },
  {
    icon: Star,
    title: "Made in Germany Since 1982",
    body: "LAVA has been engineering vacuum sealers in Germany for over four decades. The same factory. The same standards. The same commitment to producing machines that outlast trends and fads.",
  },
];

export default function LastingQualityPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline text-secondary mb-3">German Engineering</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                You Can Rely on<br />Our Quality
              </h1>
              <p className="mt-5 text-on-dark-muted text-lg leading-relaxed max-w-lg">
                A machine that lasts 20 years is a fundamentally different product to one that lasts 3.
                LAVA vacuum sealers are engineered for the long haul — in Germany, with materials and
                standards that have not changed since 1982.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products/vacuum-machines"
                  className="inline-block bg-secondary text-white font-bold px-6 py-3 hover:bg-secondary/90 transition-colors"
                >
                  Shop Vacuum Machines
                </Link>
                <Link
                  href="/products/spare-parts"
                  className="inline-block border border-white/30 text-white/80 font-semibold px-6 py-3 hover:bg-white/10 hover:text-white transition-colors"
                >
                  View Spare Parts
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden shadow-2xl">
              <Image
                src="/images/homepage/lava-german-quality.webp"
                alt="LAVA vacuum sealer — German precision engineering"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Four pillars ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="section-container">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="overline mb-3">What makes the difference</p>
            <h2 className="text-3xl font-bold text-primary">The Four Pillars of LAVA Quality</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white border border-border p-8">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{title}</h3>
                <p className="text-copy-muted text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Precision & durability image break ───────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden shadow-xl">
              <Image
                src="/images/homepage/lava-precision-durability.webp"
                alt="LAVA precision and durability — stainless steel construction"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="overline mb-3">Engineered differently</p>
              <h2 className="text-3xl font-bold text-primary mb-5">
                The Real Cost of a Cheap Machine
              </h2>
              <div className="space-y-4 text-copy-muted text-[15px] leading-relaxed">
                <p>
                  A R700 vacuum sealer that fails after 18 months has cost you R467 per year.
                  A LAVA machine at R13,500 that runs for 15 years costs you R900 per year — and
                  that calculation doesn&apos;t include the frustration, the food wasted during
                  downtime, or the cost of replacement bags that don&apos;t seal properly.
                </p>
                <p>
                  LAVA&apos;s stainless steel sealing bars and high-powered vacuum pumps are selected
                  for longevity, not margin. Every component is rated for thousands of cycles.
                  The sealing strip — the most-replaced part — costs R200 and takes 2 minutes
                  to fit. That&apos;s not a design oversight. It&apos;s intentional.
                </p>
                <p>
                  When professionals and serious home users compare their options over a 10-year
                  horizon, the calculation always favours LAVA. Quality is never accidental.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quality comparison table ──────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="section-container max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <p className="overline mb-2">Side by side</p>
            <h2 className="text-2xl font-bold text-primary">LAVA vs a Budget Sealer</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-5 font-bold">Feature</th>
                  <th className="text-center py-3 px-5 font-bold">Budget Sealer</th>
                  <th className="text-center py-3 px-5 font-bold text-secondary">LAVA Machine</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Expected lifespan", "1–3 years", "15–20+ years"],
                  ["Construction", "Plastic housing", "Stainless steel + ABS"],
                  ["Warranty", "6–12 months", "2 years (manufacturer)"],
                  ["Spare parts available", "Rarely", "10+ years after model ends"],
                  ["Vacuum pressure", "~0.6–0.7 bar", "Up to −0.96 bar"],
                  ["Origin", "Unknown / mass produced", "Made in Germany"],
                  ["Repairability", "Not designed to be repaired", "Every part replaceable"],
                ].map(([feat, budget, lava], i) => (
                  <tr key={feat} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="py-3 px-5 font-semibold text-primary border-b border-border">{feat}</td>
                    <td className="py-3 px-5 text-center text-copy-muted border-b border-border">{budget}</td>
                    <td className="py-3 px-5 text-center font-semibold text-secondary border-b border-border">{lava}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="section-container max-w-xl mx-auto">
          <p className="overline mb-3">Ready to invest in quality?</p>
          <h2 className="text-3xl font-bold text-primary mb-5">Find Your LAVA Machine</h2>
          <p className="text-copy-muted mb-8">
            Browse the full range — from compact home models to professional commercial sealers.
            All backed by the same German engineering and 2-year warranty.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/vacuum-machines" className="inline-block bg-primary text-white font-bold px-8 py-3 hover:bg-primary/90 transition-colors">
              Shop All Machines
            </Link>
            <Link href="/about" className="inline-block border border-border text-copy font-semibold px-8 py-3 hover:border-primary hover:text-primary transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface border-t border-border">
        <div className="section-container max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-secondary mb-3">Pillar Guide Links</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guides/vacuum-sealer-buying-guide" className="border border-border bg-white px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors">
              Vacuum Sealer Buying Guide →
            </Link>
            <Link href="/guides/vacuum-sealing-applications" className="border border-border bg-white px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors">
              Applications Guide →
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
