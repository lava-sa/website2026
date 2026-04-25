import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.first_name ?? "").trim() || null;
    const source = String(body?.source ?? "site").trim() || "site";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error: upsertErr } = await supabase
      .from("mailing_list_subscribers")
      .upsert(
        {
          email,
          first_name: firstName,
          source,
          opted_in: true,
          opted_in_at: new Date().toISOString(),
          unsubscribed_at: null,
        },
        { onConflict: "email" }
      );

    if (upsertErr) {
      console.error("Mailing list upsert failed:", upsertErr.message);
      return NextResponse.json({ error: "Failed to subscribe email" }, { status: 500 });
    }

    // Keep customer record in sync for CRM/newsletter exports.
    await supabase
      .from("customers")
      .update({ marketing_opt_in: true, updated_at: new Date().toISOString() })
      .eq("email", email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailing list subscribe failed:", err);
    return NextResponse.json({ error: "Failed to subscribe email" }, { status: 500 });
  }
}

