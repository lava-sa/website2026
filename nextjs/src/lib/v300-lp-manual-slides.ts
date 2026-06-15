import { V300_MANUAL_IMAGE_DIR } from "@/lib/v300-manual-images";

/** Manual walkthrough slides for landing pages and galleries */
export const V300_MANUAL_SLIDES: { file: string; captionEn: string }[] = [
  {
    file: "lava-sa-V300-premium-x-manual-02.jpg",
    captionEn: "Device layout — seals, liquid separator, bag stop, container port, LCS magnet.",
  },
  {
    file: "lava-sa-V300-premium-x-manual-03.jpg",
    captionEn: "Controls — gauge, auto/manual, seal time, bag vs container, manual seal.",
  },
  {
    file: "lava-sa-V300-premium-x-manual-06.webp",
    captionEn: "Automatic mode — one-touch vacuum and seal when full vacuum is reached.",
  },
  {
    file: "lava-sa-V300-premium-x-manual-04.jpg",
    captionEn: "G-Vac overlap technique for smooth bags.",
  },
  {
    file: "lava-sa-V300-premium-x-manual-08.webp",
    captionEn: "Container vacuuming with the included suction attachment.",
  },
];

export function v300ManualImageSrc(file: string) {
  return `${V300_MANUAL_IMAGE_DIR}/${file}`;
}
