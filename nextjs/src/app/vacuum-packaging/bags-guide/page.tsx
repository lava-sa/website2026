import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Vacuum Bags — Which Bag for Which Job",
  description:
    "Embossed vs smooth bags, sizes explained, BPA-free materials, reuse guide — everything you need to choose the right LAVA vacuum bag for every application.",
};

export default function BagsGuidePage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary">Our Vacuum Bags</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Not all vacuum bags are equal — and using the wrong bag for the wrong job
            produces poor results. Here&apos;s everything you need to choose correctly.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/lava-0001.jpg" alt="Vacuum sealed food in LAVA bags" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">The Single Most Important Thing to Know</h2>
          <div className="bg-primary text-white p-5 mb-8">
            <p className="font-semibold leading-relaxed">
              You <strong className="text-secondary">must</strong> use embossed (textured, ribbed) bags
              with LAVA external vacuum sealers. The channel pattern allows the vacuum pump to draw air
              from the entire bag. Smooth bags block the channels — the machine cannot achieve a full vacuum
              and the seal will fail. Smooth bags are only for chamber vacuum machines.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Embossed vs Smooth — When to Use Each</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="border-2 border-secondary p-5">
              <p className="font-black text-primary mb-2 text-base">Embossed Bags (Textured)</p>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Use with LAVA external sealers</p>
              <ul className="text-sm text-copy space-y-1.5 pl-3">
                {[
                  "Meat, fish, poultry",
                  "Hard cheese",
                  "Vegetables and fruit",
                  "Dry goods (nuts, coffee, rice)",
                  "Game meat portions",
                  "Most household applications",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-secondary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-border p-5">
              <p className="font-black text-primary mb-2 text-base">Smooth Bags</p>
              <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-3">Chamber machines only</p>
              <ul className="text-sm text-copy space-y-1.5 pl-3">
                {[
                  "Liquids and sauces",
                  "Commercial food processing",
                  "Smooth presentation requirements",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-secondary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-copy-muted">
                  <X className="h-3.5 w-3.5 text-red-400 inline mr-1" />
                  Do not use smooth bags with LAVA external sealers
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Size Guide</h2>
          <table className="w-full text-sm border border-border mb-8">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Bag Size</th>
                <th className="text-left py-3 px-4 font-bold">Best For</th>
                <th className="text-left py-3 px-4 font-bold">Approx Portion Size</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["15×25 cm", "Cheese portions, small steaks, fish fillets", "150–300g"],
                ["20×30 cm", "Standard portions — most common size", "300–600g"],
                ["25×40 cm", "Larger steaks, game cuts, chicken pieces", "600g–1.5kg"],
                ["30×60 cm", "Whole fish, full roasts, bulk portions", "1.5–5kg"],
                ["Custom (rolls)", "Any size — cut to the exact length needed", "Any"],
              ].map(([size, use, portion]) => (
                <tr key={size} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-bold text-primary">{size}</td>
                  <td className="py-2.5 px-4 text-copy text-sm">{use}</td>
                  <td className="py-2.5 px-4 text-copy-muted text-sm">{portion}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">LAVA Bag Quality — What Makes Them Different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { title: "BPA-Free", desc: "All LAVA bags are 100% BPA-free. Safe for food contact, freezer storage and boiling (sous vide)." },
              { title: "5-Layer Construction", desc: "PA/PE multi-layer structure — the outer nylon layer protects against puncture, the inner polyethylene layer is food-safe and creates the seal." },
              { title: "Freezer-Safe", desc: "Rated for temperatures down to -40°C. Will not become brittle or crack in the freezer, even after years." },
              { title: "Microwave & Boilable", desc: "Safe for sous vide (up to 90°C). Can be used in the microwave with the seal opened for ventilation." },
              { title: "Reusable for Dry Goods", desc: "Bags used for dry goods (nuts, coffee, rice) can be washed and reused. Do not reuse bags that contained raw meat, fish or cooked food." },
              { title: "Precision-Cut Edges", desc: "Straight-cut edges that seal cleanly and evenly with the LAVA sealing strip — no uneven sealing from inconsistent bag edges." },
            ].map(({ title, desc }) => (
              <div key={title} className="border border-border bg-surface p-4">
                <p className="font-bold text-primary text-sm mb-1">{title}</p>
                <p className="text-xs text-copy leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Vacuum Rolls — When to Use Them</h2>
          <p>
            LAVA vacuum rolls let you cut bags to any custom length. This is especially useful for:
          </p>
          <ul>
            <li><strong>Irregularly shaped items</strong> — a whole fish, a boneless leg of lamb, an odd-shaped game cut</li>
            <li><strong>Very long items</strong> — a full pork belly, a side of salmon</li>
            <li><strong>Minimising waste</strong> — cut exactly the length you need instead of using a pre-sized bag that&apos;s too large</li>
          </ul>
          <p>
            Rolls are also more economical per square centimetre of bag material — useful if you
            seal large quantities regularly.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Watch: Vacuum Bags in Action</h2>
          <div className="relative aspect-video bg-zinc-100 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/rmHiCfqTSJc?rel=0&modestbranding=1"
              title="LAVA Smooth Bags for Liquids and Sauces"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>

        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/bags-rolls" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop All Bags & Rolls <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/vacuum-machines" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shop Vacuum Machines
          </Link>
        </div>

      </div>
    </main>
  );
}
