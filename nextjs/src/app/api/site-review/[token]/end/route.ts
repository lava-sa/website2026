import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getEmailConfig, getResendClient } from "@/lib/email-config";
import { getRoomByToken } from "@/lib/site-review/room-access";
import { summarizeSiteReviewSession } from "@/lib/site-review/summarize";
import type { SiteReviewMessage, SiteReviewTask } from "@/lib/site-review/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const room = await getRoomByToken(token);
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (room.status === "ended") {
    return NextResponse.json({ room, alreadyEnded: true });
  }
  let notes = "";
  try {
    const body = await req.json();
    notes = typeof body?.transcript === "string" ? body.transcript : "";
  } catch {
    /* optional */
  }
  const supabase = createServiceClient();
  const [messagesRes, tasksRes] = await Promise.all([
    supabase.from("site_review_messages").select("*").eq("room_id", room.id).order("created_at"),
    supabase.from("site_review_tasks").select("*").eq("room_id", room.id).order("sort_order"),
  ]);
  const messages = (messagesRes.data ?? []) as SiteReviewMessage[];
  const tasks = (tasksRes.data ?? []) as SiteReviewTask[];
  const { summary, actionItems } = await summarizeSiteReviewSession({
    title: room.title,
    hostLabel: room.host_label,
    guestLabel: room.guest_label,
    messages,
    tasks,
    transcript: notes || room.transcript,
  });
  const endedAt = new Date().toISOString();
  const { data: updated, error } = await supabase
    .from("site_review_rooms")
    .update({
      status: "ended",
      ended_at: endedAt,
      ai_summary: summary,
      action_items: actionItems,
      updated_at: endedAt,
    })
    .eq("id", room.id)
    .select("id, token, title, status, ended_at, ai_summary, action_items")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const resend = getResendClient();
  if (resend) {
    const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();
    const itemsHtml = actionItems
      .map((i) => `<li>${i.text}${i.page_path ? ` (${i.page_path})` : ""}</li>`)
      .join("");
    await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      ...(replyToEmail ? { replyTo: replyToEmail } : {}),
      subject: `Site review ended: ${room.title}`,
      html: `<h2>${room.title}</h2><div>${summary.replace(/\n/g, "<br>")}</div><ul>${itemsHtml}</ul>`,
    });
  }
  return NextResponse.json({ room: updated, summary, actionItems });
}
