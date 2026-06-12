import { Play, ExternalLink } from "lucide-react";
import type { MachineVideo } from "@/lib/machine-content";

interface MachineVideosProps {
  videos: MachineVideo[];
  heading?: string;
}

export default function MachineVideos({
  videos,
  heading = "Videos",
}: MachineVideosProps) {
  if (videos.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <p className="overline mb-3">Watch it work</p>
          <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {videos.map((video) => (
            <a
              key={video.title}
              href={video.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-border hover:border-primary transition-colors"
            >
              <div className="relative aspect-video bg-primary/10 overflow-hidden flex items-center justify-center">
                <div className="h-16 w-16 bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="p-5 bg-white">
                <h3 className="font-black text-primary leading-tight mb-1">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-sm text-copy-muted leading-snug mb-2">
                    {video.description}
                  </p>
                )}
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary">
                  Watch on Lava Germany
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
