export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/admin-dashboard-stats";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
