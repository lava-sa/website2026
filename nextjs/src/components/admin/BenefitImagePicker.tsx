"use client";

import { useRef, useState, useCallback } from "react";
import { ImagePlus, Loader2, Check } from "lucide-react";
import type { BenefitBlockId, GalleryImage } from "@/lib/machine-benefits";
import {
  BENEFIT_DEFAULT_GALLERY_INDEX,
  defaultBenefitImageUrl,
  sortGalleryImages,
} from "@/lib/machine-benefits";

type Props = {
  productId: string;
  blockId: BenefitBlockId;
  galleryImages: GalleryImage[];
  primaryImageUrl?: string | null;
  value?: string;
  onChange: (imageUrl: string | undefined) => void;
  onGalleryUpdate?: (images: GalleryImage[]) => void;
  lockedToPrimary?: boolean;
};

export default function BenefitImagePicker({
  productId,
  blockId,
  galleryImages,
  primaryImageUrl,
  value,
  onChange,
  onGalleryUpdate,
  lockedToPrimary = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState(() => sortGalleryImages(galleryImages));
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const galleryUrls = gallery.map((img) => img.url);
  const resolvedUrl =
    value?.trim() ||
    defaultBenefitImageUrl(blockId, galleryUrls, primaryImageUrl);
  const defaultIdx = BENEFIT_DEFAULT_GALLERY_INDEX[blockId];
  const usingDefault = !value?.trim();

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }
      setUploading(true);
      setError("");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("productId", productId);
      fd.append("isPrimary", gallery.length === 0 ? "true" : "false");

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          return;
        }
        const next = sortGalleryImages([...gallery, data.image as GalleryImage]);
        setGallery(next);
        onGalleryUpdate?.(next);
        onChange(data.image.url);
        setOpen(false);
      } catch (err) {
        setError(String(err));
      } finally {
        setUploading(false);
      }
    },
    [gallery, onChange, onGalleryUpdate, productId]
  );

  if (lockedToPrimary) {
    return (
      <div className="flex items-center gap-3 p-3 border border-gray-100 bg-gray-50">
        {resolvedUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedUrl}
            alt="Primary product"
            className="h-16 w-16 object-contain border border-gray-200 bg-white"
          />
        )}
        <p className="text-sm text-gray-600">
          Always uses the <strong>primary product image</strong> from the gallery above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 shrink-0 border border-gray-200 bg-white overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedUrl}
            alt="Selected benefit image"
            className="h-full w-full object-contain p-1"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-bold text-primary hover:text-secondary transition-colors text-left"
          >
            {open ? "Hide gallery" : "Browse gallery"}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition-colors text-left"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            Upload new image
          </button>
          {!usingDefault && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-xs font-bold text-gray-400 hover:text-primary transition-colors text-left"
            >
              Reset to gallery default
              {defaultIdx === "primary"
                ? " (primary)"
                : ` (image ${Number(defaultIdx) + 1})`}
            </button>
          )}
          {usingDefault && (
            <p className="text-[10px] text-gray-400">
              Using gallery default
              {defaultIdx === "primary"
                ? " — primary image"
                : ` — image ${Number(defaultIdx) + 1}`}
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {open && (
        <div className="border border-gray-200 p-3 bg-gray-50">
          {gallery.length === 0 ? (
            <p className="text-xs text-gray-500">
              No images in the product gallery yet — upload one above or in the Images panel.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {gallery.map((img, idx) => {
                const selected = value === img.url;
                return (
                  <button
                    key={img.id ?? img.url}
                    type="button"
                    onClick={() => {
                      onChange(img.url);
                      setOpen(false);
                    }}
                    className={`relative aspect-square border-2 overflow-hidden bg-white transition-colors ${
                      selected ? "border-primary" : "border-gray-200 hover:border-primary/50"
                    }`}
                    title={img.is_primary ? "Primary" : `Gallery image ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt ?? ""}
                      className="h-full w-full object-contain p-0.5"
                    />
                    {selected && (
                      <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-primary flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    {img.is_primary && (
                      <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[8px] font-bold uppercase text-center py-0.5">
                        Primary
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
