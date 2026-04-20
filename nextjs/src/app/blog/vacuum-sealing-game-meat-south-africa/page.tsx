import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Hunter's Guide to Vacuum Sealing Game Meat in South Africa | Lava Blog",
  description:
    "Blesbok, kudu, impala, warthog — how to process, portion and vacuum seal wild game properly so nothing goes to waste after the hunt. Includes species-specific tips and a step-by-step guide.",
};

const speciesData = [
  ["Blesbok", "Medium", "3–5 days", "2–3 years", "Excellent mild flavour. Minimal fat — seal quickly after processing."],
  ["Kudu", "Large", "3–5 days", "2–3 years", "Premium venison. Trim sinew from steaks before sealing. Backstrap is exceptional sous vide."],
  ["Impala", "Small", "3–4 days", "2 years", "Lean and tender. Ideal for vacuum marinating — takes 30 min vs overnight."],
  ["Springbok", "Small", "3–4 days", "2 years", "South Africa's finest. Very lean — seal whole fillets for sous vide cooking."],
  ["Warthog", "Medium", "3–5 days", "2 years", "Stronger flavour. Benefits from vacuum marinating with citrus/vinegar before cooking."],
  ["Wildebeest", "Large", "3–5 days", "2–3 years", "Coarser grain. Best diced for stews or minced. Trim fat before long-term storage."],
  ["Bushpig", "Medium", "3–4 days", "18 months", "Treat like pork. Seal fat-on roasts for braai prep; trim fat for long-term storage."],
  ["Eland", "Large", "3–5 days", "2–3 years", "Most beef-like of all venison. Vacuum-sealed eland rump rivals commercial beef easily."],
];

export default function PostGameMeat() {
  const articleLd = articleSchema({
    title: "The Hunter's Guide to Vacuum Sealing Game Meat in South Africa",
    description:
      "Blesbok, kudu, impala, warthog — how to process, portion and vacuum seal wild game properly so nothing goes to waste after the hunt. Includes species-specific tips and a step-by-step guide.",
    url: "/blog/vacuum-sealing-game-meat-south-africa",
    datePublished: "2026-03-15",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Hunting & Game</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            The Hunter&apos;s Guide to Vacuum Sealing Game Meat in South Africa
          </h1>
          <p className="text-copy-muted text-sm">6 April 2026 · 6 min read</p>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            You&apos;ve done the hunt. Now comes the part that determines whether that blesbok
            backstrap is still exceptional in July, or becomes freezer-burned waste by March.
            Here&apos;s everything you need to know about processing and preserving game meat
            the right way.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/header-001.jpg" alt="Vacuum sealed game meat and cuts" fill className="object-cover" />
        </div>

        {/* Featured video */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch: LAVA for Hunters & Fishermen</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/yaf_L7C6N6U?rel=0&modestbranding=1"
              title="LAVA Vacuum Sealer for Hunters and Fishermen"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mt-2">In English — LAVA rated best-in-test for hunting and fishing applications</p>
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">Why Game Meat Needs Proper Vacuum Sealing</h2>
          <p>
            Wild game is not commercially processed meat. It has almost no fat marbling to
            protect the surface, it&apos;s been through stress hormones at the point of harvest,
            and it arrives at your cold room in irregular shapes and sizes. <strong>Standard freezer
            bags and cling wrap are completely inadequate for long-term game meat storage.</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="border border-red-200 bg-red-50 p-4">
              <p className="font-bold text-red-800 text-sm mb-2">❌ Without vacuum sealing</p>
              <ul className="text-xs text-red-700 space-y-1 pl-4 list-disc">
                <li>Freezer burn within 2–3 months</li>
                <li>Surface discolouration and texture loss</li>
                <li>Flavour loss from oxidation of game fat</li>
                <li>Moisture loss making lean meat dry and tough</li>
                <li>Cross-contamination risk from loose bags</li>
              </ul>
            </div>
            <div className="border border-green-200 bg-green-50 p-4">
              <p className="font-bold text-green-800 text-sm mb-2">✅ With LAVA vacuum sealing</p>
              <ul className="text-xs text-green-700 space-y-1 pl-4 list-disc">
                <li>2–3 years in the freezer with no quality loss</li>
                <li>Colour and texture preserved to day-1 quality</li>
                <li>No oxidation or rancid fat</li>
                <li>Moisture locked in — stays as juicy as fresh</li>
                <li>Clean, odour-free organisation in the freezer</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Step-by-Step: Field to Freezer</h2>

          <div className="space-y-4 my-6">
            {[
              {
                step: "1",
                title: "Cool the carcass completely",
                detail: "Never vacuum seal warm meat. Get the carcass into a cold room or on ice as quickly as possible after the hunt. The meat should be at or below 4°C before processing. Sealing warm meat traps residual heat and gases — it will look grey and puffy in the bag."
              },
              {
                step: "2",
                title: "Hang for the right time",
                detail: "Most game meat benefits from 24–48 hours of hanging at 0–4°C before processing. This allows rigor mortis to resolve and enzymes to tenderise the meat. Kudu and eland benefit most from longer hanging (3–5 days). Impala and springbok can be processed after 24 hours."
              },
              {
                step: "3",
                title: "Butcher into meal-sized portions",
                detail: "Think in meal sizes when cutting — 500g for two people, 1kg for four. Vacuum sealing makes perfect portioning easy. Once sealed and frozen, you won't want to defrost a 3kg roast when you only need 500g of strips."
              },
              {
                step: "4",
                title: "Trim and surface-dry",
                detail: "Remove excess sinew, silver skin and damaged sections. Pat portions dry with paper towel — surface moisture reduces seal quality. If the meat has any blood pooling, blot it out. A dry surface gives you the cleanest vacuum and seal."
              },
              {
                step: "5",
                title: "Seal with your LAVA machine",
                detail: "Use embossed vacuum bags — the channel pattern is essential for the pump to extract air evenly. For wet or moist cuts, use the Liquid Stop function. Seal mince in flat blocks for fast defrosting. Double-seal the bag for extra security on long-term freezer storage."
              },
              {
                step: "6",
                title: "Label clearly and freeze flat",
                detail: "Write species, cut, weight and date on the bag before sealing (a marker on the bag works). Freeze flat first — once solid, stacked bags take up a fraction of the space of randomly-shaped packages."
              },
            ].map(({ step, title, detail }) => (
              <div key={step} className="flex gap-4 border border-border p-5">
                <div className="h-10 w-10 bg-primary text-white font-black text-lg flex items-center justify-center shrink-0">{step}</div>
                <div>
                  <p className="font-bold text-primary mb-1">{title}</p>
                  <p className="text-sm text-copy leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Species Guide — Sealing & Storage Notes</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Species</th>
                  <th className="text-left py-3 px-4 font-bold">Carcass Size</th>
                  <th className="text-left py-3 px-4 font-bold">Fridge Life</th>
                  <th className="text-left py-3 px-4 font-bold text-secondary">Vacuum Frozen</th>
                  <th className="text-left py-3 px-4 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {speciesData.map(([species, size, fridge, frozen, notes]) => (
                  <tr key={species} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 font-bold text-primary">{species}</td>
                    <td className="py-2.5 px-4 text-copy-muted">{size}</td>
                    <td className="py-2.5 px-4 text-copy-muted">{fridge}</td>
                    <td className="py-2.5 px-4 font-semibold text-secondary">{frozen}</td>
                    <td className="py-2.5 px-4 text-xs text-copy leading-relaxed">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Vacuum Marinating — The Game Changer</h2>
          <p>
            Game meat is lean and benefits enormously from marinating. But the traditional
            method — submerging in marinade overnight — is slow and uneven. <strong>Vacuum
            marinating reduces this to 20–30 minutes.</strong>
          </p>
          <p>
            Here&apos;s how it works: when you vacuum seal meat in a bag with a marinade and
            apply vacuum pressure, the cells of the meat expand slightly as air is removed.
            When the vacuum releases, the marinade is forced into those cells. One cycle of this
            equals many hours of conventional marinating.
          </p>
          <ul>
            <li>Add impala or springbok loin to a bag with olive oil, rosemary, garlic and lemon</li>
            <li>Vacuum seal and leave for 20–30 minutes at room temperature</li>
            <li>Cook immediately — or refrigerate sealed for up to 12 days</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Which LAVA Machine for Serious Hunters?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {[
              {
                model: "LAVA V.300 Premium",
                best: "Home hunter processing up to one or two animals per season",
                seal: "42 cm sealing width",
                features: ["Liquid Stop for wet cuts", "Pressure control for delicate items", "Works with jars and containers", "2-year warranty"],
                href: "/products/vacuum-machines"
              },
              {
                model: "LAVA V.400 Premium",
                best: "Serious hunter, farmers market supplier, or multiple hunters sharing a machine",
                seal: "50 cm sealing width",
                features: ["Commercial-grade vacuum pump", "Faster cycle time", "50 cm bags for large roasts and whole legs", "Stainless steel construction throughout"],
                href: "/products/vacuum-machines"
              },
            ].map(({ model, best, seal, features, href }) => (
              <div key={model} className="border border-border p-5">
                <p className="font-bold text-primary text-base mb-1">{model}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-3">{seal}</p>
                <p className="text-xs text-copy-muted mb-3 leading-relaxed"><strong>Best for:</strong> {best}</p>
                <ul className="text-xs text-copy space-y-1">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={href} className="mt-4 block text-center bg-primary text-white text-xs font-bold py-2.5 hover:bg-primary/90 transition-colors">
                  View Machine →
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border p-5 mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Pro Tip: Bag Size for Game Meat</p>
            <p className="text-sm text-copy leading-relaxed">
              For most game cuts, <strong>20×30 cm bags</strong> are ideal for 500g–1kg portions.
              For whole rumps, large roasts or multiple chops, use <strong>25×40 cm or 30×60 cm bags</strong>.
              LAVA vacuum rolls let you cut custom lengths — perfect for awkwardly-shaped game cuts.
              View our <Link href="/products/bags-rolls" className="text-secondary font-semibold hover:text-primary transition-colors">full range of bags and rolls →</Link>
            </p>
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/bags-rolls" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shop Vacuum Bags & Rolls
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog/how-long-does-vacuum-sealed-food-last" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Shelf Life Guide
          </Link>
          <Link href="/blog/vacuum-sealing-fish-south-africa" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Fish Guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
