import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, TreePine } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Planting Roots for a Sustainable Tomorrow — LAVA's Reforestation Commitment",
  description:
    "Every LAVA machine sold contributes to global reforestation. How a family business in Baden-Württemberg is helping plant the future.",
};

export default function PostPlantingRoots() {
  const articleLd = articleSchema({
    title: "Planting Roots for a Sustainable Tomorrow — LAVA's Reforestation Commitment",
    description:
      "Every LAVA machine sold contributes to global reforestation. How a family business in Baden-Württemberg is helping plant the future.",
    url: "/blog/planting-roots-sustainable-tomorrow",
    datePublished: "2026-02-15",
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
            Planting Roots for a Sustainable Tomorrow
          </h1>
          <p className="text-copy-muted text-sm">4 April 2026 · 3 min read</p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/about/lava-reforestation.webp" alt="LAVA Reforestation" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <p>
            The forests of the world store roughly <strong>one trillion tonnes of carbon</strong>.
            They regulate rainfall, protect watersheds, shelter biodiversity and purify the air.
            They&apos;re also disappearing at a rate of about 10 million hectares per year.
          </p>
          <p>
            LAVA can&apos;t solve deforestation. But a family business in Baden-Württemberg can
            take responsibility for the footprint it creates — and do something tangible about it.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The Commitment</h2>
          <p>
            For every LAVA machine sold — including every machine sold through Lava-SA — a
            contribution is made to verified global reforestation projects. Not carbon offsets
            on paper. <strong>Real trees, planted in real soil.</strong>
          </p>
          <p>
            The projects are selected for long-term impact: native species in biodiverse regions,
            planted with communities that have an economic stake in protecting them.
          </p>

          <div className="bg-primary text-white p-8 my-10">
            <div className="flex items-start gap-4">
              <TreePine className="h-8 w-8 text-secondary shrink-0 mt-1" />
              <div>
                <p className="font-bold text-lg mb-2">When you buy a LAVA machine</p>
                <p className="text-white/80 leading-relaxed">
                  You&apos;re not just investing in a quality appliance. You&apos;re part of a chain
                  of responsibility that starts in a factory in Germany, runs through a family business
                  in Johannesburg, and ends with a tree in the ground somewhere that needs one.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Why This Matters in South Africa</h2>
          <p>
            South Africa is one of the world&apos;s most biologically diverse countries, and one of
            the most threatened. Indigenous forests cover less than 0.5% of the country&apos;s land
            area. Alien invasive species consume water resources that native vegetation would leave
            for rivers and aquifers.
          </p>
          <p>
            Reforestation isn&apos;t just an environmental gesture in this context. It&apos;s
            connected to water security, biodiversity and the long-term viability of the land.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The Bigger Picture</h2>
          <p>
            Sustainability at LAVA isn&apos;t a department or a campaign. It&apos;s expressed in
            three ways that reinforce each other:
          </p>
          <ul>
            <li>
              <strong>Build to last</strong> — a machine that never needs to be replaced creates far
              less waste than one that lasts three years
            </li>
            <li>
              <strong>Preserve food</strong> — every kilogram of food saved from spoilage represents
              water, energy and land that didn&apos;t need to produce a replacement
            </li>
            <li>
              <strong>Give back to the land</strong> — the reforestation commitment closes the loop
              on the carbon and resources that manufacturing requires
            </li>
          </ul>

          <p>
            None of this makes LAVA perfect. But it makes them better — and it&apos;s a genuine
            commitment from a family business that has been thinking about the long term since 1982.
          </p>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop LAVA Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/about" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Our Full Story
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog/embracing-sustainability-lava-quality" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Sustainability
          </Link>
          <Link href="/blog/how-long-does-vacuum-sealed-food-last" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Shelf Life Guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
