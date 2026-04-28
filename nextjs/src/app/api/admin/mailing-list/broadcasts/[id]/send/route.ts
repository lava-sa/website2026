export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { dispatchBroadcastById } from "@/lib/mini-crm";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing broadcast id" }, { status: 400 });
  }

  const result = await dispatchBroadcastById(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to send broadcast" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    recipient_count: result.recipientCount,
    sent_count: result.sentCount,
    failed_count: result.failedCount,
  });
}
