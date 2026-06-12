export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getRegistryEntry } from "@/lib/content/site-page-registry";
import { getSitePageContent, saveSitePageContent } from "@/lib/queries/site-pages";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const entry = getRegistryEntry(slug);
  if (!entry) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const content = await getSitePageContent(slug);
  return NextResponse.json({ entry, content });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const entry = getRegistryEntry(slug);
  if (!entry) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const body = await req.json();
  const content = body?.content;
  if (!content || typeof content !== "object") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const result = await saveSitePageContent(slug, content);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  revalidatePath(entry.path);
  if (slug === "home") revalidatePath("/");

  return NextResponse.json({ ok: true });
}
