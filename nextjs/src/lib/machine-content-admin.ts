import type {
  MachineDownload,
  MachineFaqItem,
  MachineFunctionItem,
  MachineRichContent,
  MachineVideo,
} from "@/lib/machine-content";

export type MachineContentForm = {
  functions: MachineFunctionItem[];
  deliveryContents: string;
  videoTitle: string;
  videoUrl: string;
  videoDescription: string;
  manualTitle: string;
  manualUrl: string;
  manualLanguage: string;
  faq: MachineFaqItem[];
  /** Key-value technical specs shown in the specs table */
  techSpecs: { key: string; value: string }[];
};

const TECH_SPEC_KEYS = [
  "pumps",
  "suction_power",
  "max_vacuum",
  "gauge",
  "seal_width",
  "double_seal",
  "manual_seal",
  "auto_seal",
  "fluid_extract",
  "power",
  "dimensions",
  "weight",
  "warranty",
  "made_in",
] as const;

export function emptyMachineContentForm(): MachineContentForm {
  return {
    functions: [{ title: "", description: "" }],
    deliveryContents: "",
    videoTitle: "",
    videoUrl: "",
    videoDescription: "",
    manualTitle: "Instruction Manual (English)",
    manualUrl: "",
    manualLanguage: "English",
    faq: [{ question: "", answer: "" }],
    techSpecs: TECH_SPEC_KEYS.map((key) => ({ key, value: "" })),
  };
}

export function machineContentFromSpecs(
  specs: Record<string, unknown> | null | undefined
): MachineContentForm {
  const base = emptyMachineContentForm();
  if (!specs) return base;

  const raw = specs.machine_content;
  if (!raw || typeof raw !== "object") {
    return {
      ...base,
      techSpecs: TECH_SPEC_KEYS.map((key) => ({
        key,
        value: String(specs[key] ?? ""),
      })),
    };
  }

  const mc = raw as Record<string, unknown>;
  const videos = Array.isArray(mc.videos) ? (mc.videos as MachineVideo[]) : [];
  const downloads = Array.isArray(mc.downloads) ? (mc.downloads as MachineDownload[]) : [];
  const firstVideo = videos[0];
  const firstManual = downloads[0];

  return {
    functions:
      Array.isArray(mc.functions) && mc.functions.length > 0
        ? (mc.functions as MachineFunctionItem[])
        : base.functions,
    deliveryContents: Array.isArray(mc.deliveryContents)
      ? (mc.deliveryContents as string[]).join("\n")
      : "",
    videoTitle: firstVideo?.title ?? "",
    videoUrl: firstVideo?.embedUrl ?? "",
    videoDescription: firstVideo?.description ?? "",
    manualTitle: firstManual?.title ?? base.manualTitle,
    manualUrl: firstManual?.href ?? "",
    manualLanguage: firstManual?.language ?? "English",
    faq:
      Array.isArray(mc.faq) && mc.faq.length > 0
        ? (mc.faq as MachineFaqItem[])
        : base.faq,
    techSpecs: TECH_SPEC_KEYS.map((key) => ({
      key,
      value: String(specs[key] ?? ""),
    })),
  };
}

export function machineContentToSpecs(
  existingSpecs: Record<string, unknown> | null | undefined,
  form: MachineContentForm
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...(existingSpecs ?? {}) };

  for (const { key, value } of form.techSpecs) {
    if (value.trim()) next[key] = value.trim();
    else delete next[key];
  }

  const functions = form.functions.filter((f) => f.title.trim() || f.description.trim());
  const deliveryContents = form.deliveryContents
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const videos: MachineVideo[] = form.videoUrl.trim()
    ? [
        {
          title: form.videoTitle.trim() || "Product video",
          description: form.videoDescription.trim() || undefined,
          embedUrl: form.videoUrl.trim(),
        },
      ]
    : [];
  const downloads: MachineDownload[] = form.manualUrl.trim()
    ? [
        {
          title: form.manualTitle.trim() || "Instruction Manual",
          href: form.manualUrl.trim(),
          language: (form.manualLanguage as MachineDownload["language"]) || "English",
          fileType: "PDF",
        },
      ]
    : [];
  const faq = form.faq.filter((f) => f.question.trim() && f.answer.trim());

  const machine_content: Partial<MachineRichContent> = {};
  if (functions.length) machine_content.functions = functions;
  if (deliveryContents.length) machine_content.deliveryContents = deliveryContents;
  if (videos.length) machine_content.videos = videos;
  if (downloads.length) machine_content.downloads = downloads;
  if (faq.length) machine_content.faq = faq;
  machine_content.tests = [];

  if (Object.keys(machine_content).length > 0) {
    next.machine_content = machine_content;
  } else {
    delete next.machine_content;
  }

  return next;
}
