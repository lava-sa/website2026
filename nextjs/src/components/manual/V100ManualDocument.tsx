import Image from "next/image";
import Link from "next/link";
import {
  V100_ASSEMBLY_PARTS,
  V100_BAG_STEPS,
  V100_CALLOUTS,
  V100_CONTAINER_STEPS,
  V100_CONTROL_PARTS,
  V100_GVAC_STEPS,
  V100_MANUAL_STEPS,
  V100_QUICK_START,
  V100_ROLL_STEPS,
  V100_SAFETY_BULLETS,
  V100_TOC,
  V100_TROUBLESHOOTING,
} from "@/content/v100-manual-en";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";
import { V100_MANUAL_IMAGES, V100_MANUAL_META } from "@/lib/v100-manual-images";
import {
  ManualBody,
  ManualBulletList,
  ManualCalloutBox,
  ManualFigure,
  ManualPage,
  ManualPageFooter,
  ManualPageHeader,
  ManualSteps,
} from "@/components/manual/ManualPrimitives";

export default function V100ManualDocument() {
  return (
    <div id="manual-print-root" className="manual-document space-y-8 pb-16 print:space-y-0 print:pb-0">
      {/* COVER */}
      <ManualPage dark className="overflow-hidden">
        <div className="relative min-h-[297mm] flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0a3d3d]" />
          <div className="absolute top-0 right-0 h-64 w-64 bg-secondary/20 blur-3xl" />
          <div className="relative z-10 flex flex-1 flex-col px-10 pt-12 pb-24">
            <Image
              src={V100_MANUAL_IMAGES.logoWhite}
              alt="Lava-SA"
              width={180}
              height={48}
              unoptimized
              className="h-12 w-auto object-contain"
            />
            <div className="mt-10">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-secondary">Operating Manual</p>
              <h1 className="mt-3 font-heading text-4xl font-black leading-[1.05] text-white">
                {V100_MANUAL_META.model}
              </h1>
              <p className="mt-4 text-lg text-white/85 font-medium">
                Manual vacuum · double seal · 340 mm bar
              </p>
            </div>
            <div className="relative mt-8 flex-1 min-h-[220px]">
              <Image
                src={V100_MANUAL_IMAGES.cover}
                alt="LAVA V.100 Premium X vacuum sealer"
                fill
                unoptimized
                className="object-contain object-center drop-shadow-2xl"
                sizes="210mm"
                priority
              />
            </div>
            <div className="mt-auto space-y-1 text-sm text-white/70">
              <p>English edition · {V100_MANUAL_META.version}</p>
              <p>German engineering · South African support</p>
              <p className="text-secondary font-bold">www.lava-sa.com</p>
            </div>
          </div>
          <ManualPageFooter page={1} dark />
        </div>
      </ManualPage>

      {/* QUICK START */}
      <ManualPage>
        <ManualPageHeader
          section="Quick start"
          title="Your first seal in six steps"
          subtitle="The V.100 is fully manual — you watch the bar display and press seal when ready."
        />
        <ManualBody>
          <ManualSteps steps={V100_QUICK_START} />
          <ManualCalloutBox callout={V100_CALLOUTS.ventTip} />
          <ManualCalloutBox callout={V100_CALLOUTS.doubleSeal} />
          <p className="text-xs text-copy-muted pt-2">
            Use original LAVA embossed bags.{" "}
            <Link href="/products/bags-rolls" className="text-primary font-bold underline">
              Shop compatible bags →
            </Link>
          </p>
        </ManualBody>
        <ManualPageFooter page={2} />
      </ManualPage>

      {/* TOC */}
      <ManualPage>
        <ManualPageHeader section="Contents" title="Table of contents" />
        <ManualBody>
          <ol className="space-y-2">
            {V100_TOC.map((item) => (
              <li key={item.n} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 text-sm">
                <span>
                  <span className="font-black text-primary mr-2">{item.n}.</span>
                  {item.title}
                </span>
                <span className="text-copy-muted tabular-nums">{item.page}</span>
              </li>
            ))}
          </ol>
        </ManualBody>
        <ManualPageFooter page={3} />
      </ManualPage>

      {/* SAFETY + WARRANTY */}
      <ManualPage>
        <ManualPageHeader
          section="1–2 · Foreword & safety"
          title="Read before first use"
          subtitle="Operating manual for the LAVA V.100 Premium X by Landig + Lava GmbH, distributed in South Africa by Lava-SA."
        />
        <ManualBody>
          <ManualBulletList items={V100_SAFETY_BULLETS} />
          <ManualCalloutBox callout={V100_CALLOUTS.liquidDanger} />
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-4">Warranty</h3>
          <p className="text-[13px]">
            2 years from delivery against material and manufacturing defects. Void if misused, modified, or repaired
            with non-original parts. Wear items (seals, sealing tape) are excluded.
          </p>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-4">Start-up</h3>
          <ManualBulletList
            items={[
              "Inspect for transport damage on arrival.",
              "Use on a stable, heat-resistant, dry surface.",
              "Operate at 220–240 V / 50 Hz only.",
              "Allow to cool after use. Store unplugged, out of children's reach.",
            ]}
          />
        </ManualBody>
        <ManualPageFooter page={4} />
      </ManualPage>

      {/* ASSEMBLY */}
      <ManualPage>
        <ManualPageHeader section="3 · Device assembly" title="Know your machine" subtitle="Fig. 1 — Chamber layout." />
        <ManualBody className="pb-20">
          <ManualFigure
            src={V100_MANUAL_IMAGES.assembly}
            alt="V.100 Premium X — labelled assembly"
            caption="Fig. 1 — Seals, liquid separator, bag stop, container port."
            numberedParts={V100_ASSEMBLY_PARTS}
          />
        </ManualBody>
        <ManualPageFooter page={5} />
      </ManualPage>

      {/* CONTROLS */}
      <ManualPage>
        <ManualPageHeader section="3 · Controls" title="Control panel overview" subtitle="Fig. 2 — Manual seal, vent, and bar display." />
        <ManualBody className="pb-20">
          <ManualFigure
            src={V100_MANUAL_IMAGES.controls}
            alt="V.100 Premium X control panel"
            caption="Fig. 2 — The V.100 has no automatic mode; you control vacuum and seal."
            numberedParts={V100_CONTROL_PARTS}
          />
        </ManualBody>
        <ManualPageFooter page={6} />
      </ManualPage>

      {/* MANUAL MODE */}
      <ManualPage>
        <ManualPageHeader section="4 · Settings" title="Manual vacuum, seal time & L+" />
        <ManualBody>
          <h3 className="font-black text-primary text-sm">Manual vacuum + seal</h3>
          <ManualSteps steps={V100_MANUAL_STEPS} />
          <ManualCalloutBox callout={V100_CALLOUTS.ventTip} />

          <h3 className="font-black text-primary text-sm pt-4">Seal time dial</h3>
          <ManualBulletList
            items={[
              "Setting 6 — 90 µm textured bags/rolls (R-Vac, E-Vac)",
              "Setting 8 — 160 µm extra-strong (RS-Vac, ES-Vac)",
              "Setting 10 — aluminium composite (I-Vac, K-Vac)",
            ]}
          />
          <ManualCalloutBox callout={V100_CALLOUTS.sealTimeTip} />

          <h3 className="font-black text-primary text-sm pt-4">Liquid separator</h3>
          <p className="text-[13px]">
            Empty and rinse regularly. Pull out the separator, remove the lid, empty, wash with clear water, dry,
            and reinsert with the rubber seal in place.
          </p>
          <ManualCalloutBox callout={V100_CALLOUTS.lPlusNote} />
        </ManualBody>
        <ManualPageFooter page={7} />
      </ManualPage>

      {/* BAGS */}
      <ManualPage>
        <ManualPageHeader section="5 · Operation" title="Vacuum sealing in bags" />
        <ManualBody>
          <ManualFigure
            src={V100_MANUAL_IMAGES.bagLoading}
            alt="Loading a bag into the V.100"
            caption="Position the open end fully under the bag stop bar."
          />
          <ManualSteps steps={V100_BAG_STEPS} />
          <ManualCalloutBox callout={V100_CALLOUTS.bagEdgeTip} />
        </ManualBody>
        <ManualPageFooter page={8} />
      </ManualPage>

      {/* G-VAC + ROLLS */}
      <ManualPage>
        <ManualPageHeader section="5 · Smooth bags & rolls" title="G-Vac technique and roll sealing" />
        <ManualBody>
          <ManualFigure
            src={V100_MANUAL_IMAGES.bagFold}
            alt="G-Vac bag folding technique"
            caption="Fig. A & B — Overlap technique for smooth bags (min. 120 µm)."
          />
          <ManualSteps steps={V100_GVAC_STEPS} />
          <ManualFigure
            src={V100_MANUAL_IMAGES.rollSealing}
            alt="Sealing a vacuum roll"
            caption="Seal the roll end first, then cut your custom bag length."
          />
          <ManualSteps steps={V100_ROLL_STEPS} />
        </ManualBody>
        <ManualPageFooter page={9} />
      </ManualPage>

      {/* CONTAINERS + WET */}
      <ManualPage>
        <ManualPageHeader section="5 · Containers & special foods" title="Containers, wet & delicate foods" />
        <ManualBody>
          <ManualFigure
            src={V100_MANUAL_IMAGES.containers}
            alt="Container vacuuming with V.100"
            caption="Works with LAVA New-Line, G-Line, ES-Line containers and universal lids."
          />
          <ManualSteps steps={V100_CONTAINER_STEPS} />
          <ManualCalloutBox callout={V100_CALLOUTS.liquidDanger} />
          <ManualBulletList
            items={[
              "Fill to two-thirds. Chill or pre-freeze moist foods.",
              "Hang the bag over the table edge when vacuuming wet items.",
              "Consider LAVA Liquid Stop (VL0002) and optional L+ regulator.",
              "Freeze bread and berries overnight for best shelf life with full vacuum.",
            ]}
          />
        </ManualBody>
        <ManualPageFooter page={10} />
      </ManualPage>

      {/* CLEANING */}
      <ManualPage>
        <ManualPageHeader section="6 · Care" title="Cleaning & maintenance" />
        <ManualBody>
          <ManualBulletList
            items={[
              "Unplug before cleaning. Wait for the sealing bar to cool.",
              "Wipe with a damp cloth and mild detergent only — not dishwasher safe.",
              "Remove the bag stop bar for cleaning. Keep foam seals and glass-fabric foil spotless.",
              "Wash rectangular foam seals with soapy water after contact with liquids.",
            ]}
          />
        </ManualBody>
        <ManualPageFooter page={11} />
      </ManualPage>

      {/* TROUBLESHOOTING */}
      <ManualPage>
        <ManualPageHeader section="7 · Support" title="Troubleshooting" />
        <ManualBody className="pb-20">
          <div className="overflow-hidden border border-border text-[11px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white text-left">
                  <th className="p-2.5 font-black">Symptom</th>
                  <th className="p-2.5 font-black">Likely cause</th>
                  <th className="p-2.5 font-black">What to do</th>
                </tr>
              </thead>
              <tbody>
                {V100_TROUBLESHOOTING.map((row, i) => (
                  <tr key={row.issue} className={i % 2 ? "bg-surface" : "bg-white"}>
                    <td className="p-2.5 align-top font-bold text-primary border-t border-border">{row.issue}</td>
                    <td className="p-2.5 align-top border-t border-border">{row.cause}</td>
                    <td className="p-2.5 align-top border-t border-border">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-copy-muted pt-3">
            Pressure test:{" "}
            <a
              href="https://www.la-va.com/en/pressure-test-v.100-premium-x"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              la-va.com/pressure-test-v.100-premium-x
            </a>
          </p>
        </ManualBody>
        <ManualPageFooter page={12} />
      </ManualPage>

      {/* SPARE PARTS + SPECS */}
      <ManualPage>
        <ManualPageHeader section="8–9 · Parts & specs" title="Wear parts & technical data" />
        <ManualBody>
          <ManualBulletList
            items={[
              "Foam rubber seal set — thicker seal on lid, thinner on base.",
              "Hard rubber sealing strip in lid.",
              "Glass-fabric sealing foil over the wire.",
              "Bag stop bar — remove to empty drip tray.",
              "Liquid separator — container, lid gasket.",
            ]}
          />
          <p className="pt-3 text-[13px]">
            Order at{" "}
            <Link href="/products/spare-parts" className="text-primary font-bold underline">
              lava-sa.com/spare-parts
            </Link>
          </p>
          <div className="mt-6 overflow-hidden border border-border text-[12px]">
            <table className="w-full border-collapse">
              <tbody>
                {[
                  ["Model", "V.100 Premium X"],
                  ["Article no.", "VL0100XP"],
                  ["Mains", "220–240 V, 50 Hz"],
                  ["Power (max)", "500 W"],
                  ["Seal width", "340 mm (double seal)"],
                  ["Dimensions (W×D×H)", "410 × 230 × 98 mm"],
                  ["Weight", "4.40 kg"],
                ].map(([label, value], i) => (
                  <tr key={label} className={i % 2 ? "bg-surface" : "bg-white"}>
                    <td className="p-2.5 font-bold text-primary border-t border-border w-2/5">{label}</td>
                    <td className="p-2.5 border-t border-border">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] pt-4 text-copy-muted">
            WEEE registration DE 86929896. Do not dispose in household waste.
          </p>
        </ManualBody>
        <ManualPageFooter page={13} />
      </ManualPage>

      {/* BACK COVER */}
      <ManualPage dark>
        <div className="relative min-h-[297mm] flex flex-col px-10 pt-14 pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-[#062828]" />
          <div className="relative z-10 flex flex-1 flex-col">
            <Image
              src={V100_MANUAL_IMAGES.logoWhite}
              alt="Lava-SA"
              width={160}
              height={42}
              unoptimized
              className="h-10 w-auto"
            />
            <h2 className="mt-10 font-heading text-3xl font-black text-white leading-tight">
              Local support.<br />German engineering.
            </h2>
            <div className="mt-8 space-y-3 text-sm text-white/85">
              <p>
                <span className="text-secondary font-black uppercase text-[10px] tracking-widest block mb-1">Sales & support</span>
                {ANNEKE_PHONE.displayLocal} (Anneke)
              </p>
              <p>
                <span className="text-secondary font-black uppercase text-[10px] tracking-widest block mb-1">Office</span>
                {MAIN_PHONE.displayLocal}
              </p>
              <p>
                <span className="text-secondary font-black uppercase text-[10px] tracking-widest block mb-1">Web</span>
                www.lava-sa.com
              </p>
            </div>
            <div className="mt-auto pt-12 border-t border-white/15 text-[11px] text-white/60 space-y-1">
              <p>2-year manufacturer warranty · Nationwide courier delivery</p>
              <p>Manual ref. {V100_MANUAL_META.articleRef} · {V100_MANUAL_META.version}</p>
            </div>
          </div>
          <ManualPageFooter page={14} dark />
        </div>
      </ManualPage>
    </div>
  );
}
