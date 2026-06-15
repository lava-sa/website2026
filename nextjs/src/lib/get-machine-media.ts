import type { MachineDownload, MachineRichContent, MachineVideo } from "@/lib/machine-content";
import {
  getDefaultMachineDownloads,
  getDefaultMachineVideos,
} from "@/lib/machine-media-defaults";

export interface MachineMedia {
  videos: MachineVideo[];
  downloads: MachineDownload[];
}

function hasItems<T>(arr: T[] | undefined | null): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/** Videos + manual downloads for vacuum machine PDPs — static/CMS content with la-va defaults as fallback. */
export function getMachineMedia(
  slug: string,
  machineName: string,
  content: MachineRichContent | null
): MachineMedia | null {
  const videos = hasItems(content?.videos)
    ? content.videos
    : getDefaultMachineVideos(slug, machineName);

  const downloads = hasItems(content?.downloads)
    ? content.downloads
    : getDefaultMachineDownloads(slug, machineName);

  if (videos.length === 0 && downloads.length === 0) {
    return null;
  }

  return { videos, downloads };
}
