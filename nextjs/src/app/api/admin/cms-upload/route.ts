export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

const BUCKET = "product-images";
const CMS_ROOT = "cms";

function sanitizeFolder(raw: string | null): string {
  const folder = (raw ?? "pages")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
  return folder || "pages";
}

/** List uploaded CMS images for a page folder (e.g. about, home). */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const folder = sanitizeFolder(req.nextUrl.searchParams.get("folder"));
  const supabase = createServiceClient();
  const prefix = `${CMS_ROOT}/${folder}`;

  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const images = (data ?? [])
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => {
      const storagePath = `${prefix}/${f.name}`;
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      return {
        name: f.name,
        url: publicUrl,
        storagePath,
        updatedAt: f.updated_at ?? f.created_at ?? null,
      };
    });

  return NextResponse.json({ folder, images });
}

/** Upload + optimise a CMS image (WebP, max 2000px wide). */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const folder = sanitizeFolder(formData.get("folder") as string | null);

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 20 MB" }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let webpBuffer: Buffer;
  try {
    webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize(2000, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (err) {
    return NextResponse.json(
      { error: `Image conversion failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 422 }
    );
  }

  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  const filename = `${baseName || "image"}-${Date.now()}.webp`;
  const storagePath = `${CMS_ROOT}/${folder}/${filename}`;

  const supabase = createServiceClient();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, webpBuffer, { contentType: "image/webp", upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  return NextResponse.json({
    url: publicUrl,
    storagePath,
    originalKB: Math.round(inputBuffer.byteLength / 1024),
    convertedKB: Math.round(webpBuffer.byteLength / 1024),
  });
}
