import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Vacuum Sealing & Load Shedding — Protect Your Food During Power Outages",
  description:
    "Load shedding puts your freezer at serious risk. Vacuum sealed food survives power outages far better than loose food. Here's your complete South African load-shedding food strategy.",
};

export default function PostLoadShedding() {
  const articleLd = articleSchema({
    title: "Vacuum Sealing & Load Shedding — Protect Your Food During Power Outages",
    description:
      "Load shedding puts your freezer at serious risk. Vacuum sealed food survives power outages far better than loose food. Here's your complete South African load-shedding food strategy.",
    url: "/blog/vacuum-sealing-during-load-shedding",
    datePublished: "2026-03-20",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">South African Living</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            Vacuum Sealing &amp; Load Shedding — How to Protect Your Food During Power Outages
          </h1>
          <p className="text-copy-muted text-sm">10 April 2026 · 5 min read</p>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            South Africans spend an average of R2,400 per household on food waste every year.
            Load shedding makes it worse. Here&apos;s how vacuum sealing — combined with the
            right strategy — dramatically reduces the damage.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/header-006.jpg" alt="Vacuum sealed bulk food storage" fill className="object-cover" />
        </div>

        {/* Shock stat bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { stat: "4–8 hrs", label: "Typical freezer safe window during load shedding (if sealed and full)" },
            { stat: "3–5×", label: "Longer shelf life of vacuum sealed food vs loose packaging" },
            { stat: "R2,400", label: "Average SA household annual food waste — load shedding adds significantly more" },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-primary text-white p-5 text-center">
              <p className="text-3xl font-black text-secondary">{stat}</p>
              <p className="text-xs text-white/70 mt-2 leading-snug">{label}</p>
            </div>
          ))}
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">What Actually Happens to Your Freezer During Load Shedding</h2>
          <p>
            A full freezer maintains safe temperatures for <strong>24–48 hours</strong> without
            power — if you don&apos;t open the door. A half-full freezer stays safe for only
            <strong> 12–24 hours</strong>. Individual items — especially if loosely packed —
            deteriorate much faster.
          </p>
          <p>
            The danger isn&apos;t just a single long outage. It&apos;s the cumulative effect
            of repeated load shedding cycles. Meat that partially defrosts and refreezes
            multiple times suffers significant quality loss — and in some cases, becomes a
            food safety risk.
          </p>

          <div className="bg-amber-50 border border-amber-200 p-5 flex gap-3 my-6">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 mb-1">The Danger Zone</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Food safety guidelines state that perishable food should not be above 4°C
                for more than 2 hours cumulatively. If your freezer reaches 4°C or above
                during load shedding, proteins and dairy in unsealed packaging are at risk.
                Vacuum sealed food is more insulated, stays colder longer, and has a hermetic
                barrier preventing surface bacterial colonisation if partial thawing occurs.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Why Vacuum Sealed Food Survives Better</h2>

          <div className="space-y-3 my-6">
            {[
              {
                icon: ShieldCheck,
                title: "Hermetic barrier against surface bacteria",
                desc: "If vacuum-sealed meat partially thaws, the sealed environment prevents bacteria from colonising the exposed surface. Loose meat in a bag has no such protection — the surface is exposed to any condensation or air that enters."
              },
              {
                icon: Zap,
                title: "Better thermal insulation",
                desc: "Tightly vacuum-sealed portions contain no air gaps. Air is an insulator — removing it means the frozen mass acts as a single thermal unit, staying colder longer than loosely packed items."
              },
              {
                icon: CheckCircle,
                title: "Reduced moisture migration",
                desc: "Standard freezer packaging allows moisture to migrate — leading to ice crystals on the surface and within the food. Vacuum sealing contains all moisture, meaning that even if some thawing occurs, the food retains its structure and texture far better."
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 border border-border bg-surface p-5">
                <Icon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-primary text-sm mb-1">{title}</p>
                  <p className="text-xs text-copy leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The South African Load-Shedding Food Strategy</h2>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">1. Bulk Buy &amp; Vacuum Seal Immediately</h3>
          <p>
            The cheapest and most practical load-shedding insurance is buying meat in bulk when
            prices are good and vacuum sealing the same day. A vacuum sealed 10 kg bag of braai
            chops, properly frozen, is essentially unaffected by a 4-stage load shedding cycle.
          </p>
          <ul>
            <li>Buy in bulk from your butcher on a Monday — seal and freeze the same day</li>
            <li>Portion into meal-sized packs before sealing — you&apos;ll defrost only what you need</li>
            <li>Keep the freezer as full as possible — a full freezer loses temperature more slowly</li>
            <li>If you have space issues: vacuum seal flat, stack vertically — takes up half the space of standard packaging</li>
          </ul>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">2. Know Your Schedule — Have a Plan</h3>
          <table className="w-full text-sm border border-border my-4">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Load Shedding Stage</th>
                <th className="text-left py-3 px-4 font-bold">Hours Off per Day</th>
                <th className="text-left py-3 px-4 font-bold">Freezer Risk (vacuum)</th>
                <th className="text-left py-3 px-4 font-bold">Freezer Risk (unsealed)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Stage 1–2", "2–4 hrs", "Low — stays well below 0°C", "Low – Medium"],
                ["Stage 3–4", "4–8 hrs", "Low — core temperature maintained", "Medium — surface thawing risk"],
                ["Stage 5–6", "8–12+ hrs", "Medium — monitor temperature", "High — partial thawing likely"],
                ["Extended outage 24+ hrs", "20+ hrs", "Medium — refreeze quickly on restore", "Very High — discard any questionable items"],
              ].map(([stage, hrs, vacRisk, unsealed]) => (
                <tr key={stage} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-semibold text-primary">{stage}</td>
                  <td className="py-2.5 px-4 text-copy-muted">{hrs}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary">{vacRisk}</td>
                  <td className="py-2.5 px-4 text-copy-muted">{unsealed}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">3. Vacuum Seal Your Fridge Items Too</h3>
          <p>
            The fridge is more vulnerable to load shedding than the freezer — it loses
            temperature faster and the food is already at a higher temperature. Vacuum sealed
            fridge items stay safe for significantly longer:
          </p>
          <ul>
            <li><strong>Cooked leftovers:</strong> 3–4 days unsealed vs 10–14 days vacuum sealed</li>
            <li><strong>Cheese:</strong> 1–2 weeks unsealed vs 4–8 months vacuum sealed</li>
            <li><strong>Raw meat (unfrozen):</strong> 3–5 days vs 10–14 days</li>
            <li><strong>Prepped vegetables:</strong> 2–3 days vs 8–12 days</li>
          </ul>

          <h3 className="text-lg font-bold text-primary mt-6 mb-3">4. Pantry Strategy for Dry Goods</h3>
          <p>
            Load shedding also affects refrigerator-dependent pantry items like opened bags
            of rice, flour, nuts and coffee. Vacuum sealed dry goods need no refrigeration
            and are completely immune to load shedding:
          </p>
          <ul>
            <li><strong>Coffee beans:</strong> sealed at room temperature 4–6 months vs 2–3 weeks open</li>
            <li><strong>Rice/flour:</strong> 2–3 years vacuum sealed vs 6–12 months in original packaging</li>
            <li><strong>Nuts:</strong> 2–3 years vacuum sealed vs 3–6 months in standard packaging</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">What LAVA Machine for Load Shedding Preparedness?</h2>
          <p>
            Any LAVA machine handles bulk sealing sessions well. But if you regularly process
            large quantities of meat — 10 kg+ at a time — you want a machine with a commercial-
            grade pump that won&apos;t overheat during extended sessions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {[
              {
                model: "V.300 Premium X",
                desc: "Best for most households. 42 cm seal width. Continuous home use.",
                href: "/products/vacuum-machines",
                badge: "Most Popular"
              },
              {
                model: "V.400 Premium",
                desc: "For serious bulk buyers. Commercial pump rated for extended sessions without rest cycles.",
                href: "/products/vacuum-machines",
                badge: "Heavy Duty"
              },
            ].map(({ model, desc, href, badge }) => (
              <div key={model} className="border border-border p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-primary">{model}</p>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-secondary/10 text-secondary px-2 py-1 shrink-0">{badge}</span>
                </div>
                <p className="text-xs text-copy-muted leading-relaxed mb-4">{desc}</p>
                <Link href={href} className="block text-center bg-primary text-white text-xs font-bold py-2.5 hover:bg-primary/90 transition-colors">
                  View Machine →
                </Link>
              </div>
            ))}
          </div>

          <div className="relative aspect-video bg-zinc-100 mt-8 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/4Ut74sEOf1I?rel=0&modestbranding=1"
              title="The Ultimate Guide — Which Vacuum Sealer is Right for You?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mb-8">In English — full buying guide to choosing the right LAVA machine</p>

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
          <Link href="/blog/vacuum-sealing-fish-south-africa" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Fish Guide
          </Link>
          <Link href="/blog/best-vacuum-sealer-south-africa-2026" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Buying Guide 2026 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
