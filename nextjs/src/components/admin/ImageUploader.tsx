"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Star, StarOff, Loader2, CheckCircle2, AlertCircle, ImagePlus } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface UploadingFile {
  id:        string;
  name:      string;
  status:    "uploading" | "done" | "error";
  message?:  string;
  originalKB?: number;
  convertedKB?: number;
}

export default function ImageUploader({
  productId,
  initialImages,
}: {
  productId:     string;
  initialImages: ProductImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [images,    setImages]    = useState<ProductImage[]>(initialImages);
  const [uploads,   setUploads]   = useState<UploadingFile[]>([]);
  const [dragging,  setDragging]  = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);

  // ── Upload logic ───────────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);

    for (const file of list) {
      // Basic validation
      if (!file.type.startsWith("image/")) {
        setUploads((p) => [...p, { id: crypto.randomUUID(), name: file.name, status: "error", message: "Not an image file" }]);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setUploads((p) => [...p, { id: crypto.randomUUID(), name: file.name, status: "error", message: "File too large (max 20 MB)" }]);
        continue;
      }

      const uid = crypto.randomUUID();
      setUploads((p) => [...p, { id: uid, name: file.name, status: "uploading" }]);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("productId", productId);
      fd.append("isPrimary", images.length === 0 ? "true" : "false");

      try {
        const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok) {
          setUploads((p) => p.map((u) => u.id === uid ? { ...u, status: "error", message: data.error ?? "Upload failed" } : u));
          continue;
        }

        setImages((p) => [...p, data.image]);
        setUploads((p) => p.map((u) =>
          u.id === uid
            ? { ...u, status: "done", originalKB: data.originalKB, convertedKB: data.convertedKB }
            : u
        ));
        router.refresh();
      } catch (err) {
        setUploads((p) => p.map((u) => u.id === uid ? { ...u, status: "error", message: String(err) } : u));
      }
    }
  }, [productId, images.length, router]);

  // ── Drag & drop ────────────────────────────────────────────────────────────
  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function onDragLeave()                  { setDragging(false); }
  function onDrop(e: React.DragEvent)     {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteImage(id: string) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/upload/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) {
      setImages((p) => p.filter((img) => img.id !== id));
      router.refresh();
    } else {
      alert("Delete failed — please try again.");
    }
  }

  // ── Set primary ────────────────────────────────────────────────────────────
  async function setPrimary(id: string) {
    setPromoting(id);
    const res = await fetch(`/api/admin/upload/${id}`, { method: "PATCH" });
    setPromoting(null);
    if (res.ok) {
      setImages((p) => p.map((img) => ({ ...img, is_primary: img.id === id })));
      router.refresh();
    } else {
      alert("Could not set as primary — please try again.");
    }
  }

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="bg-white border border-gray-200 p-5 space-y-4">
      <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Images</h2>

      {/* ── Drop zone ─────────────────────────────────────────────────────── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          cursor-pointer border-2 border-dashed transition-colors rounded-sm
          flex flex-col items-center justify-center gap-3 py-10 px-6 text-center
          ${dragging
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-primary hover:bg-gray-50"}
        `}
      >
        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center">
          <ImagePlus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-800">
            Drop images here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Any format (JPG, PNG, HEIC, etc.) — automatically converted to WebP &amp; compressed
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {/* ── Upload progress ────────────────────────────────────────────────── */}
      {uploads.length > 0 && (
        <div className="space-y-1.5">
          {uploads.map((u) => (
            <div key={u.id} className={`flex items-center gap-3 px-3 py-2 text-xs
              ${u.status === "error" ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-700"}`}>
              {u.status === "uploading" && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-primary" />}
              {u.status === "done"      && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
              {u.status === "error"     && <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />}
              <span className="flex-1 truncate font-medium">{u.name}</span>
              {u.status === "uploading" && <span className="text-gray-400">Converting…</span>}
              {u.status === "done" && u.originalKB && u.convertedKB && (
                <span className="text-emerald-600 font-semibold whitespace-nowrap">
                  {u.originalKB} KB → {u.convertedKB} KB WebP
                  {u.originalKB > u.convertedKB && (
                    <span className="ml-1 text-gray-400">
                      (−{Math.round((1 - u.convertedKB / u.originalKB) * 100)}%)
                    </span>
                  )}
                </span>
              )}
              {u.status === "error" && <span>{u.message}</span>}
            </div>
          ))}
        </div>
      )}

      {/* ── Image grid ────────────────────────────────────────────────────── */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {sorted.map((img) => (
            <div
              key={img.id}
              className={`relative group aspect-square border overflow-hidden
                ${img.is_primary ? "border-primary" : "border-gray-200"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-contain bg-gray-50" />

              {/* Primary badge */}
              {img.is_primary && (
                <span className="absolute top-0 left-0 right-0 text-[9px] font-bold uppercase bg-primary text-white text-center py-0.5 tracking-wide">
                  ★ Primary
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    type="button"
                    title="Set as primary"
                    disabled={promoting === img.id}
                    onClick={() => setPrimary(img.id)}
                    className="h-8 w-8 bg-white/90 hover:bg-secondary hover:text-white text-gray-800 flex items-center justify-center transition-colors"
                  >
                    {promoting === img.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Star className="h-4 w-4" />}
                  </button>
                )}
                {img.is_primary && (
                  <button type="button" title="Already primary" disabled
                    className="h-8 w-8 bg-secondary text-white flex items-center justify-center opacity-70 cursor-default">
                    <StarOff className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  title="Delete image"
                  disabled={deleting === img.id}
                  onClick={() => deleteImage(img.id)}
                  className="h-8 w-8 bg-white/90 hover:bg-red-600 hover:text-white text-gray-800 flex items-center justify-center transition-colors"
                >
                  {deleting === img.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && uploads.filter(u => u.status !== "error").length === 0 && (
        <p className="text-xs text-gray-400 text-center py-2">No images yet — drop some above.</p>
      )}

      <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-1">
        <Upload className="h-3 w-3 shrink-0" />
        <span>All uploads are automatically converted to WebP. Hover an image to set it as primary or delete it.</span>
      </div>
    </section>
  );
}
