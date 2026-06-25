export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { awardPointsForPaidOrder } from "@/lib/points-award";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

const ALLOWED_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await request.json();
  if (!id || !status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "paid" && existing?.status !== "paid") {
    await awardPointsForPaidOrder(supabase, id);
  }

  return NextResponse.json({ ok: true });
}
