import Image from "next/image";
import Link from "next/link";
import {
  V300_ASSEMBLY_PARTS,
  V300_AUTO_STEPS,
  V300_BAG_STEPS,
  V300_CALLOUTS,
  V300_CONTAINER_STEPS,
  V300_CONTROL_PARTS,
  V300_GVAC_STEPS,
  V300_MANUAL_MODE_STEPS,
  V300_QUICK_START,
  V300_ROLL_STEPS,
  V300_SAFETY_BULLETS,
  V300_SPECS,
  V300_TOC,
  V300_TROUBLESHOOTING,
  V300_WARRANTY_VOID,
} from "@/content/v300-manual-en";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";
import { V300_MANUAL_IMAGES, V300_MANUAL_META } from "@/lib/v300-manual-images";
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

export default function V300ManualDocument() {
  return (
    <div id="manual-print-root" className="manual-document space-y-8 pb-16 print:space-y-0 print:pb-0">
      {/* ── COVER ─────────────────────────────────────────────── */}
      <ManualPage dark className="overflow-hidden">
        <div className="relative min-h-[297mm] flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0a3d3d]" />
          <div className="absolute top-0 right-0 h-64 w-64 bg-secondary/20 blur-3xl" />
          <div className="relative z-10 flex flex-1 flex-col px-10 pt-12 pb-24">
            <Image
              src={V300_MANUAL_IMAGES.logoWhite}
              alt="Lava-SA"
              width={180}
              height={48}
              unoptimized
              className="h-12 w-auto object-contain"
            />
            <div className="mt-10">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-secondary">Operating Manual</p>
              <h1 className="mt-3 font-heading text-4xl font-black leading-[1.05] text-white">
                V.300® Series
              </h1>
              <p className="mt-4 text-lg text-white/85 font-medium">
                Premium X · White · Black
              </p>
            </div>
            <div className="relative mt-8 flex-1 min-h-[200px]">
              <Image
                src={V300_MANUAL_IMAGES.cover}
                alt="LAVA V.300 Premium X, White and Black vacuum sealers"
                fill
                unoptimized
                className="object-contain object-center drop-shadow-2xl"
                sizes="210mm"
                priority
              />
            </div>
            <div className="mt-auto space-y-1 text-sm text-white/70">
              <p>English edition · {V300_MANUAL_META.version}</p>
              <p>German engineering · South African support</p>
              <p className="text-secondary font-bold">www.lava-sa.com</p>
            </div>
          </div>
          <ManualPageFooter page={1} dark />
        </div>
      </ManualPage>

      {/* ── QUICK START ─────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader
          section="Quick start"
          title="Your first seal in six steps"
          subtitle="Read the full safety section before first use. This page gets you running immediately."
        />
        <ManualBody>
          <ManualSteps steps={V300_QUICK_START} />
          <ManualCalloutBox callout={V300_CALLOUTS.interruptTip} />
          <p className="text-xs text-copy-muted pt-2">
            Use original LAVA embossed bags and rolls for best results.{" "}
            <Link href="/products/bags-rolls" className="text-primary font-bold underline">
              Shop compatible bags →
            </Link>
          </p>
        </ManualBody>
        <ManualPageFooter page={2} />
      </ManualPage>

      {/* ── CONTENTS ────────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="Contents" title="Table of contents" />
        <ManualBody>
          <ol className="space-y-2">
            {V300_TOC.map((item) => (
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

      {/* ── FOREWORD + SAFETY ───────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader
          section="1–2 · Foreword & safety"
          title="Read before first use"
          subtitle="This manual covers setup, operation, cleaning, and maintenance of LAVA V.300 vacuum sealers by Landig + Lava GmbH, distributed in South Africa by Lava-SA."
        />
        <ManualBody>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide">Safety instructions</h3>
          <ManualBulletList items={V300_SAFETY_BULLETS} />
          <ManualCalloutBox callout={V300_CALLOUTS.liquidDanger} />
        </ManualBody>
        <ManualPageFooter page={4} />
      </ManualPage>

      {/* ── WARRANTY + START-UP ─────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="3–4 · Warranty & start-up" title="Warranty, liability & installation" />
        <ManualBody>
          <p>
            <strong className="text-primary">Warranty:</strong> 2 years from delivery against material and manufacturing
            defects. Claims are non-transferable and valid for the original purchaser only.
          </p>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-2">Warranty void if</h3>
          <ManualBulletList items={V300_WARRANTY_VOID} />
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-4">Start-up checklist</h3>
          <ManualBulletList
            items={[
              "Inspect for transport damage on arrival. Contact Lava-SA if in doubt.",
              "Use only on a stable, heat-resistant, dry surface away from flammable materials.",
              "Operate at 220–240 V / 50 Hz only. Specifications are on the label under the machine.",
              "Allow the unit to cool after use. Store unplugged, out of children's reach.",
            ]}
          />
        </ManualBody>
        <ManualPageFooter page={5} />
      </ManualPage>

      {/* ── ASSEMBLY ────────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader
          section="5 · Device assembly"
          title="Know your machine"
          subtitle="Fig. 1 — General assembly (Premium X shown; White and Black share the same layout)."
        />
        <ManualBody className="pb-20">
          <ManualFigure
            src={V300_MANUAL_IMAGES.assembly}
            alt="V.300 Premium X — labelled assembly diagram"
            caption="Fig. 1 — Chamber, seals, liquid separator, bag stop, and container port."
            numberedParts={V300_ASSEMBLY_PARTS}
          />
        </ManualBody>
        <ManualPageFooter page={6} />
      </ManualPage>

      {/* ── CONTROLS ────────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="5 · Controls" title="Control panel overview" subtitle="Fig. 2 — Switches, gauge, seal time, and container hose." />
        <ManualBody className="pb-20">
          <ManualFigure
            src={V300_MANUAL_IMAGES.controls}
            alt="V.300 Premium X control panel"
            caption="Fig. 2 — Auto/manual mode, bag vs container, and manual seal button."
            numberedParts={V300_CONTROL_PARTS}
          />
        </ManualBody>
        <ManualPageFooter page={7} />
      </ManualPage>

      {/* ── SETTINGS ──────────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="6 · Settings" title="Modes, seal time & L+ regulator" />
        <ManualBody>
          <h3 className="font-black text-primary text-sm">Automatic vacuum + seal</h3>
          <ManualSteps steps={V300_AUTO_STEPS} />
          <ManualCalloutBox callout={V300_CALLOUTS.interruptTip} />

          <h3 className="font-black text-primary text-sm pt-4">Manual vacuum + seal</h3>
          <p className="text-[12px]">Ideal for bread, berries, marinated meat, and other delicate or wet foods.</p>
          <ManualSteps steps={V300_MANUAL_MODE_STEPS} />

          <h3 className="font-black text-primary text-sm pt-4">Seal time dial</h3>
          <ManualBulletList
            items={[
              "Setting 6 — 90 µm textured bags/rolls (R-Vac, E-Vac)",
              "Setting 8 — 160 µm extra-strong textured (RS-Vac, ES-Vac)",
              "Setting 10 — aluminium composite bags (I-Vac, K-Vac)",
            ]}
          />
          <ManualCalloutBox callout={V300_CALLOUTS.sealTimeTip} />
        </ManualBody>
        <ManualPageFooter page={8} />
      </ManualPage>

      {/* ── L+ & LIQUID SEPARATOR ───────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="6 · Accessories" title="L+ pressure regulation & liquid separator" />
        <ManualBody>
          <p>
            The <strong className="text-primary">L+ regulator</strong> is included in the box. Turn the adjustment screw
            ~3 mm outward, vacuum in manual mode, and dial back vacuum between −0.2 bar and full pressure for delicate
            items. Start manual seal when ready.
          </p>
          <ManualCalloutBox
            callout={{
              type: "tip",
              title: "Lid pressure during L+",
              text: "If the lid does not hold on its own with L+ wide open, press firmly during vacuum and seal. You may tighten the L+ screw ~1 second after sealing starts for a perfect seam.",
            }}
          />
          <ManualFigure
            src={V300_MANUAL_IMAGES.liquidSeparator}
            alt="Liquid separator maintenance"
            caption="Empty and rinse the liquid separator regularly — especially after wet foods."
          />
          <ManualCalloutBox callout={V300_CALLOUTS.whiteBlackNote} />
        </ManualBody>
        <ManualPageFooter page={9} />
      </ManualPage>

      {/* ── BAG OPERATION ─────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="7 · Operation" title="Vacuum sealing in bags" />
        <ManualBody>
          <ManualFigure
            src={V300_MANUAL_IMAGES.bagLoading}
            alt="Loading a vacuum bag into the V.300"
            caption="Position the open end fully under the bag stop bar."
          />
          <ManualSteps steps={V300_BAG_STEPS} />
          <ManualCalloutBox callout={V300_CALLOUTS.bagEdgeTip} />
        </ManualBody>
        <ManualPageFooter page={10} />
      </ManualPage>

      {/* ── G-VAC + AUTO ────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="7 · Smooth bags" title="G-Vac smooth bags & automatic mode" />
        <ManualBody>
          <ManualFigure
            src={V300_MANUAL_IMAGES.bagFold}
            alt="G-Vac bag folding technique"
            caption="Fig. A & B — Overlap technique for smooth seal-edge bags (min. 120 µm)."
          />
          <ManualSteps steps={V300_GVAC_STEPS} />
          <ManualFigure
            src={V300_MANUAL_IMAGES.automaticMode}
            alt="Automatic vacuum and seal cycle"
            caption="Automatic mode — one motion from vacuum to seal."
          />
        </ManualBody>
        <ManualPageFooter page={11} />
      </ManualPage>

      {/* ── ROLLS + CONTAINERS ────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="7 · Rolls & containers" title="Rolls, containers & wet foods" />
        <ManualBody>
          <h3 className="font-black text-primary text-sm">Vacuum rolls</h3>
          <ManualFigure
            src={V300_MANUAL_IMAGES.rollSealing}
            alt="Sealing a vacuum roll"
            caption="Seal the roll end first, then cut your custom bag length."
          />
          <ManualSteps steps={V300_ROLL_STEPS} />

          <h3 className="font-black text-primary text-sm pt-4">Containers & universal lids</h3>
          <ManualFigure
            src={V300_MANUAL_IMAGES.containers}
            alt="Container vacuuming with suction attachment"
            caption="Works with LAVA New-Line, G-Line, ES-Line containers and universal lids."
          />
          <ManualSteps steps={V300_CONTAINER_STEPS} />
        </ManualBody>
        <ManualPageFooter page={12} />
      </ManualPage>

      {/* ── WET & DELICATE ───────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="7 · Special foods" title="Wet, marinated & pressure-sensitive foods" />
        <ManualBody>
          <ManualCalloutBox callout={V300_CALLOUTS.liquidDanger} />
          <ManualBulletList
            items={[
              "Fill to two-thirds maximum. Chill or pre-freeze moist foods where possible.",
              "Hang the bag over the table edge so liquid does not rush toward the seal zone.",
              "Use manual mode and L+ for gentle vacuum on wet items.",
              "Consider LAVA Liquid Stop (VL0002) to protect the seal area.",
              "Seal sauces and soups in containers, or pre-freeze before bagging.",
            ]}
          />
          <ManualCalloutBox callout={V300_CALLOUTS.wetFoodTip} />
          <ManualCalloutBox callout={V300_CALLOUTS.delicateTip} />
        </ManualBody>
        <ManualPageFooter page={13} />
      </ManualPage>

      {/* ── CLEANING ──────────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="8 · Care" title="Cleaning & maintenance" />
        <ManualBody>
          <ManualFigure
            src={V300_MANUAL_IMAGES.care}
            alt="Cleaning and maintaining the V.300"
            caption="Wipe seals and sealing bar with a damp cloth only — never immerse the machine."
          />
          <ManualBulletList
            items={[
              "Unplug before cleaning. Wait for the sealing bar to cool — burn risk.",
              "Clean with a damp cloth and mild detergent only. Not dishwasher safe.",
              "Remove the bag stop bar for cleaning. Keep foam seals and glass-fabric foil spotless.",
              "Wash rectangular foam seals with soapy water after contact with liquids; dry before refitting.",
              "Service the liquid separator as shown on page 9.",
            ]}
          />
        </ManualBody>
        <ManualPageFooter page={14} />
      </ManualPage>

      {/* ── TROUBLESHOOTING ─────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="9 · Support" title="Troubleshooting" subtitle="Maintenance and repairs must use original LAVA parts. Opening the chassis voids warranty." />
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
                {V300_TROUBLESHOOTING.map((row, i) => (
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
            Pressure test video:{" "}
            <a href="https://la-va.com/en/pressure-test-v.300-series" className="text-primary underline" target="_blank" rel="noopener noreferrer">
              la-va.com/pressure-test-v.300-series
            </a>
          </p>
        </ManualBody>
        <ManualPageFooter page={15} />
      </ManualPage>

      {/* ── SPARE PARTS ───────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="10 · Parts" title="Wear parts you can replace yourself" />
        <ManualBody>
          <ManualBulletList
            items={[
              "Foam rubber seal set — thicker seal on lid, thinner on base. Rinse or replace when porous.",
              "Hard rubber sealing strip in lid — replace when surface is worn.",
              "Glass-fabric sealing foil over the wire — smooth wrinkles or replace if coated or greasy underneath.",
              "Bag stop bar — remove to empty the drip tray; contact Lava-SA for replacement.",
              "Liquid separator components — container, lid gasket, and particle filter (White/Black).",
            ]}
          />
          <p className="pt-2">
            Order parts at{" "}
            <Link href="/products/spare-parts" className="text-primary font-bold underline">
              lava-sa.com/spare-parts
            </Link>{" "}
            with your model and purchase date ready (see type plate under the machine).
          </p>
        </ManualBody>
        <ManualPageFooter page={16} />
      </ManualPage>

      {/* ── SPECS + DISPOSAL ──────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="11–12 · Specs" title="Technical data & disposal" />
        <ManualBody className="pb-20">
          <div className="overflow-hidden border border-border text-[11px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-2.5 text-left font-black">Specification</th>
                  <th className="p-2.5 text-left font-black">Premium X</th>
                  <th className="p-2.5 text-left font-black">White</th>
                  <th className="p-2.5 text-left font-black">Black</th>
                </tr>
              </thead>
              <tbody>
                {V300_SPECS.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? "bg-surface" : "bg-white"}>
                    <td className="p-2.5 border-t border-border font-bold text-primary">{row.label}</td>
                    <td className="p-2.5 border-t border-border">{row.premiumX}</td>
                    <td className="p-2.5 border-t border-border">{row.white}</td>
                    <td className="p-2.5 border-t border-border">{row.black}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] pt-4">
            <strong className="text-primary">Disposal:</strong> Do not discard in household waste. Take to an authorised
            e-waste collection point. WEEE registration DE 86929896 (Landig + Lava GmbH).
          </p>
        </ManualBody>
        <ManualPageFooter page={17} />
      </ManualPage>

      {/* ── BACK COVER ────────────────────────────────────────────── */}
      <ManualPage dark>
        <div className="relative min-h-[297mm] flex flex-col px-10 pt-14 pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-[#062828]" />
          <div className="relative z-10 flex flex-1 flex-col">
            <Image
              src={V300_MANUAL_IMAGES.logoWhite}
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
              <p>Manual ref. {V300_MANUAL_META.articleRef} · {V300_MANUAL_META.version}</p>
              <p className="text-white/40">Manufactured by Landig + Lava GmbH, Bad Saulgau, Germany</p>
            </div>
          </div>
          <ManualPageFooter page={18} dark />
        </div>
      </ManualPage>
    </div>
  );
}
