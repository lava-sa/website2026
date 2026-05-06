export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

type DeleteBody = {
  ids?: string[];
  emptyTrash?: boolean;
};

export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: DeleteBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const emptyTrash = body.emptyTrash === true;
  const ids = Array.isArray(body.ids) ? body.ids.filter((id) => typeof id === "string" && id.length > 0) : [];
  if (!emptyTrash && !ids.length) return NextResponse.json({ error: "No order ids provided" }, { status: 400 });
  const supabase = createServiceClient();

  let targetIds = ids;
  if (emptyTrash) {
    const { data: trashed, error: trashedErr } = await supabase.from("orders").select("id").not("trashed_at", "is", null);
    if (trashedErr) return NextResponse.json({ error: trashedErr.message }, { status: 500 });
    targetIds = (trashed ?? []).map((o) => o.id);
  } else {
    const { data: trashed, error: trashedErr } = await supabase.from("orders").select("id").in("id", ids).not("trashed_at", "is", null);
    if (trashedErr) return NextResponse.json({ error: trashedErr.message }, { status: 500 });
    targetIds = (trashed ?? []).map((o) => o.id);
  }

  if (!targetIds.length) return NextResponse.json({ ok: true, deleted: 0 });

  const { error: deleteErr } = await supabase.from("orders").delete().in("id", targetIds);
  if (deleteErr) return NextResponse.json({ error: deleteErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, deleted: targetIds.length });
}
