"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { V300_MANUAL_EXTENSIONS, V300_MANUAL_SLIDES } from "@/lib/v300-lp-manual-slides";

function useManualSrc(base: string) {
  const candidates = useMemo(
    () => V300_MANUAL_EXTENSIONS.map((ext) => `/images/manual/v300-premium-x/${base}${ext}`),
    [base],
  );
  const [i, setI] = useState(0);
  const src = candidates[Math.min(i, candidates.length - 1)];

  return {
    src,
    onError: () => {
      if (i < candidates.length - 1) setI((x) => x + 1);
    },
  };
}

function ManualSlide({ base, captionEn }: { base: string; captionEn: string }) {
  const { src, onError } = useManualSrc(base);
  return (
    <figure className="border-2 border-primary/20 bg-white overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] bg-neutral-100">
        <Image
          src={src}
          alt={captionEn}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={onError}
        />
      </div>
      <figcaption className="p-3 text-xs text-copy leading-snug border-t border-border">{captionEn}</figcaption>
    </figure>
  );
}

export default function V300ManualGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {V300_MANUAL_SLIDES.map(({ base, captionEn }) => (
        <ManualSlide key={base} base={base} captionEn={captionEn} />
      ))}
    </div>
  );
}
