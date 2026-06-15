import type { MachineDownload, MachineVideo } from "@/lib/machine-content";

/** la-va.com product page — videos + factory PDF until Lava-SA manual exists */
function laVaPage(slug: string): string {
  const paths: Record<string, string> = {
    "v100-premium-x": "vacuum-sealer-v.100-premium-x",
    "v200-premium": "vacuum-sealer-v.200-premium",
    "v300-premium-x": "vacuum-sealer-v.300-premium-x",
    "v300-white": "vacuum-sealer-v.300-premium-x",
    "v300-black": "vacuum-sealer-v.300-premium-x",
    "v333-chrome": "vacuum-sealer-v.333-chrome",
    "v350-premium": "vacuum-sealer-v.350-premium",
    "v400-premium": "vacuum-sealer-v.400-premium",
    "v500-premium": "vacuum-sealer-v.500-premium",
    "v500-premium-xxl": "vacuum-sealer-v.500-premium-xxl",
  };
  const path = paths[slug] ?? "vacuum-sealers";
  return `https://la-va.com/en/${path}/`;
}

function defaultVideo(name: string, slug: string): MachineVideo {
  return {
    title: `${name} — Vacuum sealing in action`,
    description: `Watch the ${name} handle everyday vacuum-sealing tasks from start to finish.`,
    embedUrl: `${laVaPage(slug)}#videos`,
  };
}

function factoryManualDownload(name: string, slug: string): MachineDownload {
  return {
    title: `${name} — Operating Manual (English)`,
    description: "Full setup, operation, maintenance and troubleshooting guide.",
    href: laVaPage(slug),
    language: "English",
    fileType: "PDF",
    membersOnly: true,
  };
}

const v100Manual: MachineDownload = {
  title: "V.100 Premium X — Operating Manual (English)",
  description: "Lava-SA edition — portrait format. Open online or save as PDF.",
  href: "/manuals/v100-premium-x",
  language: "English",
  fileType: "PDF",
  membersOnly: true,
};

const v300Manual: MachineDownload = {
  title: "V.300 Series — Operating Manual (English)",
  description: "Lava-SA edition — portrait format. Open online or save as PDF.",
  href: "/manuals/v300-series",
  language: "English",
  fileType: "PDF",
  membersOnly: true,
};

const V100_SLUGS = new Set(["v100-premium-x"]);
const V300_SLUGS = new Set(["v300-premium-x", "v300-white", "v300-black"]);

export function getDefaultMachineVideos(slug: string, machineName: string): MachineVideo[] {
  return [defaultVideo(machineName, slug)];
}

export function getDefaultMachineDownloads(slug: string, machineName: string): MachineDownload[] {
  if (V100_SLUGS.has(slug)) {
    return [v100Manual];
  }
  if (V300_SLUGS.has(slug)) {
    return [v300Manual];
  }
  return [factoryManualDownload(machineName, slug)];
}
