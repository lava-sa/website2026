import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Public opt-out: sets mailing_list_subscribers.opted_in = false and syncs customers.marketing_opt_in.
 * Always returns a generic success message (no email enumeration).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const now = new Date().toISOString();
    const update = {
      opted_in: false,
      unsubscribed_at: now,
      updated_at: now,
    };

    await supabase.from("mailing_list_subscribers").update(update).eq("email", email);

    await supabase
      .from("customers")
      .update({ marketing_opt_in: false, updated_at: now })
      .eq("email", email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("mailing-list unsubscribe:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
