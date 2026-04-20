import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "You Can Rely on Our Quality — Why LAVA Machines Are Built to Last | Lava Blog",
  description:
    "Cheap vacuum sealers fail within a year. LAVA machines are still sealing perfectly after 20 years. Here's what genuine German engineering looks like on the inside.",
};

const qualityPoints = [
  { title: "Double Sealing Strips", desc: "Two sealing elements per cycle — one melts the bag, the second reinforces the seal. Result: zero failures on wet or heavy bags." },
  { title: "Stainless Steel Lid", desc: "The lid on every LAVA machine is brushed stainless steel, not ABS plastic. It doesn't yellow, crack or warp after years of daily use." },
  { title: "German-Made Vacuum Pump", desc: "The heart of every LAVA machine. Rated for 50,000+ full cycles — the equivalent of sealing 3 bags a day for 45 years." },
  { title: "10+ Year Spare Parts Support", desc: "Every model LAVA has ever made still has spare parts available. Your machine can be repaired — not replaced." },
  { title: "Individual Pre-Dispatch Test", desc: "Every LAVA machine is tested before it leaves the factory. Not batch-tested. Individually tested." },
  { title: "Pressure Control Technology", desc: "Soft items (bread, delicate vegetables) won't be crushed. The machine adapts vacuum pressure to what's being sealed." },
];

export default function PostQuality() {
  const articleLd = articleSchema({
    title: "You Can Rely on Our Quality — Why LAVA Machines Are Built to Last",
    description:
      "Cheap vacuum sealers fail within a year. LAVA machines are still sealing perfectly after 20 years. Here's what genuine German engineering looks like on the inside.",
    url: "/blog/you-can-rely-on-our-quality",
    datePublished: "2026-01-20",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Quality</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            You Can Rely on Our Quality — Why LAVA Machines Are Built to Last a Lifetime
          </h1>
          <p className="text-copy-muted text-sm">2 April 2026 · 4 min read</p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/about/lava-german-quality.webp" alt="LAVA German Quality Engineering" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <p>
            There&apos;s a common pattern with cheap vacuum sealers: they work fine for a few months,
            then the sealing strip loses pressure, then the lid latch breaks, then the machine is binned.
            You&apos;ve spent R700–R1,200 and have nothing to show for it. Many people repeat this cycle
            two or three times before finding LAVA.
          </p>
          <p>
            <strong>A LAVA machine purchased in 2007 — the year we launched in South Africa — is, in
            most cases, still sealing perfectly today.</strong> That&apos;s not an anecdote. It&apos;s
            why our oldest customers don&apos;t need to buy new machines. They just buy bags.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">What Makes LAVA Different — Inside the Machine</h2>
          <p>
            The quality gap between LAVA and budget machines isn&apos;t visible in the brochure.
            It&apos;s visible when you open the lid, run 10,000 sealing cycles, or call for a spare
            part five years after purchase.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {qualityPoints.map(({ title, desc }) => (
              <div key={title} className="border border-border bg-surface p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary text-sm mb-1">{title}</p>
                    <p className="text-xs text-copy-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The True Cost Comparison</h2>
          <p>
            Let&apos;s be honest about what things actually cost:
          </p>

          <table className="w-full text-sm border border-border my-6">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Factor</th>
                <th className="text-left py-3 px-4 font-bold">Cheap Sealer (R700)</th>
                <th className="text-left py-3 px-4 font-bold">LAVA V.300 (R4,500)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Lifespan", "1–3 years", "15–20+ years"],
                ["Cost per year", "R230–R700/yr", "R225–R300/yr"],
                ["Seal reliability", "Inconsistent after 12 months", "Consistent for life of machine"],
                ["Spare parts available", "Usually not", "10+ years guaranteed"],
                ["Sealing on wet food", "Often fails", "Liquid Stop technology"],
                ["Resale value", "None", "Retains significant value"],
              ].map(([factor, cheap, lava]) => (
                <tr key={factor} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-semibold text-primary">{factor}</td>
                  <td className="py-2.5 px-4 text-copy-muted">{cheap}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary">{lava}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The V.300 — South Africa&apos;s Most Popular LAVA</h2>

          <div className="relative aspect-video bg-zinc-100 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/WFt1dapyhvk?rel=0&modestbranding=1"
              title="LAVA V.300 Premium Review"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mb-8">LAVA V.300 Premium — rated Very Good in independent testing</p>

          <p>
            The V.300 series has been LAVA&apos;s bestseller for over a decade, and for good reason.
            It hits the sweet spot between domestic and commercial capability:
          </p>
          <ul>
            <li><strong>42 cm sealing width</strong> — handles large roasts, full fish fillets, and bulk meat portions</li>
            <li><strong>Automatic and manual modes</strong> — let the machine decide, or control vacuum level yourself</li>
            <li><strong>Liquid Stop</strong> — seals marinades and wet meat without spills</li>
            <li><strong>Works with jars and containers</strong> — the jar attachment vacuums standard containers and mason jars</li>
            <li><strong>Brushed stainless steel lid</strong> — looks as good in 10 years as it does on day one</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Our Guarantee to You</h2>
          <p>
            Every LAVA machine sold by Lava-SA carries a <strong>2-year factory warranty</strong>.
            If anything goes wrong — we collect the machine, fix it, and return it. No argument.
            No hidden conditions.
          </p>
          <p>
            After warranty, we still stock spare parts. Sealing strips, liquid trap lids, vacuum seal
            sets — the parts that wear over time are all available. Because the machine shouldn&apos;t
            become landfill just because a seal strip wore out.
          </p>

        </div>

        {/* Product CTA */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 sm:col-span-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/spare-parts" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Spare Parts
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog/lava-family-business-germany-south-africa" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Our Story
          </Link>
          <Link href="/blog/embracing-sustainability-lava-quality" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Sustainability <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
