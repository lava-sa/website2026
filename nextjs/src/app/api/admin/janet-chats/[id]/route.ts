export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const action_taken = typeof body.action_taken === "string" ? body.action_taken : undefined;
  const first_name = typeof body.first_name === "string" ? body.first_name : undefined;
  const last_name = typeof body.last_name === "string" ? body.last_name : undefined;
  const phone = typeof body.phone === "string" ? body.phone : undefined;
  const email = typeof body.email === "string" ? body.email : undefined;
  const industry = typeof body.industry === "string" ? body.industry : undefined;

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (action_taken !== undefined) update.action_taken = action_taken || null;
  if (first_name !== undefined) update.first_name = first_name || null;
  if (last_name !== undefined) update.last_name = last_name || null;
  if (phone !== undefined) update.phone = phone || null;
  if (email !== undefined) update.email = email || null;
  if (industry !== undefined) update.industry = industry || null;

  const { error } = await createServiceClient().from("janet_support_chats").update(update).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
