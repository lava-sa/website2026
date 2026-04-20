import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Leaf, Clock, ShieldCheck, TrendingDown, DollarSign, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Advantages of Vacuum Packaging — Why It's Worth It | Lava South Africa",
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
    title: "Flavour Locked In",
    desc: "Oxidation doesn't just spoil food — it degrades flavour long before the food becomes unsafe. Vacuum sealed food tastes exactly as good six months later as it did on the day it was sealed.",
    stat: "100%",
    statLabel: "flavour retention",
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

export default function AdvantagesPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary leading-tight">
            Advantages of Vacuum Packaging
          </h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            A single technology that extends shelf life, reduces waste, saves money, enables
            sous vide cooking and transforms your approach to food storage. Here&apos;s
            everything vacuum packaging does for you.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/header-005.jpg" alt="Vacuum sealed vegetables and food" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-6">The Science in One Sentence</h2>
          <div className="bg-primary text-white p-6 mb-10">
            <p className="text-lg font-semibold leading-relaxed">
              Vacuum packaging removes oxygen — the molecule responsible for oxidation, bacterial
              growth, freezer burn and flavour degradation — and replaces it with nothing.
              No oxygen. No spoilage mechanism.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-6">The Six Core Advantages</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {advantages.map(({ icon: Icon, title, desc, stat, statLabel }) => (
              <div key={title} className="border border-border bg-surface p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-9 w-9 bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-primary leading-snug">{title}</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-black text-secondary">{stat}</span>
                      <span className="text-[10px] text-copy-muted font-medium">{statLabel}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-copy leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Advantage 7: Sous Vide — Unlocked</h2>
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

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Vacuum Packaging vs Other Methods</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Method</th>
                  <th className="text-left py-3 px-4 font-bold">Shelf Life Extension</th>
                  <th className="text-left py-3 px-4 font-bold">Flavour Preservation</th>
                  <th className="text-left py-3 px-4 font-bold">Sous Vide</th>
                  <th className="text-left py-3 px-4 font-bold">Reusable</th>
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

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Who Benefits Most?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              ["Hunters & Game Processors", "Process a full animal after a hunt and store 100+ kg with zero waste — for 2+ years."],
              ["Fishermen", "Seal snoek, yellowtail or kingklip the same day and still have excellent fish 12 months later."],
              ["Home Cooks & Meal Preppers", "Batch cook on Sundays, seal portions, have restaurant-quality meals all week."],
              ["Butcheries & Delis", "Extend display life of cuts, reduce shrinkage, improve presentation and hygiene."],
              ["Biltong & Charcuterie Makers", "Seal finished products for extended shelf life and distribution."],
              ["Load-Shedding-Affected Households", "Bulk buy when prices are good, seal, and stop losing food to power outages."],
            ].map(([who, why]) => (
              <div key={who} className="flex items-start gap-2 border border-border p-4">
                <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-primary text-sm">{who}</p>
                  <p className="text-xs text-copy-muted mt-0.5 leading-relaxed">{why}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 sm:col-span-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/vacuum-packaging/shelf-life-chart" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shelf Life Chart
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
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
        </div>

      </div>
    </main>
  );
}
