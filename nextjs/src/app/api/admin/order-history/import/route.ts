export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { parseCsv } from "@/lib/parse-csv";
import { buildOrderHistoryRow, type OrderHistoryInsert } from "@/lib/order-history-import";
import { linkOrderHistoryToCustomers } from "@/lib/order-history-link-customers";

const BATCH = 200;

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { dryRun?: boolean; csv?: string; rows?: Record<string, string>[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const dryRun = Boolean(body.dryRun);
  let rows: Record<string, string>[] = [];

  if (Array.isArray(body.rows) && body.rows.length) {
    rows = body.rows;
  } else if (typeof body.csv === "string" && body.csv.trim()) {
    const parsed = parseCsv(body.csv);
    rows = parsed.rows;
  } else {
    return NextResponse.json(
      { error: "Provide `csv` (string) or `rows` (array of objects keyed by header)" },
      { status: 400 }
    );
  }

  const errors: { rowNumber: number; message: string }[] = [];
  const valid: OrderHistoryInsert[] = [];

  rows.forEach((row, idx) => {
    const rowNumber = idx + 2;
    const built = buildOrderHistoryRow(row, rowNumber);
    if (!built.ok) {
      if (errors.length < 100) errors.push({ rowNumber: built.rowNumber, message: built.message });
    } else {
      valid.push(built.row);
    }
  });

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      rowCount: rows.length,
      validCount: valid.length,
      errorCount: errors.length,
      errors: errors.slice(0, 50),
      sample: valid.slice(0, 3),
    });
  }

  if (valid.length === 0) {
    return NextResponse.json({ error: "No valid rows to import", errors: errors.slice(0, 50) }, { status: 400 });
  }

  const supabase = createServiceClient();
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < valid.length; i += BATCH) {
    const chunk = valid.slice(i, i + BATCH).map((r) => ({
      ...r,
      items: r.items as object,
    }));

    const { error } = await supabase.from("order_history").upsert(chunk, {
      onConflict: "wp_order_id",
    });

    if (error) {
      failed += chunk.length;
      if (errors.length < 100) {
        errors.push({ rowNumber: i + 2, message: error.message });
      }
    } else {
      inserted += chunk.length;
    }
  }

  await linkOrderHistoryToCustomers(supabase);

  revalidatePath("/admin");
  revalidatePath("/admin/order-history");

  return NextResponse.json({
    dryRun: false,
    inserted,
    failed,
    errorCount: errors.length,
    errors: errors.slice(0, 50),
  });
}
