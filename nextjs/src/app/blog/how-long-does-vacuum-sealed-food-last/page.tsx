import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Long Does Vacuum Sealed Food Last? The Complete South African Guide",
  description:
    "Exact shelf life figures for every food type South Africans store — fridge, freezer and pantry — with and without vacuum sealing. Includes venison, snoek, biltong, braai meat and more.",
};

const shelfLifeData = [
  // [food, fridge-normal, fridge-vacuum, freezer-normal, freezer-vacuum]
  ["Beef / Lamb (raw)", "3–5 days", "10–14 days", "3–6 months", "2–3 years"],
  ["Game Meat (venison, etc.)", "2–4 days", "8–12 days", "3–6 months", "2–3 years"],
  ["Chicken (raw)", "2–3 days", "7–10 days", "6–9 months", "18 months–2 years"],
  ["Fish / Snoek / Yellowtail", "1–2 days", "5–7 days", "2–3 months", "12–18 months"],
  ["Cooked meat / leftovers", "3–4 days", "10–14 days", "2–3 months", "12 months"],
  ["Hard cheese", "2–4 weeks", "4–8 months", "6 months", "18 months"],
  ["Soft cheese", "1–2 weeks", "3–4 weeks", "N/A", "6–8 months"],
  ["Fresh vegetables", "3–5 days", "10–15 days", "8 months", "2–3 years"],
  ["Blanched vegetables", "5–7 days", "14–21 days", "8–12 months", "2–3 years"],
  ["Berries", "1–3 days", "7–10 days", "6–8 months", "2 years"],
  ["Coffee beans", "1–2 weeks", "4–6 months", "—", "—"],
  ["Nuts / dried fruit", "3–6 months", "2–3 years", "—", "—"],
  ["Flour / rice / grains", "6–12 months", "2–3 years", "—", "—"],
  ["Biltong (dry)", "2–4 weeks", "4–6 months", "6 months", "2 years"],
  ["Bread", "3–5 days", "2–3 weeks", "3 months", "12 months"],
  ["Marinated meat", "3–5 days", "12–14 days", "2–3 months", "12 months"],
];

export default function PostShelfLife() {
  const articleLd = articleSchema({
    title: "How Long Does Vacuum Sealed Food Last? The Complete South African Guide",
    description:
      "Exact shelf life figures for every food type South Africans store — fridge, freezer and pantry — with and without vacuum sealing. Includes venison, snoek, biltong, braai meat and more.",
    url: "/blog/how-long-does-vacuum-sealed-food-last",
    datePublished: "2026-02-20",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Food Guide</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            How Long Does Vacuum Sealed Food Last?<br />
            The Complete South African Guide
          </h1>
          <p className="text-copy-muted text-sm">5 April 2026 · 7 min read</p>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            From venison in the deep freeze to snoek in the fridge — exact shelf life figures
            for every food type South Africans store. With and without vacuum sealing, so you
            know exactly what you&apos;re saving.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/header-006.jpg" alt="Vacuum sealed meat and vegetables" fill className="object-cover" />
        </div>

        {/* Key stat callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { stat: "3–5×", label: "Longer shelf life vs standard packaging" },
            { stat: "10M+", label: "Tonnes of food wasted in SA per year" },
            { stat: "R2,400", label: "Average SA household food waste per year" },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-primary text-white p-5 text-center">
              <p className="text-4xl font-black text-secondary">{stat}</p>
              <p className="text-xs text-white/70 mt-1 leading-snug">{label}</p>
            </div>
          ))}
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">Why Vacuum Sealing Extends Shelf Life So Dramatically</h2>
          <p>
            Food spoils through three main processes — and vacuum sealing defeats all three:
          </p>
          <ul>
            <li><strong>Oxidation</strong> — oxygen causes fat to go rancid and nutrients to degrade. No oxygen = no oxidation.</li>
            <li><strong>Aerobic bacteria</strong> — most spoilage bacteria require oxygen to multiply. Remove the oxygen, and growth slows dramatically.</li>
            <li><strong>Freezer burn</strong> — caused by moisture migrating to the surface of food when exposed to freezer air. A hermetic seal stops this completely.</li>
          </ul>
          <p>
            Vacuum sealing doesn&apos;t use chemicals, preservatives or heat. It simply removes
            the environment that causes food to deteriorate. <strong>This is why the same piece of
            venison that would be unrecognisable after 6 months in standard packaging is still
            perfectly fresh after 2 years in a LAVA bag.</strong>
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The Complete Shelf Life Chart</h2>
          <p className="text-sm text-copy-muted mb-4">
            All figures below are conservative estimates. Actual shelf life depends on initial
            food quality, storage temperature and sealing technique.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Food</th>
                  <th className="text-left py-3 px-4 font-bold">Fridge (normal)</th>
                  <th className="text-left py-3 px-4 font-bold text-secondary">Fridge (vacuum)</th>
                  <th className="text-left py-3 px-4 font-bold">Freezer (normal)</th>
                  <th className="text-left py-3 px-4 font-bold text-secondary">Freezer (vacuum)</th>
                </tr>
              </thead>
              <tbody>
                {shelfLifeData.map(([food, fridgeN, fridgeV, freezerN, freezerV]) => (
                  <tr key={food} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 font-semibold text-primary">{food}</td>
                    <td className="py-2.5 px-4 text-copy-muted">{fridgeN}</td>
                    <td className="py-2.5 px-4 font-semibold text-secondary">{fridgeV}</td>
                    <td className="py-2.5 px-4 text-copy-muted">{freezerN}</td>
                    <td className="py-2.5 px-4 font-semibold text-secondary">{freezerV}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-5 flex gap-3 mb-8">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Food safety note:</strong> Vacuum sealing slows spoilage but does not kill
              existing bacteria. Always start with fresh food, maintain cold chain, and check
              food before eating if there is any doubt. Anaerobic bacteria (like <em>C. botulinum</em>)
              can grow in vacuum-sealed foods left at room temperature — always refrigerate or
              freeze vacuum-sealed raw meat and fish.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">South African-Specific Tips</h2>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">Game Meat (Venison)</h3>
          <p>
            South African hunters typically process large quantities of meat after a hunt.
            Without vacuum sealing, most of that meat degrades in quality well before it&apos;s
            eaten — freezer burn on blesbok or kudu is a genuine loss.
          </p>
          <ul>
            <li><strong>Let carcasses hang and cool completely</strong> before vacuum sealing — sealing warm meat traps gases</li>
            <li><strong>Portion into meal-sized packs</strong> so you never defrost more than you need</li>
            <li><strong>Label with species, cut and date</strong> — after 2 years in a LAVA bag, your blesbok rump looks exactly like your kudu loin</li>
            <li>Game fat goes rancid faster than domestic beef fat — <strong>trim excess fat</strong> before sealing long-term cuts</li>
          </ul>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">Snoek, Yellowtail &amp; Fresh Fish</h3>
          <p>
            Fresh fish is one of the most perishable foods you can handle — and vacuum sealing
            makes the biggest relative difference here. A snoek vacuum sealed the same day it&apos;s
            caught and frozen will still be excellent 12–15 months later. Left loose in the freezer,
            it&apos;s degraded within 2–3 months.
          </p>
          <ul>
            <li><strong>Blot fish dry</strong> before sealing to reduce moisture in the bag</li>
            <li>Use the <strong>Liquid Stop</strong> function if sealing wet or marinated fish</li>
            <li>Whole fish can be vacuum sealed but <strong>fillets are easier</strong> to portion and stack</li>
          </ul>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">Biltong</h3>
          <p>
            Biltong is already a preserved product — vacuum sealing extends it further but
            requires a slightly different approach:
          </p>
          <ul>
            <li><strong>Dry biltong</strong> (very dry, no moisture) can be vacuum sealed immediately — it will keep 4–6 months at room temperature and 2 years frozen</li>
            <li><strong>Wet/soft biltong</strong> should be refrigerated even after vacuum sealing — the moisture means it can still develop mould without cold storage</li>
            <li>Never seal biltong in an airtight container that has been sitting open — always inspect for mould first</li>
          </ul>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">Load Shedding Strategy</h3>
          <p>
            Vacuum sealed food survives load shedding far better than loose food. When your
            freezer is off for 4–6 hours, properly sealed food stays colder longer (no air gaps)
            and if partial thawing occurs, the hermetic seal prevents bacteria from colonising
            the surface. <Link href="/blog/vacuum-sealing-during-load-shedding" className="text-secondary font-semibold hover:text-primary transition-colors">Read our full load-shedding guide →</Link>
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Watch: Why LAVA is the Best Choice for Food Preservation</h2>
          <div className="relative aspect-video bg-zinc-100 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/yn-qpoAtbVI?rel=0&modestbranding=1"
              title="Why Choose a Lava Vacuum Sealer?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mb-8">Available in English — unique LAVA advantages explained in under 2 minutes</p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">5 Rules for Maximum Shelf Life</h2>
          <div className="space-y-3">
            {[
              { n: "1", title: "Start fresh", desc: "Vacuum sealing slows decay — it doesn't reverse it. Seal food at peak freshness for peak results." },
              { n: "2", title: "Keep it cold", desc: "Vacuum sealing is most effective combined with refrigeration or freezing. Don't rely on it as a room-temperature preservation method for proteins." },
              { n: "3", title: "Dry the surface", desc: "Moisture in the bag before sealing reduces vacuum quality. Pat meat and fish dry first." },
              { n: "4", title: "Double-seal bags", desc: "For long-term freezer storage, run a second seal 1–2 cm below the first. This is why LAVA's double sealing strip matters." },
              { n: "5", title: "Label everything", desc: "Date, contents, weight. After 18 months in the freezer, you won't remember what it is." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 border border-border bg-surface p-4">
                <div className="h-8 w-8 bg-primary text-white font-black text-sm flex items-center justify-center shrink-0">{n}</div>
                <div>
                  <p className="font-bold text-primary text-sm">{title}</p>
                  <p className="text-xs text-copy-muted leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CTA */}
        <div className="mt-16 bg-primary text-white p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Ready to Stop Wasting Food?</p>
            <h3 className="text-xl font-bold mb-2">Find Your LAVA Machine</h3>
            <p className="text-white/70 text-sm">From the V.100 entry-level to the V.500 industrial — the right LAVA for every kitchen and budget.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/products/vacuum-machines" className="bg-secondary text-white text-sm font-bold px-6 py-3 text-center hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products/bags-rolls" className="border border-white/30 text-white text-sm font-semibold px-6 py-3 text-center hover:border-white transition-colors">
              Shop Vacuum Bags & Rolls
            </Link>
          </div>
        </div>

        {/* Related articles */}
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-xs font-black uppercase tracking-widest text-copy-muted mb-4">Related Articles</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["The Hunter's Guide to Vacuum Sealing Game Meat", "/blog/vacuum-sealing-game-meat-south-africa"],
              ["Vacuum Sealing During Load Shedding", "/blog/vacuum-sealing-during-load-shedding"],
              ["How to Vacuum Seal Fish After a Day on the Water", "/blog/vacuum-sealing-fish-south-africa"],
              ["Full Shelf Life Chart", "/vacuum-packaging/shelf-life-chart"],
            ].map(([title, href]) => (
              <Link key={href} href={href} className="flex items-start gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors">
                <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                {title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Link href="/blog/planting-roots-sustainable-tomorrow" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Planting Roots
          </Link>
          <Link href="/blog/vacuum-sealing-game-meat-south-africa" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Game Meat Guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
