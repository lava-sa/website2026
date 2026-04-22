import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle, Thermometer } from "lucide-react";

export const metadata: Metadata = {
  title: "Dry Aging Beef at Home — Complete South African Guide",
  description:
    "Dry-aged steak costs R400+ in a restaurant. With a LAVA vacuum sealer and your fridge, you can achieve similar results at home. Complete step-by-step guide.",
};

export default function DryAgingPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary">Dry Aging Beef at Home</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Dry-aged steak at a restaurant costs R400–R600 per portion. The process at home costs
            the price of the beef plus some fridge space and patience. Here&apos;s everything you
            need to know.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/lava-0008.jpg" alt="LAVA V300 with aged beef cuts" fill className="object-cover" />
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mt-2 mb-4">What Is Dry Aging?</h2>
          <p>
            Dry aging is the process of storing beef (or other meats) in a controlled environment
            for an extended period — typically 21 to 45 days — to allow enzymatic breakdown of
            muscle fibres and moisture evaporation. The result is:
          </p>
          <ul>
            <li><strong>Intensified beef flavour</strong> — moisture loss concentrates the flavour compounds</li>
            <li><strong>Exceptional tenderness</strong> — natural enzymes break down muscle fibres over time</li>
            <li><strong>Complex nutty, buttery notes</strong> — unique flavour compounds develop during aging</li>
          </ul>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="bg-primary text-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Traditional Dry Aging</p>
              <ul className="text-sm text-white/80 space-y-1 pl-3">
                <li>• Entire primals in dedicated cold room</li>
                <li>• 21–45 days at 0–2°C with airflow</li>
                <li>• 15–25% weight loss to evaporation</li>
                <li>• Surface crust must be trimmed</li>
                <li>• Requires dedicated equipment</li>
              </ul>
            </div>
            <div className="bg-surface border border-border p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Home Fridge Method</p>
              <ul className="text-sm text-copy space-y-1 pl-3">
                <li>• Works on individual steaks or cuts</li>
                <li>• 5–14 days produces excellent results</li>
                <li>• Minimal weight loss</li>
                <li>• No trimming required if done correctly</li>
                <li>• Your existing fridge is the equipment</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Method 1: Dry Aging in the Fridge (No Vacuum Sealer Needed)</h2>
          <p>
            The simplest home dry aging method requires only a wire rack, your fridge, and time:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-relaxed text-copy my-4">
            <li>Buy a thick cut (ribeye, sirloin, rump) — minimum 4 cm thick, bone-in preferred</li>
            <li>Pat completely dry with paper towel</li>
            <li>Place on a wire rack over a tray (for airflow)</li>
            <li>Set fridge to 0–2°C — ideally the coldest shelf at the back</li>
            <li>Leave uncovered for 5–14 days, turning once daily</li>
            <li>A dry, dark crust will form on the surface — this is correct</li>
            <li>Trim the outer crust and cook immediately</li>
          </ol>
          <p><strong>Result at 7 days:</strong> Noticeably more tender, slightly concentrated flavour.</p>
          <p><strong>Result at 14 days:</strong> Significant tenderness improvement, developing umami complexity.</p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Method 2: Vacuum-Assisted Aging (Better Results, Zero Waste)</h2>
          <p>
            Using a LAVA vacuum sealer and the &ldquo;wet aging&rdquo; technique produces consistent
            results without the moisture loss or surface trimming of traditional dry aging:
          </p>

          <div className="space-y-4 my-6">
            {[
              { step: "1", title: "Start with quality beef", detail: "Aging improves good beef dramatically. It does less for poor-quality cuts. Matured domestic beef is ideal — ask your butcher for cuts that have been properly cooled (not stress-chilled). Rib-eye, T-bone, rump and sirloin are all excellent candidates." },
              { step: "2", title: "Pat dry and vacuum seal immediately", detail: "Remove any excess moisture. Seal in a LAVA vacuum bag with no marinade or seasoning. The enzymes in the meat do all the work — nothing else is needed." },
              { step: "3", title: "Refrigerate at 0–2°C for 7–28 days", detail: "Place the vacuum-sealed bag at the coldest point in your fridge. The enzymes work best at just above freezing. Check every few days — the bag should remain tight. Any loosening indicates a seal failure and the meat should be used immediately." },
              { step: "4", title: "Monitor and use within timeframe", detail: "7–14 days: excellent results for most home cooks. 21–28 days: significantly more complex, intensely tender results for serious steak enthusiasts. Beyond 28 days requires commercial-grade consistency of temperature and is not recommended for home fridges." },
              { step: "5", title: "Open, dry, rest and cook", detail: "Remove the steak from the bag. Discard the bag and any accumulated liquid. Pat dry thoroughly. Rest at room temperature for 45–60 minutes before cooking. A hot cast iron pan, braai or grill at maximum heat gives the best result." },
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

          <div className="bg-amber-50 border border-amber-200 p-5 flex gap-3 my-8">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 mb-1">Critical Temperature Requirement</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Aging meat requires consistent refrigeration at 0–2°C. If your fridge fluctuates
                significantly (as many do during load shedding), <strong>do not attempt extended aging</strong>.
                Use the meat within 7 days of sealing, or freeze it immediately. Partially thawed and
                re-cooled aged meat is a food safety risk.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">What Cuts Work Best?</h2>
          <table className="w-full text-sm border border-border mb-8">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Cut</th>
                <th className="text-left py-3 px-4 font-bold">Ideal Aging Period</th>
                <th className="text-left py-3 px-4 font-bold">Result</th>
                <th className="text-left py-3 px-4 font-bold">Best Cooking Method</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rib-eye (bone-in)", "14–21 days", "Exceptional — most recommended", "Hot pan or braai, 4–6 min/side"],
                ["Sirloin / T-bone", "14–21 days", "Excellent tenderness gain", "Braai or cast iron"],
                ["Rump steak", "7–14 days", "Significant improvement", "Braai, medium-rare"],
                ["Fillet", "7–10 days", "Subtle improvement only — already tender", "Pan seared, butter-basted"],
                ["Game (venison backstrap)", "7–14 days", "Dramatic improvement in flavour complexity", "Medium-rare only — don't overcook"],
              ].map(([cut, period, result, method]) => (
                <tr key={cut} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-bold text-primary">{cut}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary">{period}</td>
                  <td className="py-2.5 px-4 text-copy text-xs">{result}</td>
                  <td className="py-2.5 px-4 text-copy-muted text-xs">{method}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Watch: V.300 Premium with Beef</h2>
          <div className="relative aspect-video bg-zinc-100 mb-4">
            <iframe
              src="https://www.youtube-nocookie.com/embed/WFt1dapyhvk?rel=0&modestbranding=1"
              title="LAVA V.300 Premium — Test Review"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 p-5 mt-8">
            <div className="flex items-start gap-3">
              <Thermometer className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-primary mb-1">Which LAVA for Dry Aging?</p>
                <p className="text-sm text-copy leading-relaxed mb-3">
                  Any LAVA machine with a 42 cm+ sealing width handles most home aging cuts.
                  The <strong>V.300 Premium X</strong> is the most popular choice — it seals a
                  full bone-in rib-eye or T-bone with room to spare, and the pressure control
                  setting lets you reduce vacuum for delicate aged steaks.
                </p>
                <Link href="/products/vacuum-machines" className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                  View V.300 Premium X →
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/vacuum-packaging/meat-aging" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Read: Meat Aging in a Vacuum →
          </Link>
        </div>

      </div>
    </main>
  );
}
