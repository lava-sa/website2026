"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Printer, ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  productHref: string;
  logoSrc?: string;
};

export default function ManualToolbar({
  title,
  productHref,
  logoSrc = "/images/logo/lava-sa-logo-white.webp",
}: Props) {
  const handlePrint = () => window.print();

  return (
    <div className="manual-toolbar sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm print:hidden">
      <div className="section-container flex flex-wrap items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={productHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Product page
          </Link>
          <div className="hidden sm:flex items-center gap-3 min-w-0 border-l border-border pl-4">
            <Image
              src={logoSrc}
              alt=""
              width={100}
              height={28}
              unoptimized
              className="h-7 w-auto"
              aria-hidden
            />
            <p className="text-sm font-black text-primary truncate">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-wide px-4 py-2.5"
          >
            <Download className="h-4 w-4" aria-hidden />
            Save as PDF
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-surface text-xs font-black uppercase tracking-wide px-4 py-2.5"
          >
            <Printer className="h-4 w-4" aria-hidden />
            Print
          </button>
        </div>
      </div>
      <p className="section-container pb-2 text-[11px] text-copy-muted print:hidden">
        Tip: choose <strong>Save as PDF</strong>, paper <strong>A4 portrait</strong>, background graphics on.
      </p>
    </div>
  );
}
