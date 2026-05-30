import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getRoomByToken, roomIsJoinable } from "@/lib/site-review/room-access";
import type { SiteReviewRole } from "@/lib/site-review/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room || !roomIsJoinable(room)) {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }
  const body = await req.json();
  const text = body.body?.trim();
  if (!text) return NextResponse.json({ error: "Message required" }, { status: 400 });
  const role: SiteReviewRole = body.role === "host" ? "host" : "guest";
  const senderName =
    body.senderName?.trim() || (role === "host" ? room.host_label : room.guest_label);
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_review_messages")
    .insert({ room_id: room.id, sender_name: senderName, sender_role: role, body: text })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}
