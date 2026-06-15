/**
 * V.300 Series operating manual — English (Lava-SA edition).
 * Based on Landig + Lava factory manual WL0019 (01/2025), localised for SA.
 */

export interface ManualStep {
  n: number;
  text: string;
}

export interface ManualCallout {
  type: "tip" | "warning" | "danger" | "note";
  title?: string;
  text: string;
}

export interface TroubleshootingRow {
  issue: string;
  cause: string;
  fix: string;
}

export interface SpecRow {
  label: string;
  premiumX: string;
  white: string;
  black: string;
}

export const V300_QUICK_START: ManualStep[] = [
  { n: 1, text: "Place on a dry, heat-resistant surface. Connect to 220–240 V / 50 Hz (SA mains). Switch ON — the selector lights up when ready." },
  { n: 2, text: "Set seal time on the dial: 6 for 90 µm bags (R-Vac, E-Vac), 8 for 160 µm (RS-Vac, ES-Vac), 10 for foil bags (I-Vac, K-Vac)." },
  { n: 3, text: "For bags: set container/bag switch to bag mode. Choose AUTO for everyday sealing or MANUAL for wet or delicate foods." },
  { n: 4, text: "Fill the bag to two-thirds. Fold the opening outward while filling, then fold back. Slide the open end under the bag stop bar without wrinkles." },
  { n: 5, text: "Close the lid and press firmly on both sides until the gauge moves and the lid holds under vacuum." },
  { n: 6, text: "When sealing completes, the indicator goes out and suction stops. Lift the lid and remove your sealed bag." },
];

export const V300_TOC = [
  { n: 1, title: "Foreword", page: 3 },
  { n: 2, title: "Safety instructions", page: 3 },
  { n: 3, title: "Warranty & liability", page: 4 },
  { n: 4, title: "Start-up", page: 4 },
  { n: 5, title: "Device assembly & controls", page: 5 },
  { n: 6, title: "Settings & functions", page: 7 },
  { n: 7, title: "Operation", page: 9 },
  { n: 8, title: "Cleaning & maintenance", page: 14 },
  { n: 9, title: "Troubleshooting", page: 15 },
  { n: 10, title: "Spare parts", page: 16 },
  { n: 11, title: "Disposal", page: 18 },
  { n: 12, title: "Technical specifications", page: 18 },
];

export const V300_SAFETY_BULLETS = [
  "This device is exclusively for vacuum sealing bags and vacuuming compatible LAVA containers. Any other use is improper.",
  "Inspect the device and power cable for visible damage before each use. Do not operate if damaged.",
  "Repairs must be carried out by qualified personnel using original LAVA spare parts only. Unplug before any maintenance.",
  "Do not use non-compliant adapter plugs or extension leads.",
  "Never leave the device unattended while operating.",
  "Keep out of reach of children and persons with physical, psychological, or mental impairments.",
  "Keep vacuum bags and rolls away from children — suffocation risk.",
  "Do not operate with wet hands. Protect from splashing water and steam. Never immerse in water.",
  "If the unit smokes, smells unusual, or behaves incorrectly, unplug immediately.",
  "After use, unplug by gripping the plug — not the cable.",
];

export const V300_WARRANTY_VOID = [
  "Improper use or failure to follow this manual",
  "Incorrect operation, installation, maintenance, or repair",
  "Technical modification of the device",
  "Operation on incorrect mains voltage",
  "Use of non-approved spare parts",
  "Foreign-object damage or force majeure",
  "Normal wear (foam seals, silicone seals, sealing tape, etc.)",
];

export const V300_ASSEMBLY_PARTS = [
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

export const V300_CONTROL_PARTS = [
  { n: 1, label: "ON/OFF switch" },
  { n: 2, label: "Container / bag selector" },
  { n: 3, label: "Vacuum gauge (manometer)" },
  { n: 4, label: "Seal indicator light" },
  { n: 5, label: "Liquid separator lid" },
  { n: 6, label: "Seal time dial (1–10)" },
  { n: 7, label: "Auto / manual seal mode" },
  { n: 8, label: "Manual seal start button" },
  { n: 9, label: "Container suction attachment" },
];

export const V300_AUTO_STEPS: ManualStep[] = [
  { n: 1, text: "Set the auto/manual switch (Fig. 2, No. 7) to automatic mode." },
  { n: 2, text: "Set the container/bag switch (Fig. 2, No. 2) to bag mode." },
  { n: 3, text: "Close the lid and press until the gauge shows vacuum. Suction starts automatically." },
  { n: 4, text: "At maximum vacuum the machine seals the bag. The indicator light is on during sealing." },
  { n: 5, text: "When sealing finishes, suction stops, the chamber vents, and you can open the lid." },
];

export const V300_MANUAL_MODE_STEPS: ManualStep[] = [
  { n: 1, text: "Set auto/manual (Fig. 2, No. 7) to manual mode." },
  { n: 2, text: "Set container/bag switch (Fig. 2, No. 2) to bag mode." },
  { n: 3, text: "Close the lid and press until the gauge moves." },
  { n: 4, text: "When the desired vacuum is reached, press the manual seal button (Fig. 2, No. 8)." },
];

export const V300_BAG_STEPS: ManualStep[] = [
  { n: 1, text: "Connect to mains and switch ON. Set seal time and mode (auto or manual)." },
  { n: 2, text: "Open the lid. Place food in the bag — maximum two-thirds full. Keep the seal area clean and dry." },
  { n: 3, text: "Slide the open end fully under the bag stop bar without wrinkles." },
  { n: 4, text: "Close the lid. Press both sides firmly until the lid holds under vacuum." },
  { n: 5, text: "Wait for the seal cycle to complete, then remove the bag." },
];

export const V300_GVAC_STEPS: ManualStep[] = [
  { n: 1, text: "Switch to manual seal mode." },
  { n: 2, text: "Hold the smooth bag opening with thumb and index finger on each side." },
  { n: 3, text: "Slide both thumbs left without moving your index fingers — the film overlaps at the opening (Fig. A)." },
  { n: 4, text: "Place the overlap under the stop bar (Fig. B). Air evacuates through the side overlap." },
  { n: 5, text: "Vacuum in manual mode, pressing the lid until vacuum holds, then start manual seal." },
];

export const V300_ROLL_STEPS: ManualStep[] = [
  { n: 1, text: "Switch ON. Set seal time and automatic mode." },
  { n: 2, text: "Set container/bag switch to bag mode." },
  { n: 3, text: "Do not pre-cut the roll. Feed the open end of the roll under the bag stop bar." },
  { n: 4, text: "Close the lid and press until the lid holds. The machine seals the roll end first." },
  { n: 5, text: "Open the lid, cut the bag to length, then vacuum as for a standard bag." },
];

export const V300_CONTAINER_STEPS: ManualStep[] = [
  { n: 1, text: "Attach the suction hose (Fig. 2, No. 9) to the container port (Fig. 1, No. 7)." },
  { n: 2, text: "Fill the container with cooled food. Keep rim and lid clean." },
  { n: 3, text: "Press the hose firmly onto the container valve." },
  { n: 4, text: "Set container/bag switch to container mode. Suction starts immediately." },
  { n: 5, text: "At target vacuum, return the switch to neutral or switch OFF. Remove hose from machine first, then from the valve." },
];

export const V300_TROUBLESHOOTING: TroubleshootingRow[] = [
  { issue: "Device does not run", cause: "No power or unit damaged", fix: "Check plug and outlet. Inspect cable. Contact Lava-SA if damaged." },
  { issue: "Weak pump suction", cause: "Liquid ingested, separator lid loose, or L+ screw open", fix: "Clean separator, secure lid, close L+ adjustment screw. Clean or replace foam seals." },
  { issue: "Bag not sealing properly", cause: "Dirty seal bar, worn foil, wrong seal time, or weak lid pressure", fix: "Clean bar and bag edge. Replace glass-fabric foil. Press lid firmly during seal." },
  { issue: "Poor vacuum in bag", cause: "Bag not under stop bar, dirty seals, or damaged bag", fix: "Reposition bag. Wash seals with soapy water or replace. Use a new bag." },
  { issue: "No container vacuum", cause: "Lid or valve dirty, lid not seated", fix: "Clean rim and valve. Press lid firmly when connecting hose." },
  { issue: "Auto seal does not trigger", cause: "Vacuum not reached", fix: "Clean seals, secure separator lid, close L+ screw." },
];

export const V300_SPECS: SpecRow[] = [
  { label: "Article no.", premiumX: "VL0300XP", white: "VL0300W", black: "VL0300B" },
  { label: "Mains", premiumX: "220–240 V, 50 Hz", white: "220–240 V, 50 Hz", black: "220–240 V, 50 Hz" },
  { label: "Power (max)", premiumX: "500 W", white: "600 W", black: "600 W" },
  { label: "Dimensions (W×D×H)", premiumX: "410 × 230 × 98 mm", white: "410 × 230 × 98 mm", black: "410 × 230 × 98 mm" },
  { label: "Weight", premiumX: "4.40 kg", white: "4.90 kg", black: "4.90 kg" },
];

export const V300_CALLOUTS = {
  sealTimeTip: {
    type: "tip" as const,
    title: "Seal time tip",
    text: "After sealing about five bags, the bar is warm and you can reduce seal time by 2–3 steps.",
  },
  interruptTip: {
    type: "tip" as const,
    title: "Pause or stop",
    text: "To interrupt a cycle, set the container/bag switch to the centre (neutral) position or switch the machine OFF. The lid can then be opened.",
  },
  bagEdgeTip: {
    type: "tip" as const,
    title: "Keep the seal zone clean",
    text: "Fold the bag opening outward before filling, then fold back. Food must not touch the area where the seal is made.",
  },
  liquidDanger: {
    type: "danger" as const,
    title: "Liquid warning",
    text: "Never allow meat juice or sauces to be sucked into the pump. Pump damage from liquids is not covered under warranty.",
  },
  wetFoodTip: {
    type: "tip" as const,
    title: "Marinating & sous-vide",
    text: "For wet marinades, place food in a household freezer bag inside the vacuum bag. The inner bag contains the liquid; the outer LAVA bag stays clean and reusable.",
  },
  delicateTip: {
    type: "tip" as const,
    title: "Bread & berries",
    text: "Freeze delicate items overnight, then vacuum at full pressure for best shelf life. Snip a corner before thawing so expansion does not crush the contents.",
  },
  whiteBlackNote: {
    type: "note" as const,
    title: "White & Black editions",
    text: "The liquid separator on V.300 White and Black includes a particle filter. Remove and rinse it when cleaning the separator.",
  },
};
