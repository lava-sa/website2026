import type { BenefitBlockId } from "@/lib/machine-benefits";

/** Search- and AI-friendly section headings for vacuum-machine PDPs. */
export function getMachinePdpHeadings(machineName: string) {
  return {
    about: `About the ${machineName} Vacuum Sealer`,
    specs: `${machineName} Technical Specifications`,
    bags: `Embossed Vacuum Bags for the ${machineName}`,
    rolls: `Embossed Vacuum Rolls for the ${machineName}`,
    compatibility: `Which Bags & Rolls Fit the ${machineName}?`,
    industries: `${machineName}: Industries & Use Cases`,
    reviews: `${machineName} Customer Reviews`,
    relatedIndustrial: "Compare Other LAVA Industrial Vacuum Sealers",
    relatedMachines: "Compare Other LAVA Home & Commercial Sealers",
    functions: `${machineName} Functions & Features`,
    delivery: `${machineName} — What's in the Box`,
    videos: `Watch the ${machineName} in Action`,
    tests: `${machineName} Independent Test Reports`,
    downloads: `${machineName} Manuals & Datasheets`,
    faq: `${machineName} — Frequently Asked Questions`,
  } as const;
}

/** Benefit block H2s with machine name + search intent (defaults stay in admin). */
export function getBenefitBlockHeading(
  blockId: BenefitBlockId,
  machineName: string,
  fallbackTitle: string
): string {
  const headings: Record<BenefitBlockId, string> = {
    welding: `${machineName}: One-Button Vacuum Welding`,
    double_seal: `Double Seal Technology on the ${machineName}`,
    containers: `Vacuum Containers & Jars with the ${machineName}`,
    variety: `What You Can Seal with the ${machineName}`,
    germany: `${machineName} — German Engineering Since 1982`,
  };
  return headings[blockId] ?? fallbackTitle;
}
