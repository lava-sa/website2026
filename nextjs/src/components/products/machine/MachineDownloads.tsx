"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, FileText, Lock } from "lucide-react";
import type { MachineDownload } from "@/lib/machine-content";
import { useMemberSession } from "@/hooks/useMemberSession";
import MemberGateModal from "@/components/account/MemberGateModal";

interface MachineDownloadsProps {
  downloads: MachineDownload[];
  heading?: string;
}

export default function MachineDownloads({
  downloads,
  heading = "Downloads",
}: MachineDownloadsProps) {
  const router = useRouter();
  const { isMember, loading } = useMemberSession();
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState("/account/dashboard");

  if (downloads.length === 0) return null;

  function openDownload(href: string, membersOnly?: boolean) {
    const needsAuth = membersOnly !== false;

    if (!needsAuth || isMember) {
      if (href.startsWith("/")) {
        router.push(href);
      } else {
        window.open(href, "_blank", "noopener,noreferrer");
      }
      return;
    }

    setPendingHref(href);
    setGateOpen(true);
  }

  return (
    <>
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
                Operating manuals are available to Lava members only — free to join. V.300 includes
                our new Lava-SA English manual (portrait, save as PDF).
              </p>
              {!loading && !isMember ? (
                <p className="mt-3 text-xs font-bold text-secondary flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  Sign in or register to download
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-2 space-y-3">
              {downloads.map((download) => (
                <button
                  key={download.title}
                  type="button"
                  onClick={() => openDownload(download.href, download.membersOnly)}
                  className="w-full text-left flex items-center gap-4 bg-white border border-border hover:border-primary transition-colors p-5 group"
                >
                  <div className="h-11 w-11 bg-secondary/15 flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors">
                    <FileText className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-primary leading-tight mb-1 truncate">
                      {download.title}
                    </h3>
                    {download.description ? (
                      <p className="text-xs text-copy-muted leading-snug mb-1.5 line-clamp-2">
                        {download.description}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-copy-muted">
                      <span>{download.fileType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{download.language}</span>
                      {download.membersOnly !== false ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-secondary">Members</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {download.href.startsWith("/") ? (
                    <Download className="h-4 w-4 text-copy-muted group-hover:text-primary transition-colors shrink-0" />
                  ) : (
                    <ExternalLink className="h-4 w-4 text-copy-muted group-hover:text-primary transition-colors shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MemberGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        returnTo={pendingHref}
      />
    </>
  );
}
