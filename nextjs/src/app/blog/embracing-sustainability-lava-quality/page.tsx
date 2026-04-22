import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Leaf, Recycle, Clock, TrendingDown } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Embracing Sustainability — How LAVA's Longevity Reduces Waste",
  description:
    "A machine that lasts 20 years is the most sustainable choice. How LAVA's build quality, vacuum preservation and reforestation commitment align with a reduced-waste lifestyle.",
};

export default function PostSustainability() {
  const articleLd = articleSchema({
    title: "Embracing Sustainability — How LAVA's Longevity Reduces Waste",
    description:
      "A machine that lasts 20 years is the most sustainable choice. How LAVA's build quality, vacuum preservation and reforestation commitment align with a reduced-waste lifestyle.",
    url: "/blog/embracing-sustainability-lava-quality",
    datePublished: "2026-02-03",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Sustainability</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            Embracing Sustainability — How LAVA&apos;s Long-Lasting Quality Reduces Waste
          </h1>
          <p className="text-copy-muted text-sm">3 April 2026 · 4 min read</p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/about/lava-reforestation.webp" alt="LAVA and sustainability" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <p>
            Sustainability is often framed as buying more &ldquo;green&rdquo; products. But the most
            sustainable choice is almost always to <strong>buy less, and buy better.</strong> A
            vacuum sealer that lasts 20 years creates a fraction of the waste of five R700 machines
            that each last four years. The maths are straightforward. The choice is harder.
          </p>

          <p>
            LAVA&apos;s approach to sustainability runs through the whole business — not as a
            marketing layer, but as a consequence of how they build things.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Three Ways Vacuum Sealing Reduces Food Waste</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {[
              {
                icon: Clock,
                title: "Food Lasts 3–5× Longer",
                desc: "Vacuum-sealed meat in the freezer lasts 2–3 years vs. 3–6 months in standard packaging. Less freezer burn. Less waste.",
              },
              {
                icon: TrendingDown,
                title: "Less Impulse Buying",
                desc: "When you can bulk-buy and vacuum seal, you shop less often and waste less on fresh food that spoils before you use it.",
              },
              {
                icon: Recycle,
                title: "Reuse Bags & Containers",
                desc: "LAVA bags can be washed and reused multiple times for dry goods. Containers last indefinitely. Less single-use plastic.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border bg-surface p-5 text-center">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-bold text-primary text-sm mb-2">{title}</p>
                <p className="text-xs text-copy-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The Real Cost of Food Waste in South Africa</h2>
          <p>
            South Africa wastes approximately <strong>10 million tonnes of food per year</strong> —
            about a third of all food produced. The majority happens at household level: food bought
            with good intentions that spoils before it&apos;s eaten.
          </p>
          <p>
            Vacuum sealing doesn&apos;t solve food waste on its own. But it addresses the two biggest
            household causes: <strong>freezer burn</strong> and <strong>fridge spoilage</strong>.
          </p>

          <table className="w-full text-sm border border-border my-6">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Food Item</th>
                <th className="text-left py-3 px-4 font-bold">Standard Storage</th>
                <th className="text-left py-3 px-4 font-bold">Vacuum Sealed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Beef / lamb (frozen)", "3–6 months", "2–3 years"],
                ["Fish (frozen)", "2–3 months", "12–18 months"],
                ["Cooked food (fridge)", "3–4 days", "10–14 days"],
                ["Vegetables (fridge)", "3–5 days", "10–15 days"],
                ["Hard cheese (fridge)", "1–2 weeks", "4–8 months"],
                ["Coffee beans (room temp)", "2–4 weeks", "4–6 months"],
              ].map(([food, standard, sealed]) => (
                <tr key={food} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-semibold text-primary">{food}</td>
                  <td className="py-2.5 px-4 text-copy-muted">{standard}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary">{sealed}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">A Machine Built Not to Be Replaced</h2>
          <p>
            Planned obsolescence — the practice of building products to fail — is one of the most
            wasteful forces in modern manufacturing. A cheap appliance that fails in two years creates
            far more environmental damage than the product it replaced ever justified.
          </p>
          <p>
            LAVA&apos;s design philosophy is the opposite. Their machines are:
          </p>
          <ul>
            <li><strong>Repairable</strong> — every serviceable component can be replaced without special tools</li>
            <li><strong>Long-supported</strong> — spare parts are stocked for 10+ years after a model is discontinued</li>
            <li><strong>Durable</strong> — stainless steel construction resists the wear that kills cheaper units</li>
            <li><strong>Economically repairable</strong> — a sealing strip that costs R200 to replace extends machine life by years</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 p-6 my-8 flex gap-4">
            <Leaf className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <p className="font-bold text-primary mb-1">Our Reforestation Commitment</p>
              <p className="text-sm text-copy leading-relaxed">
                LAVA contributes to reforestation projects for every machine sold. The trees planted
                on our behalf offset the carbon footprint of manufacturing and shipping — and will
                continue sequestering carbon long after the machine is still in use.
              </p>
              <Link href="/blog/planting-roots-sustainable-tomorrow" className="text-sm font-semibold text-secondary hover:text-primary transition-colors mt-2 inline-block">
                Read more about our reforestation programme →
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop LAVA Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/vacuum-packaging/shelf-life-chart" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            View Full Shelf Life Chart
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog/you-can-rely-on-our-quality" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Our Quality
          </Link>
          <Link href="/blog/planting-roots-sustainable-tomorrow" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Planting Roots <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
