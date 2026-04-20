import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Meat Aging in a Vacuum — Wet Aging Explained | Lava South Africa",
  description:
    "Wet aging vs dry aging — what the difference is, why vacuum aging produces consistently tender results, and how to do it at home with a LAVA machine.",
};

export default function MeatAgingPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary">Meat Aging in a Vacuum</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Wet aging in vacuum bags is how most premium beef reaches supermarkets and
            restaurants. Here&apos;s how it works, how long to do it, and why it produces
            consistently tender results without the waste of traditional dry aging.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/header-013.webp" alt="Vacuum sealed steaks with herbs" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">Wet Aging vs Dry Aging</h2>
          <p>
            The steak world is sometimes divided into dry aging enthusiasts and wet aging
            proponents. The truth is they&apos;re different processes with different strengths:
          </p>

          <table className="w-full text-sm border border-border my-6">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Factor</th>
                <th className="text-left py-3 px-4 font-bold">Dry Aging</th>
                <th className="text-left py-3 px-4 font-bold text-secondary">Wet Aging (Vacuum)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Tenderness", "Excellent", "Excellent"],
                ["Flavour intensity", "Very strong, nutty, complex", "Clean, true beef flavour"],
                ["Weight loss", "15–25%", "Near zero"],
                ["Equipment needed", "Dedicated cold room / dry ager", "Standard fridge + LAVA machine"],
                ["Risk of failure", "Higher (surface mould, temperature)", "Lower (sealed environment)"],
                ["Time required", "21–45 days optimal", "7–14 days produces excellent results"],
                ["Cost", "Higher (waste + equipment)", "Lower (sealed, no waste)"],
                ["Best for", "Intense flavour seekers", "Everyday premium results"],
              ].map(([factor, dry, wet]) => (
                <tr key={factor} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-semibold text-primary">{factor}</td>
                  <td className="py-2.5 px-4 text-copy-muted text-sm">{dry}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary text-sm">{wet}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">How Vacuum Aging Works</h2>
          <p>
            Meat contains natural enzymes — primarily calpains and cathepsins — that continue
            working after slaughter. Their job is to break down the proteins in muscle fibres.
            In normal storage conditions, they work slowly. In a sealed, temperature-controlled
            environment, they work at an optimal rate.
          </p>
          <p>
            Vacuum sealing creates the ideal conditions for these enzymes:
          </p>
          <ul>
            <li><strong>No oxygen</strong> — prevents oxidation and surface spoilage while enzymes work</li>
            <li><strong>Consistent moisture</strong> — the meat stays in its own juices, which contain the enzymes</li>
            <li><strong>Controlled environment</strong> — temperature is the only variable to manage</li>
          </ul>
          <p>
            The result after 7–14 days is meat that is measurably more tender and has a cleaner,
            more concentrated natural beef flavour — without any of the &ldquo;funky&rdquo; notes
            that can develop in poorly managed dry aging.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">The Complete Wet Aging Process</h2>

          <div className="space-y-3 my-6">
            {[
              { day: "Day 0", action: "Buy fresh beef from a reputable butcher. Ask for cuts that haven't been previously frozen or stress-chilled. Pat dry and vacuum seal immediately with no marinades or salt. Label with date." },
              { day: "Days 1–3", action: "Fridge at 0–2°C. The bag will appear very tight — this is correct. The meat may release some liquid — also correct. Do not open." },
              { day: "Days 4–7", action: "You may notice slight colour change from bright red to a darker, more complex red. This is myoglobin reduction — normal and positive. Tenderness improvement begins to be noticeable." },
              { day: "Days 7–14", action: "Optimal window for most home cooks. Excellent tenderness, clean flavour. Remove, pat completely dry, rest 45 minutes before cooking." },
              { day: "Days 14–21", action: "For enthusiasts wanting more development. Still safe if temperature has been consistent. Flavour becomes more pronounced. Recommended for rib-eye and T-bone only — leaner cuts don't benefit as much at this stage." },
            ].map(({ day, action }) => (
              <div key={day} className="flex gap-4 border border-border p-4">
                <div className="text-xs font-black uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 h-fit shrink-0 mt-0.5 min-w-[70px] text-center">{day}</div>
                <p className="text-sm text-copy leading-relaxed">{action}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">South African Context: Game Meat Aging</h2>
          <p>
            Wild game responds exceptionally well to wet aging. Venison is very lean —
            the enzyme action that creates tenderness is more noticeable on lean meat than
            on well-marbled beef. A vacuum-aged blesbok backstrap after 10 days is a revelation
            compared to the same cut cooked immediately after hunting.
          </p>
          <ul>
            <li>Hang the carcass 24–48 hours at 0–4°C before processing and sealing</li>
            <li>Seal individual portions and age in fridge for 7–14 days</li>
            <li>Cook at medium-rare (55–58°C) — game dried out is game wasted</li>
            <li>For long-term storage after aging: freeze sealed — the aging &ldquo;locks in&rdquo; when frozen</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Watch: Sealing Meat with LAVA</h2>
          <div className="relative aspect-video bg-zinc-100 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/CYBrTfhGMko?rel=0&modestbranding=1"
              title="Sealing Meat with LAVA Vacuum Sealer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>

        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/vacuum-packaging/dry-aging" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Dry Aging Guide
          </Link>
        </div>

      </div>
    </main>
  );
}
