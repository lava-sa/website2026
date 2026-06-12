import { Download, ExternalLink, FileText } from "lucide-react";
import type { MachineDownload } from "@/lib/machine-content";

interface MachineDownloadsProps {
  downloads: MachineDownload[];
  heading?: string;
}

export default function MachineDownloads({
  downloads,
  heading = "Downloads",
}: MachineDownloadsProps) {
  if (downloads.length === 0) return null;

  return (
    <section className="py-20 bg-surface border-b border-border">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
              <Download className="h-7 w-7 text-primary" />
            </div>
            <p className="overline mb-3">Documentation</p>
            <h2 className="text-3xl font-black text-primary leading-tight mb-4">
              {heading}
            </h2>
            <p className="text-sm text-copy-muted leading-relaxed">
              Manuals and datasheets. English-language documentation currently
              hosted by Lava Germany (lava.com).
            </p>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {downloads.map((download) => (
              <a
                key={download.title}
                href={download.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white border border-border hover:border-primary transition-colors p-5 group"
              >
                <div className="h-11 w-11 bg-secondary/15 flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-primary leading-tight mb-1 truncate">
                    {download.title}
                  </h3>
                  {download.description && (
                    <p className="text-xs text-copy-muted leading-snug mb-1.5 line-clamp-1">
                      {download.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-copy-muted">
                    <span>{download.fileType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{download.language}</span>
                    {download.size && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{download.size}</span>
                      </>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-copy-muted group-hover:text-primary transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
