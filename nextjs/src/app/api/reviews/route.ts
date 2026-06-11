export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    name,
    email,
    company,
    city,
    machine,
    rating,
    headline,
    review,
    permission,
    reviewCategory,
  } = body;

  if (!name || !email || !rating || !headline || !review || !permission) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (review.trim().length < 80) {
    return NextResponse.json({ error: "Please answer all questions in more detail" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("reviews").insert({
    name:     name.trim(),
    email:    email.trim().toLowerCase(),
    company:  company?.trim()  || null,
    city:     city?.trim()     || null,
    machine:  machine?.trim()  ?? (reviewCategory ? `[${reviewCategory}]` : null),
    rating:   Number(rating),
    headline: headline.trim(),
    review:   review.trim(),
    approved: false,
    created_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
