import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, X } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best Vacuum Sealer in South Africa 2026 — Honest Comparison Guide",
  description:
    "What to look for, what to avoid, and which LAVA model fits your needs and budget. An honest guide from South Africa's official LAVA distributor. Includes comparison table and video.",
};

const models = [
  {
    name: "LAVA V.100® Premium X",
    subtitle: "Entry Level",
    price: "Entry",
    best: "First-time buyers, smaller households, light use",
    sealWidth: "30 cm",
    pump: "Domestic",
    liquidStop: true,
    jarAttachment: false,
    pressureControl: false,
    commercialUse: false,
    href: "/products/vacuum-machines",
    badge: "",
  },
  {
    name: "LAVA V.300® Premium X",
    subtitle: "Most Popular",
    price: "Mid-range",
    best: "Most South African homes, hunters, fishermen, home chefs",
    sealWidth: "42 cm",
    pump: "Domestic+",
    liquidStop: true,
    jarAttachment: true,
    pressureControl: true,
    commercialUse: false,
    href: "/products/vacuum-machines",
    badge: "Best Seller",
  },
  {
    name: "LAVA V.333® Chrome",
    subtitle: "Entry Commercial",
    price: "Upper mid-range",
    best: "Small butcheries, delis, serious home processors",
    sealWidth: "42 cm",
    pump: "Commercial",
    liquidStop: true,
    jarAttachment: true,
    pressureControl: true,
    commercialUse: true,
    href: "/products/vacuum-machines",
    badge: "",
  },
  {
    name: "LAVA V.400® Premium",
    subtitle: "Commercial",
    price: "Commercial",
    best: "Butcheries, catering, farmers markets, heavy use",
    sealWidth: "50 cm",
    pump: "Heavy Commercial",
    liquidStop: true,
    jarAttachment: true,
    pressureControl: true,
    commercialUse: true,
    href: "/products/vacuum-machines",
    badge: "",
  },
];

const badBuyers = [
  "Plastic lid that cracks within 18 months — look for stainless steel",
  "Single sealing strip — leads to failed seals on heavy or wet bags",
  "No Liquid Stop — any moist food risks damaging the pump",
  "No spare parts — when the sealing strip wears out (and it will), the machine is scrapped",
  "Thin hose connectors that snap — the first sign of poor component quality",
  "No South African warranty support — if something goes wrong, you're on your own",
];

export default function PostBuyingGuide() {
  const articleLd = articleSchema({
    title: "Best Vacuum Sealer in South Africa 2026 — Honest Comparison Guide",
    description:
      "What to look for, what to avoid, and which LAVA model fits your needs and budget. An honest guide from South Africa's official LAVA distributor. Includes comparison table and video.",
    url: "/blog/best-vacuum-sealer-south-africa-2026",
    datePublished: "2026-03-25",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Buying Guide</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            Best Vacuum Sealer in South Africa 2026 — An Honest Guide
          </h1>
          <p className="text-copy-muted text-sm">11 April 2026 · 8 min read</p>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            There are hundreds of vacuum sealers on the market. Most of them are the same
            Chinese hardware in different boxes. Some are genuinely excellent machines. Here&apos;s
            how to tell the difference — and which LAVA is right for you.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/lava-0009.jpg" alt="LAVA V333 Chrome with containers and accessories" fill className="object-cover" />
        </div>

        {/* Video */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch: Which Machine is Right for You?</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/4Ut74sEOf1I?rel=0&modestbranding=1"
              title="The Ultimate Guide: Which Vacuum Sealer is Right for You?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mt-2">In English — the complete LAVA buying guide in under 2 minutes</p>
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">The Honest Truth About Cheap Vacuum Sealers</h2>
          <p>
            South Africans are practical people. If a R700 machine did the same job as a R4,500
            machine, we&apos;d all buy the R700 one. The problem is it doesn&apos;t — and the
            cost of that difference is paid over 2–3 years, not at purchase.
          </p>
          <p>
            Here&apos;s what typically happens with budget vacuum sealers:
          </p>
          <ul>
            <li><strong>Month 1–6:</strong> Works fine. You&apos;re happy with the purchase.</li>
            <li><strong>Month 6–12:</strong> Sealing strip starts to compress unevenly. Some seals fail. You compensate by double-sealing everything.</li>
            <li><strong>Month 12–18:</strong> The lid latch mechanism becomes unreliable. You start to lose faith in your seals.</li>
            <li><strong>Month 18–24:</strong> The machine fails entirely, or seals so inconsistently it&apos;s not worth using.</li>
            <li><strong>Year 2–3:</strong> You buy another machine. The cycle repeats.</li>
          </ul>
          <p>
            Buy two of them over five years and you&apos;ve spent R1,400. And more importantly,
            you&apos;ve lost food to failed seals — food you trusted was protected. A LAVA V.300
            purchased today will likely outlast 15 budget sealers.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">7 Things to Check Before Buying Any Vacuum Sealer</h2>

          <div className="space-y-3 my-6">
            {[
              { n: "1", title: "Lid material", detail: "Stainless steel lid = quality machine. Plastic lid = budget machine. The lid takes hundreds of impacts per year and must maintain an airtight seal against the sealing bar. Plastic warps and cracks. Stainless doesn't." },
              { n: "2", title: "Number of sealing strips", detail: "Two sealing strips create a double seal — one melts, one reinforces. Single-strip machines work initially but fail faster with wet or heavy bags. LAVA uses dual strips on all models." },
              { n: "3", title: "Liquid Stop technology", detail: "Essential for South African use — game meat, fish, marinated meat. Without it, any moisture entering the vacuum hose damages or destroys the pump. Non-negotiable." },
              { n: "4", title: "Spare parts availability", detail: "Ask the supplier: can I buy a replacement sealing strip in 5 years? With LAVA, the answer is always yes. With most budget brands, the answer is no." },
              { n: "5", title: "Vacuum gauge / pressure control", detail: "A pressure gauge shows you what's happening inside the bag. Pressure control lets you set the vacuum level for delicate foods. Without it, you're guessing." },
              { n: "6", title: "Sealing width", detail: "Most domestic bags are 20–30 cm wide. If you seal game meat, whole fish or large roasts, you need at least 42 cm. Check the machine's maximum sealing width before buying." },
              { n: "7", title: "South African warranty support", detail: "A warranty from a company in Germany is useless if the local distributor doesn't back it. Lava-SA provides full in-country warranty support — we collect, repair and return." },
            ].map(({ n, title, detail }) => (
              <div key={n} className="flex gap-4 border border-border p-5">
                <div className="h-9 w-9 bg-primary text-white font-black text-sm flex items-center justify-center shrink-0 rounded-full">{n}</div>
                <div>
                  <p className="font-bold text-primary mb-1">{title}</p>
                  <p className="text-sm text-copy leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">6 Warning Signs of a Poor-Quality Vacuum Sealer</h2>
          <div className="border border-red-200 bg-red-50 p-5 my-6">
            <ul className="space-y-2">
              {badBuyers.map((sign) => (
                <li key={sign} className="flex items-start gap-2 text-sm text-red-800">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">LAVA Range Comparison — South Africa 2026</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Feature</th>
                  {models.map(m => (
                    <th key={m.name} className="text-left py-3 px-4 font-bold">
                      {m.name.replace("LAVA ", "")}<br />
                      <span className="font-normal text-white/70 text-xs">{m.subtitle}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Best for", key: "best" },
                  { label: "Sealing width", key: "sealWidth" },
                  { label: "Pump grade", key: "pump" },
                ].map(({ label, key }) => (
                  <tr key={label} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 font-semibold text-primary">{label}</td>
                    {models.map(m => (
                      <td key={m.name} className="py-2.5 px-4 text-copy text-xs">{m[key as keyof typeof m] as string}</td>
                    ))}
                  </tr>
                ))}
                {[
                  { label: "Liquid Stop", key: "liquidStop" },
                  { label: "Jar attachment", key: "jarAttachment" },
                  { label: "Pressure control", key: "pressureControl" },
                  { label: "Commercial use", key: "commercialUse" },
                ].map(({ label, key }) => (
                  <tr key={label} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 font-semibold text-primary">{label}</td>
                    {models.map(m => (
                      <td key={m.name} className="py-2.5 px-4">
                        {m[key as keyof typeof m]
                          ? <CheckCircle className="h-4 w-4 text-secondary" />
                          : <X className="h-4 w-4 text-copy-muted" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Our Honest Recommendation by Use Case</h2>
          <div className="space-y-3 my-6">
            {[
              { useCase: "I'm new to vacuum sealing and want to try it out", rec: "V.100® Premium X", reason: "Full LAVA quality at entry-level price. If you love it (you will), upgrade to the V.300 later." },
              { useCase: "I cook regularly and want the best domestic machine", rec: "V.300® Premium X", reason: "South Africa's most popular LAVA. Handles everything a serious home cook or hunter needs." },
              { useCase: "I hunt 1–2 seasons per year and process 50–150 kg of game", rec: "V.300® Premium X or V.333® Chrome", reason: "V.300 if you process over a few days. V.333 if you process a full animal in one session." },
              { useCase: "I run a butchery, deli or catering operation", rec: "V.400® Premium or V.500® Premium", reason: "Commercial pump rated for all-day use. 50 cm+ sealing width for whole legs and large primals." },
              { useCase: "I want to vacuum seal jars, containers and wine bottles too", rec: "V.300® Premium X+", reason: "Any V.300 or above with the jar attachment handles all container types." },
            ].map(({ useCase, rec, reason }) => (
              <div key={useCase} className="border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">If...</p>
                <p className="text-sm text-copy mb-2 italic">&ldquo;{useCase}&rdquo;</p>
                <p className="font-bold text-primary text-sm">→ {rec}</p>
                <p className="text-xs text-copy-muted mt-1 leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>

        </div>

        <div className="mt-16 bg-primary text-white p-8 text-center">
          <p className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Ready to Choose?</p>
          <h3 className="text-2xl font-bold mb-3">View the Full LAVA Range</h3>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-6">Every machine comes with a 2-year factory warranty, in-country support from Anneke and Wilco, and a promise that spare parts will be available for 10+ years.</p>
          <Link href="/products/vacuum-machines" className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-8 py-3 hover:bg-secondary/90 transition-colors">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog/vacuum-sealing-during-load-shedding" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Load Shedding Guide
          </Link>
          <Link href="/blog" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            All Articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
