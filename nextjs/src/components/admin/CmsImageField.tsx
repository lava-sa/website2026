"use client";

import Image from "next/image";
import type { CmsImage } from "@/lib/content/site-pages-types";

const inputCls =
  "w-full border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary";
const labelCls = "block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide";

type Props = {
  label: string;
  value: CmsImage;
  onChange: (image: CmsImage) => void;
  showCaptions?: boolean;
};

export default function CmsImageField({ label, value, onChange, showCaptions }: Props) {
  const src = value.src?.trim();

  return (
    <div className="border border-border bg-surface p-4 space-y-3">
      <p className="text-xs font-bold text-copy-muted uppercase">{label}</p>

      {src && (
        <div className="relative aspect-[4/3] max-w-xs border border-border overflow-hidden bg-white">
          <Image
            src={src}
            alt={value.alt || "Preview"}
            fill
            className="object-cover"
            unoptimized={src.startsWith("http")}
          />
        </div>
      )}

      <div>
        <label className={labelCls}>Image path</label>
        <input
          className={inputCls}
          value={value.src}
          onChange={(e) => onChange({ ...value, src: e.target.value })}
          placeholder="/images/about/your-image.webp"
        />
        <p className="text-[10px] text-copy-muted mt-1">
          Path under <code className="text-primary">public/</code> — e.g.{" "}
          <code className="text-primary">/images/about/photo.webp</code>
        </p>
      </div>

      <div>
        <label className={labelCls}>Alt text</label>
        <input
          className={inputCls}
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          placeholder="Describe the image for SEO and accessibility"
        />
      </div>

      {showCaptions && (
        <>
          <div>
            <label className={labelCls}>Caption location (optional)</label>
            <input
              className={inputCls}
              value={value.captionLocation ?? ""}
              onChange={(e) => onChange({ ...value, captionLocation: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Caption title (optional)</label>
            <input
              className={inputCls}
              value={value.captionTitle ?? ""}
              onChange={(e) => onChange({ ...value, captionTitle: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Caption subtitle (optional)</label>
            <input
              className={inputCls}
              value={value.captionSubtitle ?? ""}
              onChange={(e) => onChange({ ...value, captionSubtitle: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
