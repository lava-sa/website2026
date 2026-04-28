import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Anglers & Fishing — Vacuum Sealing Fresh Catch in South Africa",
  description:
    "Snoek, yellowtail, cob, kingklip — vacuum sealed same-day catch is still excellent 12 months later. No freezer burn, no off-flavour. The angler's choice.",
  path: "/applications/angler-fishing",
});

export default function AnglerFishingPage() {
  const pageLd = webPageSchema({
    name: "Anglers & Fishing — Vacuum Sealing Fresh Catch in South Africa",
    description: "Snoek, yellowtail, cob, kingklip — vacuum sealed same-day catch is still excellent 12 months later. No freezer burn, no off-flavour. The angler's choice.",
    url: "/applications/angler-fishing",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Applications", url: "/applications" },
    { name: "Anglers & Fishing", url: "/applications/angler-fishing" },
  ]);

  return (
    <main className="py-16">
      <JsonLd data={[pageLd, crumbLd]} />
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-3">
            Anglers &amp; Fishing
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            A great day on the water deserves great fish six months later. Vacuum seal your
            catch the same day and the West Coast snoek or KZN yellowtail you&apos;re eating
            in August will taste the same as the day you caught it.
          </p>
        </div>

        <Image 
          src="/images/applications/app-fishing-snoek-west-coast.webp" 
          alt="West Coast snoek fishing with LAVA vacuum sealer" 
          width={1200} 
          height={525}
          className="w-full h-auto rounded-lg mb-8"
        />

        <div className="mt-8 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch: Vacuum-Packing Fish & Salmon</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/XEdT5cCNiwk?rel=0&modestbranding=1"
              title="LAVA Vacuum Packing Fish"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mt-2">In English — sealing fish fillets for long-term storage and sous vide</p>
        </div>

        <div className="prose-lava mt-10">

          <h2 className="text-2xl font-bold text-primary mb-4">The Difference Is Dramatic for Fish</h2>
          <p>
            Fish is the most perishable protein you handle. Fish fat oxidises fast — and that
            oxidation is exactly what causes the &ldquo;fishy&rdquo; off-flavour that people
            assume is inevitable in frozen fish. <strong>It&apos;s not. It&apos;s a storage problem,
            not a fish problem.</strong>
          </p>

          <table className="w-full text-sm border border-border my-6">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Species</th>
                <th className="text-left py-3 px-4 font-bold">Fridge (normal)</th>
                <th className="text-left py-3 px-4 font-bold text-secondary">Fridge (vacuum)</th>
                <th className="text-left py-3 px-4 font-bold">Freezer (normal)</th>
                <th className="text-left py-3 px-4 font-bold text-secondary">Freezer (vacuum)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Snoek", "1–2 days", "5–7 days", "2–3 months", "12–15 months"],
                ["Yellowtail", "1–2 days", "5–7 days", "2–3 months", "12–15 months"],
                ["Cob / Kabeljou", "1–2 days", "5–7 days", "3 months", "15–18 months"],
                ["Kingklip", "1 day", "4–5 days", "2 months", "12 months"],
                ["Tuna", "1 day", "3–5 days", "2–3 months", "12–15 months"],
                ["Prawns", "1–2 days", "5–6 days", "3–4 months", "12–15 months"],
              ].map(([fish, fr, frv, fz, fzv]) => (
                <tr key={fish} className="border-b border-border odd:bg-surface">
                  <td className="py-2 px-4 font-bold text-primary">{fish}</td>
                  <td className="py-2 px-4 text-copy-muted">{fr}</td>
                  <td className="py-2 px-4 font-semibold text-secondary">{frv}</td>
                  <td className="py-2 px-4 text-copy-muted">{fz}</td>
                  <td className="py-2 px-4 font-semibold text-secondary">{fzv}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Dock to Freezer: the Right Way</h2>
          <div className="space-y-3 my-6">
            {[
              { step: "1", title: "Bleed immediately after the catch", detail: "Ike-jime or spiking dramatically improves flesh quality by removing the enzymes most responsible for deterioration. This one step makes more difference than anything else." },
              { step: "2", title: "Ice in a clean, drained cooler", detail: "0–2°C with the cooler drained of meltwater. Fish sitting in water introduces bacteria faster than ice alone." },
              { step: "3", title: "Fillet, rinse and blot dry", detail: "Cold, clean water for rinsing. Multiple rounds of paper towel blotting — surface moisture is the enemy of a clean vacuum seal." },
              { step: "4", title: "Seal with Liquid Stop enabled", detail: "Even well-dried fish releases moisture during vacuuming. LAVA's Liquid Stop detects liquid entering the hose and stops the vacuum before damage occurs. Non-negotiable for fish." },
              { step: "5", title: "Freeze flat, stack once solid", detail: "Fish fillets freeze to flat, stackable bricks that take minimal space and defrost evenly." },
            ].map(({ step, title, detail }) => (
              <div key={step} className="flex gap-4 border border-border p-4">
                <div className="h-9 w-9 bg-primary text-white font-black flex items-center justify-center shrink-0">{step}</div>
                <div>
                  <p className="font-bold text-primary text-sm">{title}</p>
                  <p className="text-xs text-copy leading-relaxed mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <Image 
            src="/images/applications/app-fishing-fillet-vacuum-sealing.webp" 
            alt="Vacuum sealing fish fillets with LAVA" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Smoked Snoek — Vacuum Sealed</h2>
          <p>
            Smoked snoek deserves better than cling wrap. Vacuum sealed smoked snoek keeps
            <strong> 4–6 weeks in the fridge and 12 months in the freezer</strong> — with all
            that distinctive smoke flavour locked in. Cool the snoek completely before sealing.
            Use the gentle pressure setting to avoid compressing the flake.
          </p>
          <div className="relative aspect-video bg-zinc-100 my-6">
            <iframe
              src="https://www.youtube-nocookie.com/embed/CgLjpQiMscw?rel=0&modestbranding=1"
              title="LAVA Vakuumierer V.200 — Räucherfisch vakuumieren"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Fish for Sous Vide</h2>
          <p>
            Fish cooked sous vide is one of the most transformative cooking techniques
            available. Precision low-temperature cooking means perfectly-cooked fish —
            every time, with zero risk of the dreaded dry, overcooked result.
          </p>
          <ul>
            <li>Yellowtail fillet: <strong>52°C for 20 minutes</strong> — silky, just-cooked</li>
            <li>Snoek: <strong>55°C for 25 minutes</strong> — holds the flake structure</li>
            <li>Kingklip: <strong>50°C for 18 minutes</strong> — delicate and moist</li>
          </ul>
          <p>Seal with butter, lemon and fresh dill directly in the bag before cooking.</p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Recommended Machine</h2>
          <div className="border border-border p-5 max-w-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-secondary mb-1">Most Popular for Anglers</p>
            <p className="font-bold text-primary text-base mb-2">V.300® Premium X</p>
            <p className="text-xs text-copy-muted leading-relaxed mb-4">42 cm sealing width. Liquid Stop is essential for fish. Handles a full day&apos;s catch in one session. The jar attachment also works with the vacuum marinating hose.</p>
            <Link href="/products/vacuum-machines" className="block text-center bg-primary text-white text-xs font-bold py-2.5 hover:bg-primary/90 transition-colors">
              View V.300 →
            </Link>
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog/vacuum-sealing-fish-south-africa" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Full Fish Sealing Guide
          </Link>
        </div>

      </div>
    </main>
  );
}