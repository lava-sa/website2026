import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle, X } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Vacuum Seal Biltong — Keep It Dry, Tender and Perfectly Preserved | Lava South Africa",
  description:
    "Biltong and vacuum sealing seem like opposites. Here's the correct technique to seal biltong without ruining the texture — wet, dry and sliced.",
};

export default function BiltongPage() {
  const articleLd = articleSchema({
    title: "How to Vacuum Seal Biltong — Keep It Dry, Tender and Perfectly Preserved",
    description:
      "Biltong and vacuum sealing seem like opposites. Here's the correct technique to seal biltong without ruining the texture — wet, dry and sliced.",
    url: "/blog/how-to-vacuum-seal-biltong",
    datePublished: "2026-03-01",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">South African Food</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            How to Vacuum Seal Biltong — Keep It Dry, Tender and Perfectly Preserved
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            Biltong and vacuum sealing seem like opposites — one is a drying process, the other
            removes all the air. The good news: done correctly, vacuum sealing is the best way
            to store biltong long-term. Done wrong, it turns your prize slabs into sweaty, mouldy
            disasters.
          </p>
          <p className="text-sm text-copy-muted mt-3">5 min read · South African Food</p>
        </div>

        {/* Hero image */}
        <div className="aspect-[16/7] bg-primary/10 flex items-end relative overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          <div className="relative p-3 w-full bg-black/20">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Image needed</p>
            <p className="text-xs font-semibold text-white/80">blog-biltong-vacuum-seal.jpg</p>
          </div>
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mb-4">Why Biltong Is Different</h2>
          <p>
            Most foods benefit from vacuum sealing immediately. Biltong is more complicated
            because it&apos;s a partially fermented, cured product. The rules change depending
            on how dry it is, how it&apos;s cut, and whether you want to store it at room
            temperature or in the freezer.
          </p>
          <p>
            Get it right and vacuum sealed biltong lasts <strong>6 months at room temperature
            and up to 2 years in the freezer</strong> — with texture and flavour almost
            indistinguishable from fresh-made. Get it wrong and you&apos;ll find mould growing
            on week-old biltong that cost you R80 for 100g.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-6">The Three Types of Biltong — Different Rules Apply</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                type: "Dry Biltong",
                colour: "border-green-200 bg-green-50",
                textColour: "text-green-800",
                desc: "Hard, fully dried through. Breaks with a snap. Zero visible moisture.",
                storage: "Room temp 6 months / Freezer 2 years",
                rule: "Seal at room temperature. No special preparation needed.",
                icon: "✓",
              },
              {
                type: "Medium / Soft Biltong",
                colour: "border-amber-200 bg-amber-50",
                textColour: "text-amber-800",
                desc: "Slightly soft in the centre, dried on the outside. The most popular style in South Africa.",
                storage: "Fridge only / Freezer 18 months",
                rule: "Must be refrigerated after sealing. Room temperature storage risks mould.",
                icon: "⚠",
              },
              {
                type: "Wet / Sliced",
                colour: "border-red-200 bg-red-50",
                textColour: "text-red-800",
                desc: "Freshly sliced with visible moisture. Tender, almost raw-looking centre.",
                storage: "Fridge 2–3 weeks / Freezer 12 months",
                rule: "Refrigerate immediately. Seal in small portions — once opened, consume within 3 days.",
                icon: "!",
              },
            ].map(({ type, colour, textColour, desc, storage, rule, icon }) => (
              <div key={type} className={`border p-4 ${colour}`}>
                <p className={`font-bold text-sm mb-2 ${textColour}`}>{icon} {type}</p>
                <p className={`text-xs leading-relaxed mb-3 ${textColour}`}>{desc}</p>
                <p className={`text-xs font-bold mb-1 ${textColour}`}>Storage:</p>
                <p className={`text-xs mb-2 ${textColour}`}>{storage}</p>
                <p className={`text-xs font-bold mb-1 ${textColour}`}>Rule:</p>
                <p className={`text-xs ${textColour}`}>{rule}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Step-by-Step: How to Vacuum Seal Biltong Correctly</h2>

          <div className="space-y-3 mb-8">
            {[
              {
                step: "1",
                title: "Check moisture level before you seal",
                detail: "Press the thickest piece between your fingers. If moisture transfers to your hand, the biltong is too wet to store at room temperature. It must be refrigerated or frozen — even after vacuum sealing.",
              },
              {
                step: "2",
                title: "Portion into single-use amounts",
                detail: "Vacuum seal in 100–200g portions — what you'll eat in one sitting. Once you open a sealed packet, the biltong begins oxidising again. Small portions reduce waste and maintain freshness.",
              },
              {
                step: "3",
                title: "Dry the biltong surface if needed",
                detail: "If there's surface moisture (oil, marinade residue), pat dry with a paper towel before sealing. Moisture on the bag opening is the #1 cause of seal failure. Use the Liquid Stop function on your LAVA machine for extra safety.",
              },
              {
                step: "4",
                title: "Reduce vacuum pressure for sliced biltong",
                detail: "For thinly sliced biltong, reduce the vacuum level to 60–70% using the pressure control dial on LAVA V.300+ machines. Full vacuum will crush the slices into a compressed mass. You want firm, not crushed.",
              },
              {
                step: "5",
                title: "Double-seal for long-term storage",
                detail: "For freezer storage or anything over 3 months, run a double seal — seal once, then shift the bag 2mm and seal again. This ensures there are no micro-gaps in the weld.",
              },
              {
                step: "6",
                title: "Label with date and type",
                detail: "Write the date and biltong type (wet/dry, whole/sliced) on the bag with a permanent marker before sealing. After 6 months in the freezer, every package looks identical.",
              },
            ].map(({ step, title, detail }) => (
              <div key={step} className="flex gap-4 border border-border bg-surface p-4">
                <div className="h-8 w-8 bg-secondary text-white font-black text-sm flex items-center justify-center shrink-0 rounded-full">{step}</div>
                <div>
                  <p className="font-bold text-primary text-sm mb-1">{title}</p>
                  <p className="text-sm text-copy leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-6">What You Can and Can&apos;t Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="border border-green-200 bg-green-50 p-5">
              <p className="font-bold text-green-800 text-sm mb-3 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Do This
              </p>
              <ul className="text-xs text-green-800 space-y-2 pl-1">
                <li>• Seal fully dry biltong at room temperature</li>
                <li>• Freeze medium biltong for 2+ months of storage</li>
                <li>• Seal whole sticks (sliced later) for best texture retention</li>
                <li>• Use embossed LAVA bags — smooth bags block the vacuum channel</li>
                <li>• Reduce vacuum pressure on sliced, tender biltong</li>
                <li>• Store dry sealed biltong in a cool, dark cupboard</li>
              </ul>
            </div>
            <div className="border border-red-200 bg-red-50 p-5">
              <p className="font-bold text-red-800 text-sm mb-3 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Never Do This
              </p>
              <ul className="text-xs text-red-800 space-y-2 pl-1">
                <li>• Seal wet biltong and leave it at room temperature</li>
                <li>• Seal biltong with any visible mould — discard the affected pieces</li>
                <li>• Use full vacuum pressure on soft sliced biltong</li>
                <li>• Open and reseal the same packet multiple times</li>
                <li>• Seal biltong while it&apos;s still warm from the drying box</li>
                <li>• Mix dry and wet pieces in the same packet</li>
              </ul>
            </div>
          </div>

          {/* Mould warning */}
          <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3 mb-8">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 text-sm mb-1">Important: Mould Safety</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Vacuum sealing does not kill mould spores — it removes oxygen, which slows but
                doesn&apos;t eliminate anaerobic mould growth in wet biltong stored at room
                temperature. <strong>Never seal biltong with any visible white, green or black mould.</strong>
                Unlike hard cheese, the entire piece must be discarded — biltong&apos;s fibrous
                texture allows mould to penetrate deeply even when surface mould looks minor.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">How Long Does Vacuum Sealed Biltong Last?</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Biltong Type</th>
                  <th className="text-left py-3 px-4 font-bold">Without Sealing</th>
                  <th className="text-left py-3 px-4 font-bold">Vacuum Sealed — Room Temp</th>
                  <th className="text-left py-3 px-4 font-bold">Vacuum Sealed — Freezer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fully dry biltong (sticks)", "2–4 weeks", "4–6 months", "18–24 months"],
                  ["Medium / soft biltong", "5–7 days", "Not recommended*", "12–18 months"],
                  ["Wet sliced biltong", "2–3 days", "Not recommended*", "6–12 months"],
                  ["Droëwors (dry)", "2–3 weeks", "3–4 months", "12 months"],
                  ["Stokkies / snapsticks", "1–2 weeks", "3–4 months", "12 months"],
                ].map(([type, normal, sealed, frozen]) => (
                  <tr key={type} className="border-b border-border odd:bg-surface">
                    <td className="py-3 px-4 font-semibold text-primary text-xs">{type}</td>
                    <td className="py-3 px-4 text-copy text-xs">{normal}</td>
                    <td className="py-3 px-4 text-copy text-xs">{sealed}</td>
                    <td className="py-3 px-4 font-semibold text-secondary text-xs">{frozen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-copy-muted mb-8">
            * Wet and medium biltong can be vacuum sealed and stored in the fridge for 3–4 weeks.
            Room temperature storage without complete drying risks mould.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">For Biltong Producers</h2>
          <p>
            If you&apos;re producing biltong to sell at a farmers market, butchery or online —
            presentation matters as much as preservation. Vacuum sealed biltong in a tight, flat
            pack looks professional. A LAVA V.300 or V.333 Chrome handles the throughput for
            small to medium production runs.
          </p>
          <ul>
            <li><strong>Consistent seal width</strong> — LAVA&apos;s 42 cm sealing bar covers wide flat-pack portions without resealing</li>
            <li><strong>Pressure control</strong> — dial in the exact vacuum level for your product&apos;s texture</li>
            <li><strong>Liquid Stop protection</strong> — essential when sealing oily spiced biltong where fat can migrate toward the seal</li>
            <li><strong>Transparent bags</strong> — LAVA bags are clear, so the product sells itself</li>
          </ul>
          <p>
            For high-volume biltong producers, the V.333 Chrome and V.400 Premium offer
            commercial-rated pumps and stainless steel construction for food-safe daily production.
          </p>

          {/* Video */}
          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">See It in Action</h2>
          <div className="aspect-video mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/yaf_L7C6N6U"
              title="LAVA vacuum sealing meat and game"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>

          {/* CTA */}
          <div className="bg-primary/5 border border-primary/20 p-6 mt-10">
            <p className="font-bold text-primary mb-2">The Right Machine for Biltong</p>
            <p className="text-sm text-copy leading-relaxed mb-4">
              For home use, the V.300® Premium X handles biltong perfectly — pressure control,
              Liquid Stop and a 42 cm seal. For commercial biltong production, talk to Anneke
              about the V.333 Chrome or V.400 Premium.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products/vacuum-machines" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary px-5 py-2.5 hover:bg-primary/90 transition-colors">
                Shop Machines <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/applications/biltong" className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors">
                Biltong Application Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
          {[
            ["Biltong Application Guide", "/applications/biltong"],
            ["How Long Food Lasts Vacuum Sealed", "/blog/how-long-does-vacuum-sealed-food-last"],
            ["Game Meat Vacuum Sealing", "/blog/vacuum-sealing-game-meat-south-africa"],
            ["Shop Vacuum Bags", "/vacuum-packaging/bags-guide"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="text-xs font-bold text-copy-muted hover:text-primary transition-colors underline">
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
