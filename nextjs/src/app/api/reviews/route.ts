import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, company, city, machine, rating, headline, review, permission } = body;

  // Basic validation
  if (!name || !email || !rating || !headline || !review || !permission) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (review.trim().length < 20) {
    return NextResponse.json({ error: "Review too short" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabase.from("reviews").insert({
    name:     name.trim(),
    email:    email.trim().toLowerCase(),
    company:  company?.trim()  || null,
    city:     city?.trim()     || null,
    machine:  machine?.trim()  ?? null,
    rating:   Number(rating),
    headline: headline.trim(),
    review:   review.trim(),
    approved: false,
    created_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
