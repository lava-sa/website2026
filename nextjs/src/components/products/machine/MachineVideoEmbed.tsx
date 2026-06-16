"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { MachineVideo } from "@/lib/machine-content";
import {
  parseYouTubeId,
  youTubeEmbedUrl,
  youTubeThumbnailUrl,
  youTubeWatchUrl,
} from "@/lib/youtube";

type Props = {
  video: MachineVideo;
};

export default function MachineVideoEmbed({ video }: Props) {
  const youtubeId = parseYouTubeId(video.embedUrl);
  const [playing, setPlaying] = useState(false);

  if (!youtubeId) {
    return (
      <a
        href={video.embedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block border border-border hover:border-primary transition-colors"
      >
        <div className="relative aspect-video bg-primary/10 flex items-center justify-center">
          <div className="h-16 w-16 bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-7 w-7 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="p-5 bg-white">
          <h3 className="font-black text-primary leading-tight mb-1">{video.title}</h3>
          {video.description ? (
            <p className="text-sm text-copy-muted leading-snug">{video.description}</p>
          ) : null}
        </div>
      </a>
    );
  }

  return (
    <article className="border border-border bg-white overflow-hidden">
      <div className="relative aspect-video bg-zinc-900">
        {playing ? (
          <iframe
            src={youTubeEmbedUrl(youtubeId, true)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full cursor-pointer"
            aria-label={`Play video: ${video.title}`}
          >
            <Image
              src={youTubeThumbnailUrl(youtubeId)}
              alt=""
              fill
              unoptimized
              className="object-cover opacity-95 group-hover:opacity-100 transition-opacity"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-16 w-16 bg-secondary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-white fill-white ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-black text-primary leading-tight mb-1">{video.title}</h3>
        {video.description ? (
          <p className="text-sm text-copy-muted leading-snug mb-2">{video.description}</p>
        ) : null}
        <a
          href={youTubeWatchUrl(youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors"
        >
          Open on YouTube
        </a>
      </div>
    </article>
  );
}
