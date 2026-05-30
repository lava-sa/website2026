import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getRoomByToken, roomIsJoinable } from "@/lib/site-review/room-access";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ token: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  const { token } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const supabase = createServiceClient();
  const [messagesRes, tasksRes] = await Promise.all([
    supabase.from("site_review_messages").select("*").eq("room_id", room.id).order("created_at"),
    supabase.from("site_review_tasks").select("*").eq("room_id", room.id).order("sort_order"),
  ]);
  return NextResponse.json({
    room,
    joinable: roomIsJoinable(room),
    messages: messagesRes.data ?? [],
    tasks: tasksRes.data ?? [],
  });
}
