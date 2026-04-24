import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hunters & Game Processing — Vacuum Sealing Game Meat in South Africa",
  description:
    "Process blesbok, kudu, impala, warthog and eland properly. Vacuum seal wild game for 2–3 years without freezer burn. South Africa's hunters' choice since 2007.",
};

function Placeholder({ label, aspect = "aspect-[16/7]" }: { label: string; aspect?: string }) {
  return (
    <div className={`${aspect} bg-primary/10 flex items-end relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      <div className="relative p-3 w-full bg-black/20">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Image needed</p>
        <p className="text-xs font-semibold text-white/80">{label}.jpg</p>
      </div>
    </div>
  );
}

export default function HunterGamePage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-3">
            Hunters &amp; Game Processing
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            The hunt is only as good as the meat it produces. LAVA vacuum sealers have been
            the choice of South African hunters since 2007 — because nothing else comes close
            for preserving wild game at its best.
          </p>
        </div>

        <Placeholder label="app-hunter-game-field" />

        {/* Video */}
        <div className="mt-8 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch: LAVA — Best in Test for Hunters</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/yaf_L7C6N6U?rel=0&modestbranding=1"
              title="LAVA Vacuum Sealer for Hunters and Fishermen — Best in Test"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mt-2">In English — LAVA rated best-in-test for hunting and fishing use</p>
        </div>

        <div className="prose-lava mt-10">

          <h2 className="text-2xl font-bold text-primary mb-4">Why Hunters Choose LAVA</h2>
          <p>
            Wild game is irreplaceable. A blesbok costs money, time, effort and a licence.
            Losing a significant portion of that to freezer burn — or a failed seal discovered
            months later — is genuinely painful. <strong>LAVA hunters don&apos;t lose game meat.</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {[
              { stat: "2–3 years", label: "Vacuum sealed venison in the freezer" },
              { stat: "0%", label: "Freezer burn on a correctly sealed LAVA bag" },
              { stat: "20 min", label: "Vacuum marinating vs overnight conventional" },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-primary text-white p-4 text-center">
                <p className="text-2xl font-black text-secondary">{stat}</p>
                <p className="text-xs text-white/70 mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          <Placeholder label="app-hunter-venison-processing" aspect="aspect-[16/6]" />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The Game Processor&apos;s Workflow</h2>
          <div className="space-y-3 my-6">
            {[
              { step: "Field", title: "Bleed and cool immediately", detail: "Quality starts at the shot. Quick bleeding and icing prevents enzyme damage and off-flavours that no amount of processing can fix later." },
              { step: "Cold Room", title: "Hang 24–48 hours at 0–4°C", detail: "Allow rigor mortis to resolve. Most South African game species need 24 hours minimum. Kudu and eland benefit from 48–72 hours. Don't rush this." },
              { step: "Processing", title: "Butcher into meal portions", detail: "Think in meal sizes — 500g for two, 1 kg for four. Trim silver skin and damaged tissue. Remove excess fat on older animals (it goes rancid faster)." },
              { step: "Sealing", title: "Vacuum seal with LAVA", detail: "Pat dry, load into embossed LAVA bags, seal. Use Liquid Stop for wet or moist cuts. Double-seal the bag for extra security. Label with species, cut and date." },
              { step: "Freezer", title: "Freeze flat, stack once solid", detail: "Flat frozen bags stack perfectly and take half the space of irregularly-shaped packages. Label the flat side so you can read it stacked." },
            ].map(({ step, title, detail }) => (
              <div key={step} className="flex gap-4 border border-border p-4">
                <div className="text-[9px] font-black uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 h-fit shrink-0 mt-0.5 min-w-[60px] text-center">{step}</div>
                <div>
                  <p className="font-bold text-primary text-sm">{title}</p>
                  <p className="text-xs text-copy leading-relaxed mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Species Storage Guide</h2>
          <table className="w-full text-sm border border-border mb-8">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Species</th>
                <th className="text-left py-3 px-4 font-bold">Hang Time</th>
                <th className="text-left py-3 px-4 font-bold text-secondary">Vacuum Frozen</th>
                <th className="text-left py-3 px-4 font-bold">Key Tip</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Blesbok", "24–36 hrs", "2–3 years", "Excellent flavour. Minimal fat — seal fast."],
                ["Springbok", "24 hrs", "2 years", "Premium lean meat. Ideal for sous vide."],
                ["Kudu", "48–72 hrs", "2–3 years", "Best venison in SA. Trim sinew before sealing."],
                ["Impala", "24–36 hrs", "2 years", "Very lean, tender. Vacuum marinating transforms it."],
                ["Warthog", "36–48 hrs", "2 years", "Stronger flavour. Benefit from acid marinade."],
                ["Eland", "48–72 hrs", "2–3 years", "Most beef-like. Treat like premium beef."],
                ["Wildebeest", "48 hrs", "2–3 years", "Best minced or diced. Trim fat before sealing."],
              ].map(([species, hang, frozen, tip]) => (
                <tr key={species} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-bold text-primary">{species}</td>
                  <td className="py-2.5 px-4 text-copy-muted text-xs">{hang}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary text-xs">{frozen}</td>
                  <td className="py-2.5 px-4 text-copy text-xs leading-relaxed">{tip}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Placeholder label="app-hunter-sealed-portions-labelled" aspect="aspect-[16/6]" />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Recommended Machines for Hunters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                model: "V.300® Premium X",
                tag: "1–2 animals per season",
                desc: "42 cm seal width. Handles full carcass processing over a few sessions. Liquid Stop for wet cuts. Most popular among SA hunters.",
                href: "/products/vacuum-machines",
              },
              {
                model: "V.400® Premium",
                tag: "Multiple animals / shared use",
                desc: "Commercial pump for extended sessions. 50 cm width for large game cuts. Built for processing 100+ kg without overheating.",
                href: "/products/vacuum-machines",
              },
            ].map(({ model, tag, desc, href }) => (
              <div key={model} className="border border-border p-5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-secondary mb-1">{tag}</p>
                <p className="font-bold text-primary text-base mb-2">{model}</p>
                <p className="text-xs text-copy-muted leading-relaxed mb-4">{desc}</p>
                <Link href={href} className="block text-center bg-primary text-white text-xs font-bold py-2.5 hover:bg-primary/90 transition-colors">
                  View Machine →
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border p-5 mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Essential Accessories for Hunters</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                ["Embossed Bags 25×40 cm", "/products/bags-rolls", "Large game cuts"],
                ["Embossed Bags 20×30 cm", "/products/bags-rolls", "Standard portions"],
                ["Vacuum Rolls", "/products/bags-rolls", "Custom sizes"],
                ["Sealing Strips (spare)", "/products/spare-parts", "Keep backups on hand"],
              ].map(([name, href, note]) => (
                <Link key={name} href={href} className="text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-start gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                  <span>{name} <span className="font-normal text-copy-muted text-xs">— {note}</span></span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog/vacuum-sealing-game-meat-south-africa" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Full Game Meat Guide
          </Link>
        </div>

      </div>
    </main>
  );
}
