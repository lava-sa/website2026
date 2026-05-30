import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getRoomByToken, roomIsJoinable } from "@/lib/site-review/room-access";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room || !roomIsJoinable(room)) {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }
  const body = await req.json();
  const text = body.text?.trim();
  if (!text) return NextResponse.json({ error: "Task required" }, { status: 400 });
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("site_review_tasks")
    .select("id", { count: "exact", head: true })
    .eq("room_id", room.id);
  const { data, error } = await supabase
    .from("site_review_tasks")
    .insert({
      room_id: room.id,
      text,
      sort_order: (count ?? 0) + 1,
      created_by: body.createdBy?.trim() || null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data });
}
