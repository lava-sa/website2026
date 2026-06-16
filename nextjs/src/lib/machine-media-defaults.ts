import type { MachineDownload, MachineVideo } from "@/lib/machine-content";
import { youTubeWatchUrl } from "@/lib/youtube";

/**
 * Default YouTube demos per machine — LAVA Germany channel (@la.va_vakuumverpackung).
 * Override per product in Admin → Machine content → YouTube URL.
 * la-va.com product pages rarely host unique embeds; channel videos are the reliable source.
 */
type VideoDef = Omit<MachineVideo, "embedUrl"> & { youtubeId: string };

const VIDEO_LIBRARY: Record<string, VideoDef> = {
  "why-lava": {
    youtubeId: "yn-qpoAtbVI",
    title: "Why choose a LAVA vacuum sealer?",
    description: "German engineering, double seal, and what sets LAVA apart from cheaper machines.",
  },
  "buying-guide": {
    youtubeId: "4Ut74sEOf1I",
    title: "Which vacuum sealer is right for you?",
    description: "Compare domestic and semi-professional LAVA models — features explained in English.",
  },
  "hunters-fish": {
    youtubeId: "yaf_L7C6N6U",
    title: "Vacuum sealer for hunters & fishermen",
    description: "Game meat and fresh catch — why hunters and anglers choose LAVA.",
  },
  "fish-salmon": {
    youtubeId: "XEdT5cCNiwk",
    title: "Vacuum-packing fish & salmon",
    description: "Whole fillets and portions for freezer or sous vide.",
  },
  "containers-jars": {
    youtubeId: "KfuOy68QOn0",
    title: "Vacuum-packing jars & containers",
    description: "Containers, twist-off jars and accessories with your LAVA machine.",
  },
  "sous-vide-beef": {
    youtubeId: "1H0qA-6pE8E",
    title: "Vacuum sealing for sous vide",
    description: "Prep steaks and roasts with a reliable double seal before cooking.",
  },
};

function fromLibrary(key: string): MachineVideo {
  const v = VIDEO_LIBRARY[key];
  return {
    title: v.title,
    description: v.description,
    embedUrl: youTubeWatchUrl(v.youtubeId),
  };
}

/** Curated defaults — one primary video per machine tier; add more via admin. */
const MACHINE_VIDEO_KEYS: Record<string, string[]> = {
  "v100-premium-x": ["why-lava", "buying-guide"],
  "v100-premium": ["why-lava", "buying-guide"],
  "v200-premium": ["buying-guide", "why-lava"],
  "v300-premium-x": ["buying-guide", "hunters-fish"],
  "v300-white": ["buying-guide", "hunters-fish"],
  "v300-black": ["buying-guide", "hunters-fish"],
  "v333-chrome": ["buying-guide", "containers-jars"],
  "v350-premium": ["buying-guide", "containers-jars"],
  "v400-premium": ["buying-guide", "sous-vide-beef"],
  "v500-premium": ["buying-guide", "sous-vide-beef"],
  "v500-premium-xxl": ["buying-guide", "sous-vide-beef"],
};

export function getDefaultMachineVideos(slug: string, machineName: string): MachineVideo[] {
  const keys = MACHINE_VIDEO_KEYS[slug] ?? ["why-lava", "buying-guide"];
  const videos = keys.map((k) => fromLibrary(k));

  if (videos.length === 1) {
    videos[0] = {
      ...videos[0],
      title: `${machineName} — ${videos[0].title}`,
    };
  }

  return videos;
}

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

export function getDefaultMachineDownloads(slug: string, machineName: string): MachineDownload[] {
  if (V100_SLUGS.has(slug)) {
    return [v100Manual];
  }
  if (V300_SLUGS.has(slug)) {
    return [v300Manual];
  }
  return [factoryManualDownload(machineName, slug)];
}
