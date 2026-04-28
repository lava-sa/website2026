export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { dispatchDueScheduledBroadcasts } from "@/lib/mini-crm";

function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await dispatchDueScheduledBroadcasts();
  return NextResponse.json({ ok: true, ...result });
}
