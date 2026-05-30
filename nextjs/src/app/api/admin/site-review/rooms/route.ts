import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { generateRoomToken, siteReviewRoomUrl } from "@/lib/site-review/room-access";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_review_rooms")
    .select("id, token, title, host_label, guest_label, status, expires_at, ended_at, recording_url, ai_summary, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rooms: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { title?: string; hostLabel?: string; guestLabel?: string; expiresInDays?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const token = generateRoomToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (body.expiresInDays ?? 14));
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_review_rooms")
    .insert({
      token,
      title: body.title?.trim() || "LAVA website launch review",
      host_label: body.hostLabel?.trim() || "Ignatius",
      guest_label: body.guestLabel?.trim() || "Anneke",
      expires_at: expiresAt.toISOString(),
    })
    .select("id, token, title, host_label, guest_label, status, expires_at, created_at")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed" }, { status: 500 });
  }
  return NextResponse.json({
    room: data,
    hostUrl: siteReviewRoomUrl(token, "host"),
    guestUrl: siteReviewRoomUrl(token, "guest"),
  });
}
