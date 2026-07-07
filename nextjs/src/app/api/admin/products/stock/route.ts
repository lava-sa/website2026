export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";


export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, stock_status } = await request.json();
  if (!id || !stock_status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { error } = await createServiceClient()
    .from("products")
    .update({ stock_status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/products", "layout");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
