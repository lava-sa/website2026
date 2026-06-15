"use client";

import Image from "next/image";
import Link from "next/link";
import { V300_MANUAL_SLIDES, v300ManualImageSrc } from "@/lib/v300-lp-manual-slides";
import { V300_MANUAL_META } from "@/lib/v300-manual-images";

function ManualSlide({ file, captionEn }: { file: string; captionEn: string }) {
  return (
    <figure className="border-2 border-primary/20 bg-white overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] bg-neutral-100">
        <Image
          src={v300ManualImageSrc(file)}
          alt={captionEn}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <figcaption className="p-3 text-xs text-copy leading-snug border-t border-border">{captionEn}</figcaption>
    </figure>
  );
}

export default function V300ManualGallery() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {V300_MANUAL_SLIDES.map(({ file, captionEn }) => (
          <ManualSlide key={file} file={file} captionEn={captionEn} />
        ))}
      </div>
      <Link
        href={V300_MANUAL_META.path}
        className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-wide text-sm px-6 py-3.5"
      >
        Open full English manual (portrait) →
      </Link>
    </div>
  );
}
