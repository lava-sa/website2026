export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

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

  const { error } = await createServiceClient()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
