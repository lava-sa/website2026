export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import {
  countImportedLegacyReviews,
  getStaticReviewCatalogStats,
  importStaticReviewsToDatabase,
} from "@/lib/reviews/import-static";


export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const catalog = getStaticReviewCatalogStats();
  const importedCount = await countImportedLegacyReviews();

  return NextResponse.json({
    ...catalog,
    importedCount,
    pendingImport: Math.max(0, catalog.totalImportable - importedCount),
  });
}

export async function POST() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await importStaticReviewsToDatabase();
  const importedCount = await countImportedLegacyReviews();

  if (result.schemaError) {
    return NextResponse.json(
      {
        ok: false,
        ...result,
        importedCount,
        error: result.schemaHint ?? result.schemaError,
      },
      { status: 422 }
    );
  }

  if (result.imported === 0 && result.errors.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        ...result,
        importedCount,
        error: result.errors[0],
      },
      { status: 500 }
    );
  }

  if (result.imported === 0 && result.rowsPrepared === 0 && result.skipped > 0) {
    return NextResponse.json({
      ok: true,
      ...result,
      importedCount,
      message: `All ${result.skipped} reviews were already imported.`,
    });
  }

  if (result.imported === 0 && result.rowsPrepared > 0) {
    return NextResponse.json(
      {
        ok: false,
        ...result,
        importedCount,
        error: result.errors[0] ?? "Insert failed for all prepared rows.",
      },
      { status: 500 }
    );
  }

  if (result.imported > 0 && result.errors.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        ...result,
        importedCount,
        error: `Imported ${result.imported} of ${result.rowsPrepared}; ${result.errors[0]}`,
      },
      { status: 207 }
    );
  }

  return NextResponse.json({
    ok: result.errors.length === 0,
    ...result,
    importedCount,
  });
}
