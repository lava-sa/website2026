export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

// ── DELETE /api/admin/upload/[imageId] — remove image ────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageId } = await params;
  const supabase = createServiceClient();

  // Fetch the record first so we can delete from Storage too
  const { data: img, error: fetchErr } = await supabase
    .from("product_images")
    .select("url, product_id, is_primary")
    .eq("id", imageId)
    .single();

  if (fetchErr || !img) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Derive the storage path from the public URL
  // URL format: .../storage/v1/object/public/product-images/{productId}/{filename}
  const urlParts  = img.url.split("/product-images/");
  const storagePath = urlParts[1] ?? null;

  if (storagePath) {
    await supabase.storage.from("product-images").remove([storagePath]);
  }

  // Delete DB record
  await supabase.from("product_images").delete().eq("id", imageId);

  // If we deleted the primary, promote the next image
  if (img.is_primary) {
    const { data: remaining } = await supabase
      .from("product_images")
      .select("id, url")
      .eq("product_id", img.product_id)
      .order("sort_order", { ascending: true })
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase.from("product_images").update({ is_primary: true }).eq("id", remaining[0].id);
      await supabase.from("products").update({ primary_image_url: remaining[0].url }).eq("id", img.product_id);
    } else {
      await supabase.from("products").update({ primary_image_url: null }).eq("id", img.product_id);
    }
  }

  revalidatePath("/products", "layout");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

// ── PATCH /api/admin/upload/[imageId] — set as primary ───────────────────────
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageId } = await params;
  const supabase = createServiceClient();

  // Get this image
  const { data: img, error: fetchErr } = await supabase
    .from("product_images")
    .select("url, product_id")
    .eq("id", imageId)
    .single();

  if (fetchErr || !img) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Clear all primary flags for this product
  await supabase.from("product_images").update({ is_primary: false }).eq("product_id", img.product_id);

  // Set this one as primary
  await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);

  // Update product primary_image_url
  await supabase.from("products").update({ primary_image_url: img.url }).eq("id", img.product_id);

  revalidatePath("/products", "layout");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
