import { Play } from "lucide-react";
import type { MachineVideo } from "@/lib/machine-content";
import MachineVideoEmbed from "@/components/products/machine/MachineVideoEmbed";

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
          <p className="overline mb-3 flex items-center gap-2">
            <Play className="h-4 w-4 text-secondary" aria-hidden />
            Watch it work
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight">
            {heading}
          </h2>
          <p className="mt-3 text-sm text-copy-muted leading-relaxed">
            Official LAVA demonstration videos — embedded on your page, no redirect required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {videos.map((video) => (
            <MachineVideoEmbed key={`${video.title}-${video.embedUrl}`} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
