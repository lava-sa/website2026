"use client";

import Image from "next/image";
import { useState } from "react";

export default function ManualImage({
  src,
  alt,
  className = "object-contain p-2",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface text-center p-6 text-xs text-copy-muted">
        Image pending — {alt}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes="210mm"
      onError={() => setFailed(true)}
    />
  );
}
