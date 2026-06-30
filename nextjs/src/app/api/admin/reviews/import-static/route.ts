export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  countImportedLegacyReviews,
  getStaticReviewCatalogStats,
  importStaticReviewsToDatabase,
} from "@/lib/reviews/import-static";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const catalog = getStaticReviewCatalogStats();
  const importedCount = await countImportedLegacyReviews();

  return NextResponse.json({
    ...catalog,
    importedCount,
    pendingImport: Math.max(0, catalog.totalImportable - importedCount),
  });
}

export async function POST() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await importStaticReviewsToDatabase();
  const importedCount = await countImportedLegacyReviews();

  return NextResponse.json({
    ok: result.errors.length === 0,
    ...result,
    importedCount,
  });
}
