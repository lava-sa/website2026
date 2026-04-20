import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Vacuum Seal Fish After a Day on the Water | Lava Blog",
  description:
    "Snoek, yellowtail, cob, kingklip — how to handle, fillet, portion and vacuum seal fresh catch the right way. Includes species guide, step-by-step instructions and LAVA video.",
};

const fishData = [
  ["Snoek", "1–2 days", "5–7 days", "2–3 months", "12–15 months", "Strong oily fish. Blot well. Seal individual portions. Excellent smoked then vacuum sealed."],
  ["Yellowtail", "1–2 days", "5–7 days", "2–3 months", "12–15 months", "Premium eating. Vac-seal fillets flat for sous vide. Minimal trimming needed."],
  ["Cob / Kabeljou", "1–2 days", "5–7 days", "3 months", "15–18 months", "Mild white fish. Seal thick portions. Ideal for vacuum marinating before braai."],
  ["Kingklip", "1 day", "4–5 days", "2 months", "12 months", "Delicate texture — handle carefully. Use smooth bags for odd-shaped pieces."],
  ["Tuna / Skipjack", "1 day", "3–5 days", "2–3 months", "12–15 months", "High oil content means faster oxidation. Seal same day. Excellent quality sealed."],
  ["Trout (farmed)", "2–3 days", "7–10 days", "3–4 months", "18 months", "Lower oil. Blot dry. Fillets can be stacked if separated by baking paper."],
  ["Prawns / Scampi", "1–2 days", "5–6 days", "3–4 months", "12–15 months", "Use Liquid Stop function. Seal in portions by count (e.g., 12 per bag). Don't overcook after sealing."],
  ["Mussels / Oysters", "1 day", "2–3 days", "2 months", "6 months", "Seal cooked only. Raw bivalves require live storage. Use Liquid Stop."],
];

export default function PostFish() {
  const articleLd = articleSchema({
    title: "How to Vacuum Seal Fish After a Day on the Water",
    description:
      "Snoek, yellowtail, cob, kingklip — how to handle, fillet, portion and vacuum seal fresh catch the right way. Includes species guide, step-by-step instructions and LAVA video.",
    url: "/blog/vacuum-sealing-fish-south-africa",
    datePublished: "2026-03-08",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Fishing</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            How to Vacuum Seal Fish After a Day on the Water
          </h1>
          <p className="text-copy-muted text-sm">8 April 2026 · 5 min read</p>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            A great day&apos;s fishing deserves great fish six months later. Here&apos;s the
            complete guide to handling, filleting, portioning and vacuum sealing South African
            catch — from snoek on the West Coast to yellowtail off Hermanus.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/lava-0004.jpg" alt="LAVA vacuum sealer with fresh fish" fill className="object-cover" />
        </div>

        {/* Video */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch: Vacuum-Packing Fish & Salmon</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/XEdT5cCNiwk?rel=0&modestbranding=1"
              title="Vacuum Packing Fish and Salmon with LAVA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mt-2">In English — sealing fish fillets for sous vide and long-term freezer storage</p>
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">Why Fish Needs Vacuum Sealing More Than Any Other Food</h2>
          <p>
            Fish is the most perishable protein you can handle. The enzymes that break down
            fish tissue are extremely active even at refrigeration temperatures — and fish fat
            oxidises faster than beef or pork fat, which is why loose frozen fish develops
            that &ldquo;fishy&rdquo; off-flavour within weeks.
          </p>
          <p>
            Vacuum sealing addresses both problems simultaneously: it removes the oxygen that
            drives oxidation, and it eliminates the freezer-air contact that causes surface
            deterioration. <strong>A snoek vacuum sealed the same day it&apos;s caught is
            indistinguishable from fresh after 12 months. Left in a standard bag, it&apos;s
            barely edible at three months.</strong>
          </p>

          <div className="bg-primary/5 border border-primary/20 p-5 my-6">
            <p className="font-bold text-primary mb-2">The Cold Chain Matters</p>
            <p className="text-sm text-copy leading-relaxed">
              Vacuum sealing on the boat — or as soon as you get home — gives dramatically better
              results than sealing the next day. Every hour at ambient temperature accelerates
              enzyme activity. Ice is not a substitute for speed: get the fish cold and sealed
              as fast as possible.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Step by Step: Dock to Freezer</h2>

          <div className="space-y-4 my-6">
            {[
              { step: "1", title: "Bleed immediately after catch", detail: "Ike-jime or standard spiking dramatically improves flesh quality. Bleeding removes the enzymes most responsible for rapid deterioration. This step makes more difference to final quality than almost anything else." },
              { step: "2", title: "Ice down in a clean cooler", detail: "Use enough ice to keep the fish at 0–2°C. Don't let fish sit in meltwater — it introduces bacteria. Use a cooler with a drain plug and keep it drained." },
              { step: "3", title: "Scale, gut and fillet at home", detail: "Rinse the fish under cold water after gutting. Inspect the flesh for any bruising or damage from the catch. Fillet into portions appropriate for your household's meals — 250g per person is standard." },
              { step: "4", title: "Blot surfaces completely dry", detail: "This is critical for fish. Wet surfaces prevent a clean vacuum seal — the machine will leave air pockets at moisture-rich areas. Use paper towel on all cut surfaces and skin. For very oily fish like snoek or yellowtail, two or three rounds of blotting." },
              { step: "5", title: "Choose the right bag size", detail: "A single fillet typically fits in a 20×30 cm bag. Multiple portions can share a bag if separated by a fold of baking paper. For oddly-shaped pieces (frames, collars), cut custom lengths from a LAVA vacuum roll." },
              { step: "6", title: "Seal with Liquid Stop enabled", detail: "Even after thorough blotting, fish releases moisture during vacuuming. The LAVA Liquid Stop function detects liquid entering the hose and cuts the vacuum before it causes problems. Use it for all fish and seafood." },
              { step: "7", title: "Freeze flat, stack once solid", detail: "Lay bags flat in the freezer on a tray. Once frozen solid (12–24 hours), stacked flat bags take up a fraction of the space of loose packets and stack neatly in bins." },
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

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">South African Species Guide</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Fish</th>
                  <th className="text-left py-3 px-4 font-bold">Fridge</th>
                  <th className="text-left py-3 px-4 font-bold text-secondary">Fridge + Vac</th>
                  <th className="text-left py-3 px-4 font-bold">Frozen</th>
                  <th className="text-left py-3 px-4 font-bold text-secondary">Frozen + Vac</th>
                  <th className="text-left py-3 px-4 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {fishData.map(([fish, fridge, fridgeV, frozen, frozenV, notes]) => (
                  <tr key={fish} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 font-bold text-primary">{fish}</td>
                    <td className="py-2.5 px-4 text-copy-muted">{fridge}</td>
                    <td className="py-2.5 px-4 font-semibold text-secondary">{fridgeV}</td>
                    <td className="py-2.5 px-4 text-copy-muted">{frozen}</td>
                    <td className="py-2.5 px-4 font-semibold text-secondary">{frozenV}</td>
                    <td className="py-2.5 px-4 text-xs text-copy leading-relaxed">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Smoked Snoek — The Vacuum Sealing Sweet Spot</h2>
          <div className="relative aspect-video bg-zinc-100 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/CgLjpQiMscw?rel=0&modestbranding=1"
              title="Vakuumierer V.200 - Räucherfisch vakuumieren"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mb-4">Vacuum sealing smoked fish (German audio, English subtitles available)</p>
          <p>
            Smoked snoek is one of those South African foods that deserves better than cling
            wrap in a drawer. Vacuum sealed smoked snoek keeps <strong>4–6 weeks in the fridge
            and 12 months in the freezer</strong> — without losing any of that distinctive smoke
            flavour to oxidation.
          </p>
          <ul>
            <li>Cool smoked snoek completely before sealing</li>
            <li>Remove bones where possible — they can puncture bags</li>
            <li>Portion as you would serve it — 200–300g per portion</li>
            <li>Use the <strong>gentle pressure setting</strong> to avoid compressing the flaked texture</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Fish for Sous Vide — A Perfect Combination</h2>
          <p>
            Fish cooked sous vide is transformative — precise low-temperature cooking means
            the difference between perfectly cooked fish and dry, overcooked disappointment
            is measured in degrees. And every sous vide cook starts with vacuum sealing.
          </p>
          <ul>
            <li><strong>Yellowtail fillet:</strong> 52°C for 20 minutes — silky, just-cooked texture</li>
            <li><strong>Snoek portions:</strong> 55°C for 25 minutes — holds the flake structure</li>
            <li><strong>Kingklip:</strong> 50°C for 18 minutes — delicate and moist</li>
          </ul>
          <p>
            Seal the fish with butter, lemon and fresh herbs directly in the bag. The vacuum
            forces the aromatics into the flesh during cooking.
          </p>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/bags-rolls" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shop Bags & Rolls
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog/vacuum-sealing-game-meat-south-africa" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Game Meat Guide
          </Link>
          <Link href="/blog/vacuum-sealing-during-load-shedding" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Load Shedding Guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
