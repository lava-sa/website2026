export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import {
  computeAvailableDemoSlots,
  isBookableDate,
  parseLocalDate,
} from "@/lib/demo-availability";
import { getDemoType, DEMO_BOOKING_ENABLED } from "@/lib/demo-booking-config";

export async function GET(req: NextRequest) {
  if (!DEMO_BOOKING_ENABLED) {
    return NextResponse.json(
      { error: "Demonstration booking is not available at this time." },
      { status: 503 },
    );
  }

  const date = req.nextUrl.searchParams.get("date");
  const demo = req.nextUrl.searchParams.get("demo");

  if (!date || !demo) {
    return NextResponse.json(
      { error: "Missing required params: date, demo" },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
  }

  if (!getDemoType(demo)) {
    return NextResponse.json({ error: "Unknown demonstration type." }, { status: 400 });
  }

  if (!isBookableDate(parseLocalDate(date))) {
    return NextResponse.json(
      { error: "Date is not bookable (must be a future Tuesday, Wednesday or Thursday)." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("demo_bookings")
    .select("time_slot")
    .eq("date", date)
    .neq("status", "cancelled");

  if (error) {
    console.error("demo_bookings fetch:", error.message);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }

  const slots = computeAvailableDemoSlots(data ?? []);
  return NextResponse.json({ slots });
}
