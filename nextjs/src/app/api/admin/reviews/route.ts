export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

/** Approve, unpublish, or update product link / scope. */
export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, approved, product_slug, review_scope } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (approved !== undefined) updates.approved = approved;
  if (product_slug !== undefined) updates.product_slug = product_slug || null;
  if (review_scope !== undefined) updates.review_scope = review_scope;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await createServiceClient().from("reviews").update(updates).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Permanently delete a rejected or unwanted review (and video file if applicable). */
export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: review } = await supabase
    .from("reviews")
    .select("id, review_type, video_url")
    .eq("id", id)
    .maybeSingle();

  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  if (review.review_type === "video" && review.video_url) {
    const marker = "/videos/";
    const idx = review.video_url.indexOf(marker);
    if (idx >= 0) {
      const path = decodeURIComponent(review.video_url.slice(idx + marker.length).split("?")[0] ?? "");
      if (path) await supabase.storage.from("videos").remove([path]);
    }
  }

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, deleted: true });
}
