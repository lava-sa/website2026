export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file      = formData.get("file") as File | null;
  const productId = formData.get("productId") as string | null;
  const setAsPrimary = formData.get("isPrimary") === "true";

  if (!file || !productId) {
    return NextResponse.json({ error: "Missing file or productId" }, { status: 400 });
  }

  // ── Convert & compress with sharp ────────────────────────────────────────
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let webpBuffer: Buffer;
  try {
    webpBuffer = await sharp(inputBuffer)
      .resize(1200, null, { withoutEnlargement: true }) // max 1200 px wide, keep ratio
      .webp({ quality: 85 })
      .toBuffer();
  } catch (err) {
    return NextResponse.json({ error: `Image conversion failed: ${err}` }, { status: 422 });
  }

  // ── Upload to Supabase Storage ────────────────────────────────────────────
  const supabase  = createServiceClient();
  const filename  = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const storagePath = `${productId}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(storagePath, webpBuffer, { contentType: "image/webp", upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(storagePath);

  // ── Determine sort_order & whether this is the first image ───────────────
  const { data: existing } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const isFirstImage   = !existing || existing.length === 0;
  const nextSortOrder  = isFirstImage ? 0 : (existing![0].sort_order ?? 0) + 1;
  const markAsPrimary  = setAsPrimary || isFirstImage;

  // ── If primary, clear existing primary flag ───────────────────────────────
  if (markAsPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    await supabase
      .from("products")
      .update({ primary_image_url: publicUrl })
      .eq("id", productId);
  }

  // ── Insert record in product_images ──────────────────────────────────────
  const { data: image, error: dbError } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      url:        publicUrl,
      alt:        null,
      is_primary: markAsPrimary,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: `DB insert failed: ${dbError.message}` }, { status: 500 });
  }

  // ── Return file size info for the UI ─────────────────────────────────────
  const originalKB  = Math.round(inputBuffer.byteLength / 1024);
  const convertedKB = Math.round(webpBuffer.byteLength  / 1024);

  return NextResponse.json({ image, originalKB, convertedKB });
}
