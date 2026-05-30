import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getRoomByToken, roomIsJoinable } from "@/lib/site-review/room-access";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ token: string; taskId: string }> }
) {
  const { token, taskId } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room || !roomIsJoinable(room)) {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (typeof body.done === "boolean") update.done = body.done;
  if (body.text !== undefined) update.text = body.text.trim();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_review_tasks")
    .update(update)
    .eq("id", taskId)
    .eq("room_id", room.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ task: data });
}
