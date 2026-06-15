/**
 * V.100 Premium X operating manual — English (Lava-SA edition).
 * Based on Landig + Lava factory manual WL0015 (01/2025).
 */

import type { ManualCallout, ManualStep, TroubleshootingRow } from "@/content/v300-manual-en";

export const V100_QUICK_START: ManualStep[] = [
  { n: 1, text: "Place on a dry, heat-resistant surface. Connect to 220–240 V / 50 Hz. Switch ON — the selector lights up when ready." },
  { n: 2, text: "Set seal time: 6 for 90 µm bags (R-Vac, E-Vac), 8 for 160 µm (RS-Vac, ES-Vac), 10 for foil bags (I-Vac, K-Vac)." },
  { n: 3, text: "Set container/bag switch to bag mode. Fill the bag to two-thirds. Slide the open end under the bag stop bar." },
  { n: 4, text: "Close the lid and press until the bar display shows vacuum building." },
  { n: 5, text: "When the desired vacuum is reached, press the manual seal button. Wait for the seal light to finish." },
  { n: 6, text: "Press the vent button, open the lid, and remove your bag. The V.100 is manual — you control vacuum and seal." },
];

export const V100_TOC = [
  { n: 1, title: "Foreword & safety", page: 4 },
  { n: 2, title: "Warranty & start-up", page: 4 },
  { n: 3, title: "Device assembly & controls", page: 5 },
  { n: 4, title: "Manual mode & seal time", page: 7 },
  { n: 5, title: "Operation", page: 8 },
  { n: 6, title: "Cleaning & maintenance", page: 11 },
  { n: 7, title: "Troubleshooting", page: 12 },
  { n: 8, title: "Spare parts", page: 13 },
  { n: 9, title: "Technical specifications", page: 13 },
];

export const V100_SAFETY_BULLETS = [
  "This device is exclusively for vacuum sealing bags and vacuuming compatible LAVA containers.",
  "Inspect the device and power cable before each use. Do not operate if damaged.",
  "Repairs must use original LAVA parts. Unplug before maintenance.",
  "Never leave unattended while operating. Keep away from children.",
  "Keep bags and rolls away from children — suffocation risk.",
  "Do not use with wet hands. Protect from water and steam. Never immerse.",
  "Unplug immediately if smoke, unusual smell, or malfunction occurs.",
  "After use, unplug by gripping the plug — not the cable.",
];

export const V100_ASSEMBLY_PARTS = [
  { n: 1, label: "Hard rubber sealing strip in the lid" },
  { n: 2, label: "Upper foam rubber seal" },
  { n: 3, label: "ON/OFF switch" },
  { n: 4, label: "Sealing bar with glass-fabric foil" },
  { n: 5, label: "Removable liquid separator" },
  { n: 6, label: "Removable bag stop bar" },
  { n: 7, label: "Container vacuum port" },
  { n: 8, label: "Magnet for LCS (Lava Close System)" },
  { n: 9, label: "Lower foam rubber seal" },
];

export const V100_CONTROL_PARTS = [
  { n: 1, label: "ON/OFF switch" },
  { n: 2, label: "Seal time dial (1–10)" },
  { n: 3, label: "Seal indicator light" },
  { n: 4, label: "Manual vent button" },
  { n: 5, label: "Liquid separator lid" },
  { n: 6, label: "Vacuum bar display" },
  { n: 7, label: "Container / bag selector" },
  { n: 8, label: "Manual seal start button" },
  { n: 9, label: "Container suction attachment" },
];

export const V100_MANUAL_STEPS: ManualStep[] = [
  { n: 1, text: "Set container/bag switch (Fig. 2, No. 7) to bag mode." },
  { n: 2, text: "Close the lid and press until the bar display shows vacuum." },
  { n: 3, text: "When the desired vacuum is reached, press the manual seal button (Fig. 2, No. 8)." },
  { n: 4, text: "After sealing completes, press the vent button (Fig. 2, No. 4) and open the lid." },
];

export const V100_BAG_STEPS: ManualStep[] = [
  { n: 1, text: "Switch ON. Set seal time. Open the lid and set bag mode on the selector." },
  { n: 2, text: "Fill the bag to two-thirds maximum. Keep the seal zone clean and dry." },
  { n: 3, text: "Slide the open end fully under the bag stop bar without wrinkles." },
  { n: 4, text: "Close the lid and press until vacuum builds on the bar display." },
  { n: 5, text: "Press manual seal when ready. Vent the chamber before opening the lid." },
];

export const V100_GVAC_STEPS: ManualStep[] = [
  { n: 1, text: "Hold the smooth bag opening with thumb and index finger on each side." },
  { n: 2, text: "Slide both thumbs left — the film overlaps at the opening (Fig. A)." },
  { n: 3, text: "Place the overlap under the stop bar (Fig. B). Air evacuates through the sides." },
  { n: 4, text: "Vacuum until the lid holds, then start manual seal. Vent before opening." },
];

export const V100_ROLL_STEPS: ManualStep[] = [
  { n: 1, text: "Switch ON. Set seal time and bag mode." },
  { n: 2, text: "Feed the open end of the roll under the bag stop bar — do not pre-cut." },
  { n: 3, text: "Close the lid until vacuum holds, then press manual seal." },
  { n: 4, text: "Vent, open, cut the bag to length, then vacuum as a standard bag." },
];

export const V100_CONTAINER_STEPS: ManualStep[] = [
  { n: 1, text: "Attach the suction hose to the container port (Fig. 1, No. 7)." },
  { n: 2, text: "Fill the container with cooled food. Keep rim and lid clean." },
  { n: 3, text: "Set selector to container mode. Suction starts immediately." },
  { n: 4, text: "At target vacuum, return switch to neutral or switch OFF. Remove hose from machine first." },
];

export const V100_TROUBLESHOOTING: TroubleshootingRow[] = [
  { issue: "Device does not run", cause: "No power or unit damaged", fix: "Check plug and outlet. Contact Lava-SA if damaged." },
  { issue: "Weak pump suction", cause: "Liquid ingested or separator lid loose", fix: "Clean separator, secure lid. Clean or replace foam seals." },
  { issue: "Bag not sealing properly", cause: "Dirty seal bar, wrong seal time, weak lid pressure", fix: "Clean bar and bag edge. Press lid firmly during seal." },
  { issue: "Poor vacuum in bag", cause: "Bag not under stop bar or dirty seals", fix: "Reposition bag. Wash seals with soapy water or replace." },
  { issue: "No container vacuum", cause: "Dirty lid, valve, or rim", fix: "Clean rim and valve thoroughly. Press lid firmly when connecting." },
];

export const V100_CALLOUTS = {
  sealTimeTip: {
    type: "tip" as const,
    title: "Seal time tip",
    text: "After sealing about five bags, the bar is warm — reduce seal time by 2–3 steps.",
  },
  ventTip: {
    type: "tip" as const,
    title: "Always vent",
    text: "The V.100 requires you to press the vent button (Fig. 2, No. 4) before opening the lid. Under vacuum the lid will not open.",
  },
  bagEdgeTip: {
    type: "tip" as const,
    title: "Keep the seal zone clean",
    text: "Fold the bag opening outward while filling, then fold back before sealing.",
  },
  liquidDanger: {
    type: "danger" as const,
    title: "Liquid warning",
    text: "Never allow meat juice or sauces into the pump. Liquid damage is not covered under warranty.",
  },
  lPlusNote: {
    type: "note" as const,
    title: "L+ pressure regulator (optional)",
    text: "The L+ regulator is not included with the V.100 but can be ordered from Lava-SA for gentler vacuum on bread, berries, and wet foods.",
  },
  doubleSeal: {
    type: "tip" as const,
    title: "Double seal",
    text: "The V.100 Premium X creates two parallel seal lines for extra freezer and sous-vide security.",
  },
};
