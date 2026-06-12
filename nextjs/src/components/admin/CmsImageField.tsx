"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, ImageIcon, FolderOpen, X } from "lucide-react";
import type { CmsImage } from "@/lib/content/site-pages-types";

const inputCls =
  "w-full border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary";
const labelCls = "block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide";

type LibraryImage = {
  name: string;
  url: string;
};

type Props = {
  label: string;
  value: CmsImage;
  onChange: (image: CmsImage) => void;
  showCaptions?: boolean;
  /** Supabase folder for uploads — e.g. "about", "home" */
  uploadFolder?: string;
};

export default function CmsImageField({
  label,
  value,
  onChange,
  showCaptions,
  uploadFolder = "pages",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [library, setLibrary] = useState<LibraryImage[]>([]);

  const src = value.src?.trim();
  const isRemote = src?.startsWith("http");

  const loadLibrary = useCallback(async () => {
    setLibraryLoading(true);
    setUploadError("");
    try {
      const res = await fetch(`/api/admin/cms-upload?folder=${encodeURIComponent(uploadFolder)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load images");
      setLibrary(data.images ?? []);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not load library");
      setLibrary([]);
    } finally {
      setLibraryLoading(false);
    }
  }, [uploadFolder]);

  useEffect(() => {
    if (libraryOpen) loadLibrary();
  }, [libraryOpen, loadLibrary]);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", uploadFolder);

      const res = await fetch("/api/admin/cms-upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      onChange({
        ...value,
        src: data.url,
        alt: value.alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  }

  function selectFromLibrary(url: string, name: string) {
    onChange({
      ...value,
      src: url,
      alt: value.alt || name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    });
    setLibraryOpen(false);
  }

  return (
    <div className="border border-border bg-surface p-4 space-y-3">
      <p className="text-xs font-bold text-copy-muted uppercase">{label}</p>

      {src ? (
        <div className="relative aspect-[4/3] max-w-sm border border-border overflow-hidden bg-white">
          <Image
            src={src}
            alt={value.alt || "Preview"}
            fill
            className="object-cover"
            unoptimized={!!isRemote}
          />
          <button
            type="button"
            onClick={() => onChange({ ...value, src: "" })}
            className="absolute top-2 right-2 bg-white/90 border border-border p-1 hover:bg-red-50"
            title="Remove image"
          >
            <X className="h-4 w-4 text-copy-muted" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center aspect-[4/3] max-w-sm border border-dashed border-border bg-white text-copy-muted">
          <div className="text-center p-4">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No image selected</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 hover:bg-primary/90 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" /> Upload image
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setLibraryOpen((o) => !o)}
          className="inline-flex items-center gap-2 border border-border bg-white text-xs font-bold px-4 py-2.5 hover:border-primary"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          {libraryOpen ? "Hide library" : "Browse library"}
        </button>
      </div>

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">{uploadError}</p>
      )}

      {libraryOpen && (
        <div className="border border-border bg-white p-3">
          <p className="text-xs font-bold text-copy-muted mb-3 uppercase">
            Images uploaded for this page
          </p>
          {libraryLoading ? (
            <p className="text-sm text-copy-muted flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : library.length === 0 ? (
            <p className="text-sm text-copy-muted">No uploads yet — use Upload image above.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {library.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => selectFromLibrary(img.url, img.name)}
                  className={`relative aspect-square border overflow-hidden hover:ring-2 hover:ring-secondary ${
                    src === img.url ? "ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <Image src={img.url} alt={img.name} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label className={labelCls}>Or paste image URL / path</label>
        <input
          className={inputCls}
          value={value.src}
          onChange={(e) => onChange({ ...value, src: e.target.value })}
          placeholder="Upload above, or paste /images/... or https://..."
        />
        <p className="text-[10px] text-copy-muted mt-1">
          Uploaded images are stored on Supabase CDN. Existing site images can still use{" "}
          <code className="text-primary">/images/...</code> paths.
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
