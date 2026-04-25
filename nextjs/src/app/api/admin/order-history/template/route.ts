export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { ORDER_HISTORY_CSV_TEMPLATE } from "@/lib/order-history-import";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return new NextResponse(ORDER_HISTORY_CSV_TEMPLATE, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lava-sa-order-history-template.csv"',
    },
  });
}
