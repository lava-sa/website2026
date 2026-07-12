export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getDemoType, DEMO_BOOKING_ENABLED } from "@/lib/demo-booking-config";
import {
  computeAvailableDemoSlots,
  generateDemoReference,
  isBookableDate,
  parseLocalDate,
} from "@/lib/demo-availability";
import { sendDemoBookingEmails } from "@/lib/demo-booking-email";
import {
  guardFailureResponse,
  verifyPublicFormSubmission,
} from "@/lib/security/public-form-guard";
import { emailDomainCanReceiveMail } from "@/lib/security/email-domain-check";

interface DemoBookingPayload {
  demoSlug: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  turnstileToken?: string;
  website?: string;
}

export async function POST(req: NextRequest) {
  if (!DEMO_BOOKING_ENABLED) {
    return NextResponse.json(
      { error: "Demonstration booking is not available at this time." },
      { status: 503 },
    );
  }

  try {
    const body: DemoBookingPayload = await req.json();
    const {
      demoSlug,
      date,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone,
      notes,
      turnstileToken,
      website,
    } = body;

    const guard = await verifyPublicFormSubmission(req, {
      turnstileToken,
      website,
      email: customerEmail,
      name: customerName,
    });
    if (!guard.ok) {
      const fail = guardFailureResponse(guard);
      return NextResponse.json(fail.body, { status: fail.status });
    }

    if (!demoSlug || !date || !timeSlot || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }

    if (!/^\d{2}:\d{2}$/.test(timeSlot)) {
      return NextResponse.json({ error: "Invalid time slot." }, { status: 400 });
    }

    const normalizedEmail = customerEmail.trim().toLowerCase();
    if (!(await emailDomainCanReceiveMail(normalizedEmail))) {
      return NextResponse.json(
        { error: "Please enter a valid, working email address so we can confirm your booking." },
        { status: 400 }
      );
    }

    if (!isBookableDate(parseLocalDate(date))) {
      return NextResponse.json(
        { error: "Date is not bookable (Tuesday, Wednesday or Thursday only)." },
        { status: 400 }
      );
    }

    const demo = getDemoType(demoSlug);
    if (!demo) {
      return NextResponse.json({ error: "Unknown demonstration type." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("demo_bookings")
      .select("time_slot")
      .eq("date", date)
      .neq("status", "cancelled");

    if (fetchErr) {
      console.error("demo_bookings fetch:", fetchErr.message);
      return NextResponse.json({ error: "Failed to check availability." }, { status: 500 });
    }

    const slots = computeAvailableDemoSlots(existing ?? []);
    const requested = slots.find((s) => s.time === timeSlot);
    if (!requested?.available) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another." },
        { status: 409 }
      );
    }

    const reference = generateDemoReference(date);
    const { error: insertErr } = await supabase.from("demo_bookings").insert({
      reference,
      demo_type: demo.title,
      demo_slug: demo.slug,
      customer_name: customerName.trim(),
      customer_email: normalizedEmail,
      customer_phone: customerPhone.trim(),
      date,
      time_slot: timeSlot,
      notes: notes?.trim() || null,
      status: "confirmed",
    });

    if (insertErr) {
      if (insertErr.code === "23505") {
        return NextResponse.json(
          { error: "This time slot was just taken. Please choose another." },
          { status: 409 }
        );
      }
      console.error("demo_bookings insert:", insertErr.message);
      return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
    }

    await sendDemoBookingEmails({
      reference,
      demo,
      date,
      timeSlot,
      customerName: customerName.trim(),
      customerEmail: normalizedEmail,
      customerPhone: customerPhone.trim(),
      notes: notes?.trim(),
    });

    return NextResponse.json({ ok: true, reference });
  } catch (err) {
    console.error("POST /api/demo-bookings:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
