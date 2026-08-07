export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sweepAbandonedCarts } from "@/lib/abandoned-cart";

/**
 * Abandoned-cart sweep. Idempotent and safe to call at any frequency — every
 * stop-condition is re-checked per cart and the reminder flag is claimed before
 * the mail goes out, so calling this hourly, daily, or twice at once cannot
 * double-mail anyone.
 *
 * Trigger it the same way as /api/cron/mailing-broadcasts:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://www.lava-sa.com/api/cron/abandoned-carts
 */
function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return (req.headers.get("authorization") ?? "") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sweepAbandonedCarts();
  console.info("Abandoned cart sweep:", JSON.stringify(result));
  return NextResponse.json({ ok: true, ...result });
}
