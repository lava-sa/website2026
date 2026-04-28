import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Recycle, Clock, TrendingDown, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Sustainable Sealing",
  description:
    "Vacuum sealing and green living — is there a contradiction? We address it honestly. How LAVA bags, containers, and long-lasting machines reduce waste rather than create it.",
};

export default function SustainableSealingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <div className="section-container max-w-3xl">
          <p className="overline text-secondary mb-3">Sustainability</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Discover Sustainable Sealing
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg leading-relaxed">
            Beyond disposable culture — how vacuum sealing actually reduces waste rather than contributing to it.
          </p>
        </div>
      </section>

      {/* ── Hero image ───────────────────────────────────────────────────────── */}
      <div className="relative aspect-[21/7] overflow-hidden">
        <Image
          src="/images/homepage/lava-sustainable.webp"
          alt="LAVA vacuum sealing — sustainable food preservation"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* ── The honest question ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container max-w-3xl">
          <p className="overline mb-3">Let&apos;s address it directly</p>
          <h2 className="text-3xl font-bold text-primary mb-6">
            Wait — Doesn&apos;t Vacuum Sealing Use Plastic?
          </h2>
          <div className="space-y-5 text-[15px] leading-relaxed text-copy">
            <p>
              It&apos;s a fair question, and we&apos;d rather answer it honestly than pretend it doesn&apos;t exist.
              Yes — vacuum sealing uses bags, and many of those bags are plastic. So how can we talk
              about sustainability in the same breath?
            </p>
            <p>
              The answer lies in <strong className="text-primary">what that plastic replaces</strong>.
              The alternative to vacuum-sealing your venison isn&apos;t zero plastic — it&apos;s a fresh
              sheet of cling wrap and a freezer bag every few weeks as the food spoils, freezer-burns,
              and gets thrown away. Multiply that across a year, and the single-use plastic from
              &ldquo;non-vacuum&rdquo; storage far exceeds what a LAVA bag uses.
            </p>
            <p>
              More importantly: <strong className="text-primary">LAVA bags are not single-use</strong>.
              They can be washed and reused multiple times for dry goods — spices, nuts, coffee,
              cheese. LAVA containers are reusable indefinitely. And the machines last 15–20 years.
              When you see the full picture, the maths strongly favour vacuum sealing.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote className="my-10 border-l-4 border-secondary pl-6">
            <p className="text-xl font-semibold text-primary leading-snug">
              &ldquo;The most sustainable choice is almost always to buy less, and buy better.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── Three ways vacuum sealing reduces waste ───────────────────────────── */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="section-container">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <p className="overline mb-2">The real numbers</p>
            <h2 className="text-2xl font-bold text-primary">Three Ways Vacuum Sealing Reduces Waste</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Food Lasts 3–5× Longer",
                body: "Vacuum-sealed meat in the freezer lasts 2–3 years vs 3–6 months in standard packaging. Freezer burn is eliminated. Less food thrown away means less food produced needlessly.",
              },
              {
                icon: TrendingDown,
                title: "Less Impulse Shopping",
                body: "When you can bulk-buy and vacuum seal at home, you shop less often and waste less on fresh food that spoils before you use it. Fewer trips. Fewer impulse buys. Lower bills.",
              },
              {
                icon: Recycle,
                title: "Reusable Bags & Containers",
                body: "LAVA bags can be washed and reused for dry goods. Containers last indefinitely. Compare that to a fresh sheet of cling wrap and a new zip-lock bag every single time.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white border border-border p-6">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-primary mb-2">{title}</h3>
                <p className="text-sm text-copy-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shelf life table ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="overline mb-2">The numbers</p>
            <h2 className="text-2xl font-bold text-primary">How Long Food Actually Lasts</h2>
            <p className="mt-2 text-copy-muted">Extending shelf life is the single biggest lever you have on household food waste.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 font-bold">Food Item</th>
                  <th className="text-left py-3 px-4 font-bold">Standard Storage</th>
                  <th className="text-left py-3 px-4 font-bold text-secondary">Vacuum Sealed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Beef / lamb (frozen)", "3–6 months", "2–3 years"],
                  ["Game meat (frozen)", "3–6 months", "2–3 years"],
                  ["Fish (frozen)", "2–3 months", "12–18 months"],
                  ["Cooked food (fridge)", "3–4 days", "10–14 days"],
                  ["Vegetables (fridge)", "3–5 days", "10–15 days"],
                  ["Hard cheese (fridge)", "1–2 weeks", "4–8 months"],
                  ["Biltong (dry)", "2–3 weeks", "3–6 months"],
                  ["Coffee beans (room temp)", "2–4 weeks", "4–6 months"],
                ].map(([food, standard, sealed], i) => (
                  <tr key={food} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="py-2.5 px-4 font-semibold text-primary border-b border-border">{food}</td>
                    <td className="py-2.5 px-4 text-copy-muted border-b border-border">{standard}</td>
                    <td className="py-2.5 px-4 font-semibold text-secondary border-b border-border">{sealed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Reusable bags guide ───────────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="section-container max-w-3xl mx-auto">
          <div className="flex gap-4 items-start">
            <Leaf className="h-6 w-6 text-secondary shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Are LAVA Bags Reusable?</h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-copy">
                <p>
                  Yes — with the right contents. LAVA embossed bags are made from food-safe PA/PE
                  multilayer film. For <strong className="text-primary">dry goods</strong> (nuts, spices,
                  coffee, biltong, dried fruit), the bags can be hand-washed with warm soapy water,
                  air-dried, and resealed multiple times.
                </p>
                <p>
                  For <strong className="text-primary">raw meat, fish, or wet marinades</strong>, we
                  recommend using a fresh bag each time for food safety reasons — the same rule that
                  applies to any food-contact packaging after raw protein contact.
                </p>
                <p>
                  LAVA&apos;s full range of rigid containers and glass jars are reusable indefinitely
                  and eliminate the bag question entirely for foods that suit them — dips, sauces,
                  ferments, and dry pantry staples.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/products/containers-lids" className="inline-block border border-primary text-primary font-semibold px-5 py-2.5 text-sm hover:bg-primary hover:text-white transition-colors">
                  View Containers &amp; Lids
                </Link>
                <Link href="/products/vacuum-bags" className="inline-block border border-border text-copy font-semibold px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition-colors">
                  View Vacuum Bags
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Beyond sealing: the machine's footprint ───────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline mb-3">The bigger picture</p>
              <h2 className="text-3xl font-bold text-primary mb-5">A Machine Built Not to Be Replaced</h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-copy-muted">
                <p>
                  Planned obsolescence is one of the most wasteful forces in modern manufacturing.
                  A cheap appliance that fails in two years creates far more environmental damage
                  than the energy cost of making a LAVA machine that runs for twenty.
                </p>
                <p>
                  LAVA machines are repairable. Every serviceable component — sealing strip, liquid
                  trap lid, vacuum seals — is available from Lava-SA. Spare parts are stocked for
                  10+ years after a model is discontinued. You will never be left with landfill.
                </p>
              </div>
              <Link href="/about/lasting-quality" className="inline-block mt-6 border border-primary text-primary font-semibold px-5 py-2.5 text-sm hover:bg-primary hover:text-white transition-colors">
                Explore LAVA&apos;s Lasting Quality →
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden shadow-xl">
              <Image
                src="/images/blog/header-003.webp"
                alt="LAVA durability — engineered to last"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-primary text-center">
        <div className="section-container max-w-xl mx-auto">
          <p className="overline text-secondary mb-3">Make the switch</p>
          <h2 className="text-3xl font-bold text-white mb-5">Seal Smarter. Waste Less.</h2>
          <p className="text-on-dark-muted mb-8">
            Browse LAVA vacuum machines and start reducing your household food waste today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/vacuum-machines" className="inline-block bg-secondary text-white font-bold px-8 py-3 hover:bg-secondary/90 transition-colors">
              Shop Vacuum Machines
            </Link>
            <Link href="/about/green-mission" className="inline-block border border-white/30 text-white/80 font-semibold px-8 py-3 hover:bg-white/10 hover:text-white transition-colors">
              Join Our Green Mission
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface border-t border-border">
        <div className="section-container max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-secondary mb-3">Pillar Guide Links</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guides/food-preservation-reducing-waste" className="border border-border bg-white px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors">
              Food Preservation & Reducing Waste →
            </Link>
            <Link href="/guides/how-to-vacuum-seal" className="border border-border bg-white px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors">
              How to Vacuum Seal →
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
