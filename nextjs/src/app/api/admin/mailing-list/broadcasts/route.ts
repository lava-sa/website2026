export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { dispatchBroadcastById, type SegmentType } from "@/lib/mini-crm";
import { createServiceClient } from "@/lib/supabase";

type CreateBody = {
  name?: string;
  segment_type?: SegmentType;
  region?: string | null;
  template_key?: string;
  subject?: string;
  html_body?: string;
  send_mode?: "draft" | "schedule" | "now";
  scheduled_for?: string | null;
};

function parseDate(input: string | null | undefined): string | null {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const segmentType = body.segment_type;
  const templateKey = String(body.template_key ?? "").trim() || "product-news";
  const subject = String(body.subject ?? "").trim();
  const htmlBody = String(body.html_body ?? "").trim();
  const region = String(body.region ?? "").trim() || null;
  const sendMode = body.send_mode ?? "draft";
  const scheduledFor = parseDate(body.scheduled_for);

  if (!name || !segmentType || !subject || !htmlBody) {
    return NextResponse.json({ error: "name, segment_type, subject and html_body are required" }, { status: 400 });
  }
  if (!["opted_in", "purchasers", "region"].includes(segmentType)) {
    return NextResponse.json({ error: "Invalid segment_type" }, { status: 400 });
  }
  if (segmentType === "region" && !region) {
    return NextResponse.json({ error: "Region is required for region segment" }, { status: 400 });
  }
  if (sendMode === "schedule" && !scheduledFor) {
    return NextResponse.json({ error: "scheduled_for is required for schedule mode" }, { status: 400 });
  }

  const status = sendMode === "schedule" ? "scheduled" : sendMode === "now" ? "sending" : "draft";
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: created, error: createError } = await supabase
    .from("marketing_broadcasts")
    .insert({
      name,
      segment_type: segmentType,
      region,
      template_key: templateKey,
      subject,
      html_body: htmlBody,
      status,
      scheduled_for: sendMode === "schedule" ? scheduledFor : null,
      created_by: "admin",
      created_at: now,
      updated_at: now,
    })
    .select("id, status")
    .maybeSingle();

  if (createError || !created?.id) {
    return NextResponse.json({ error: createError?.message ?? "Could not create broadcast" }, { status: 500 });
  }

  if (sendMode !== "now") {
    return NextResponse.json({ ok: true, id: created.id, status: created.status });
  }

  const result = await dispatchBroadcastById(created.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to send broadcast" }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    id: created.id,
    status: "sent",
    recipient_count: result.recipientCount,
    sent_count: result.sentCount,
    failed_count: result.failedCount,
  });
}
