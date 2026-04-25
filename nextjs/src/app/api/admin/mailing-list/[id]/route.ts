export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing subscriber id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const optedIn = (body as { opted_in?: unknown })?.opted_in;
  if (typeof optedIn !== "boolean") {
    return NextResponse.json({ error: "opted_in (boolean) is required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: row, error: fetchErr } = await supabase
    .from("mailing_list_subscribers")
    .select("email")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!row?.email) {
    return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const update = optedIn
    ? {
        opted_in: true,
        opted_in_at: now,
        unsubscribed_at: null,
        updated_at: now,
      }
    : {
        opted_in: false,
        unsubscribed_at: now,
        updated_at: now,
      };

  const { error: updErr } = await supabase.from("mailing_list_subscribers").update(update).eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  await supabase
    .from("customers")
    .update({ marketing_opt_in: optedIn, updated_at: now })
    .eq("email", row.email);

  return NextResponse.json({ ok: true, opted_in: optedIn });
}
