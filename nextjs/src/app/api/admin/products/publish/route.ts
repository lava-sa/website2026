export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, is_published } = await request.json();
  if (!id || is_published === undefined) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { error } = await createServiceClient()
    .from("products")
    .update({ is_published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/products", "layout");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
