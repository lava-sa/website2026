import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, TrendingDown, DollarSign, Zap, Leaf } from "lucide-react";
import FeatureCard from "@/components/content/FeatureCard";
import AudienceCard from "@/components/content/AudienceCard";
import { slugifyHeadingId } from "@/lib/content/slugify-heading-id";

export const metadata: Metadata = {
  title: "Advantages of Vacuum Packaging — Why It's Worth It",
  description:
    "Food lasts 3–5× longer, less waste, better flavour, sous vide capability — the complete guide to what vacuum packaging actually gives you.",
};

const advantages = [
  {
    icon: Clock,
    title: "Food Lasts 3–5× Longer",
    desc: "The single biggest benefit. Remove oxygen, remove the environment for oxidation and aerobic bacteria. Meat that lasts 3–5 days in the fridge lasts 10–14 days vacuum sealed. Freezer life goes from months to years.",
    stat: "3–5×",
    statLabel: "longer shelf life",
  },
  {
    icon: TrendingDown,
    title: "Dramatically Reduces Food Waste",
    desc: "South Africa wastes 10 million tonnes of food per year. Most household waste is fresh food that spoiled before it was eaten. Vacuum sealing gives you the time to use what you buy.",
    stat: "10M",
    statLabel: "tonnes wasted in SA/year",
  },
  {
    icon: DollarSign,
    title: "Bulk Buying Becomes Practical",
    desc: "Meat on special? Buy 5 kg, portion and seal. Coffee at a good price? Buy 2 kg and seal it. Vacuum sealing turns bulk purchasing from a gamble into a reliable strategy.",
    stat: "40%",
    statLabel: "average saving buying in bulk",
  },
  {
    icon: ShieldCheck,
    title: "Flavour Noticeably Preserved",
    desc: "Oxidation degrades flavour long before food becomes unsafe. By reducing residual oxygen to under 1%, LAVA machines dramatically slow this process — sealed food stays noticeably fresher-tasting far longer than conventional freezer bags.",
    stat: "<1%",
    statLabel: "residual oxygen after sealing",
  },
  {
    icon: Zap,
    title: "Vacuum Marinating",
    desc: "Seal meat in a marinade and vacuum pressure forces the liquid into the cellular structure of the meat. 20–30 minutes of vacuum marinating equals overnight conventional marinating.",
    stat: "30 min",
    statLabel: "vs overnight marinating",
  },
  {
    icon: Leaf,
    title: "Sous Vide Cooking",
    desc: "Sous vide requires vacuum-sealed food. Precision low-temperature cooking in a water bath gives restaurant-quality results with zero risk of overcooking. Every sous vide recipe starts with a LAVA seal.",
    stat: "±0.1°C",
    statLabel: "precision cooking temperature",
  },
];

const audiences = [
  ["Hunters & Game Processors", "Process a full animal after a hunt and store 100+ kg with zero waste — for 2+ years."],
  ["Fishermen", "Seal snoek, yellowtail or kingklip the same day and still have excellent fish 12 months later."],
  ["Home Cooks & Meal Preppers", "Batch cook on Sundays, seal portions, have restaurant-quality meals all week."],
  ["Butcheries & Delis", "Extend display life of cuts, reduce shrinkage, improve presentation and hygiene."],
  ["Biltong & Charcuterie Makers", "Seal finished products for extended shelf life and distribution."],
  ["Load-Shedding-Affected Households", "Bulk buy when prices are good, seal, and stop losing food to power outages."],
] as const;

export default function AdvantagesPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <header className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary leading-tight">
            Advantages of Vacuum Packaging
          </h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            A single technology that extends shelf life, reduces waste, saves money, enables
            sous vide cooking and transforms your approach to food storage. Here&apos;s
            everything vacuum packaging does for you.
          </p>
        </header>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/header-005.jpg" alt="Vacuum sealed vegetables and food" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <section id="how-vacuum-packaging-works" aria-labelledby="science-heading">
            <h2 id="science-heading" className="text-2xl font-bold text-primary mt-2 mb-6">
              How Does Vacuum Packaging Preserve Food?
            </h2>
            <div className="bg-primary text-white p-6 mb-10">
              <p className="text-lg font-semibold leading-relaxed">
                Vacuum packaging removes oxygen — the molecule responsible for oxidation, bacterial
                growth, freezer burn and flavour degradation — and replaces it with nothing.
                No oxygen. No spoilage mechanism.
              </p>
            </div>
          </section>

          <section id="core-advantages" aria-labelledby="advantages-heading">
            <h2 id="advantages-heading" className="text-2xl font-bold text-primary mt-8 mb-6">
              What Are the Main Advantages of Vacuum Sealing Food?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {advantages.map((item) => (
                <FeatureCard
                  key={item.title}
                  id={slugifyHeadingId(item.title)}
                  icon={item.icon}
                  title={item.title}
                  description={item.desc}
                  stat={item.stat}
                  statLabel={item.statLabel}
                />
              ))}
            </div>
          </section>

          <section id="sous-vide-advantage" aria-labelledby="sous-vide-heading">
            <h2 id="sous-vide-heading" className="text-2xl font-bold text-primary mt-10 mb-4">
              Can Vacuum Packaging Unlock Sous Vide Cooking at Home?
            </h2>
            <div className="relative aspect-video bg-zinc-100 mb-4">
              <iframe
                src="https://www.youtube-nocookie.com/embed/XEdT5cCNiwk?rel=0&modestbranding=1"
                title="LAVA Vacuum Packing Fish for Sous Vide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <p className="text-xs text-copy-muted mb-6">Vacuum sealing fish for sous vide precision cooking — in English</p>
          </section>

          <section id="comparison-table" aria-labelledby="comparison-heading">
            <h2 id="comparison-heading" className="text-2xl font-bold text-primary mt-10 mb-4">
              How Does Vacuum Packaging Compare to Cling Wrap and Freezer Bags?
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-primary text-white">
                    <th scope="col" className="text-left py-3 px-4 font-bold">Method</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Shelf Life Extension</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Flavour Preservation</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Sous Vide</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Reusable</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Vacuum sealing (LAVA)", "3–5×", "Excellent", "Yes", "Bags: 2–3×"],
                    ["Cling wrap", "1.2×", "Poor — dries out", "No", "No"],
                    ["Ziplock bags", "1.5×", "Fair", "No", "Limited"],
                    ["Tupperware / containers", "1.3–1.5×", "Good for dry", "No", "Yes"],
                    ["Foil wrapping", "1.2×", "Fair", "No", "No"],
                    ["Freezer bags (standard)", "1.5×", "Fair", "No", "No"],
                  ].map(([method, shelf, flavour, sv, reuse]) => (
                    <tr key={method} className="border-b border-border odd:bg-surface">
                      <td className="py-2.5 px-4 font-semibold text-primary">{method}</td>
                      <td className="py-2.5 px-4 font-semibold text-secondary">{shelf}</td>
                      <td className="py-2.5 px-4 text-copy">{flavour}</td>
                      <td className="py-2.5 px-4 text-copy">{sv}</td>
                      <td className="py-2.5 px-4 text-copy">{reuse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="who-benefits" aria-labelledby="audience-heading">
            <h2 id="audience-heading" className="text-2xl font-bold text-primary mt-10 mb-4">
              Who Benefits Most From a LAVA Vacuum Sealer in South Africa?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {audiences.map(([who, why]) => (
                <AudienceCard
                  key={who}
                  id={slugifyHeadingId(who)}
                  title={who}
                  description={why}
                />
              ))}
            </div>
          </section>

        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 sm:col-span-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/vacuum-packaging/shelf-life-chart" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shelf Life Chart
          </Link>
        </div>

        <nav className="mt-10 pt-8 border-t border-border" aria-label="Related vacuum packaging guides">
          <p className="text-xs font-black uppercase tracking-widest text-copy-muted mb-4">More Vacuum Packaging Guides</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Shelf Life Chart", "/vacuum-packaging/shelf-life-chart"],
              ["Our Vacuum Bags", "/vacuum-packaging/bags-guide"],
              ["Expert Tips", "/vacuum-packaging/expert-tips"],
              ["Dry Aging Guide", "/vacuum-packaging/dry-aging"],
              ["Meat Aging", "/vacuum-packaging/meat-aging"],
              ["Gift Ideas", "/vacuum-packaging/gift-ideas"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-secondary shrink-0" /> {label}
              </Link>
            ))}
          </div>
        </nav>

      </div>
    </main>
  );
}
