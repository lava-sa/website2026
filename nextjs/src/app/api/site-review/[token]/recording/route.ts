import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getRoomByToken, roomIsJoinable } from "@/lib/site-review/room-access";

export const dynamic = "force-dynamic";
const BUCKET = "site-review-recordings";

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room || !roomIsJoinable(room)) {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }
  const ext = req.nextUrl.searchParams.get("ext") === "mp4" ? "mp4" : "webm";
  const path = `${room.id}/${Date.now()}-session.${ext}`;
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Upload URL failed" }, { status: 500 });
  }
  return NextResponse.json({ signedUrl: data.signedUrl, path });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const path = body.path?.trim();
  if (!path?.startsWith(`${room.id}/`)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const supabase = createServiceClient();
  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 604800);
  await supabase
    .from("site_review_rooms")
    .update({ recording_path: path, recording_url: signed?.signedUrl ?? null })
    .eq("id", room.id);
  return NextResponse.json({ ok: true, recordingUrl: signed?.signedUrl });
}
