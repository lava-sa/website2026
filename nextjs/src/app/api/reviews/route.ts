export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import {
  guardFailureResponse,
  verifyPublicFormSubmission,
} from "@/lib/security/public-form-guard";
import { sendReviewSubmissionEmails } from "@/lib/reviews/email";
import type { ReviewAnswer } from "@/lib/reviews/types";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const guard = await verifyPublicFormSubmission(request, {
    turnstileToken: body.turnstileToken,
    website: body.website,
    email: body.email,
    name: body.name,
  });
  if (!guard.ok) {
    const fail = guardFailureResponse(guard);
    return NextResponse.json(fail.body, { status: fail.status });
  }

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
    product_slug,
    review_scope,
    answers_json,
  } = body;

  if (!name || !email || !rating || !headline || !review || !permission) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (review.trim().length < 80) {
    return NextResponse.json({ error: "Please answer all questions in more detail" }, { status: 400 });
  }

  const scope = review_scope === "general" ? "general" : "product";
  const parsedAnswers: ReviewAnswer[] = Array.isArray(answers_json)
    ? answers_json.filter((a: ReviewAnswer) => a?.question && a?.answer)
    : [];

  const supabase = createServiceClient();

  const { error } = await supabase.from("reviews").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company?.trim() || null,
    city: city?.trim() || null,
    machine: machine?.trim() ?? (reviewCategory ? `[${reviewCategory}]` : null),
    product_slug: scope === "general" ? null : product_slug?.trim() || null,
    review_scope: scope,
    rating: Number(rating),
    headline: headline.trim(),
    review: review.trim(),
    answers_json: parsedAnswers.length > 0 ? parsedAnswers : null,
    review_type: "written",
    approved: false,
    created_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  void sendReviewSubmissionEmails({
    name: name.trim(),
    email: email.trim(),
    headline: headline.trim(),
    machine: machine?.trim(),
    reviewScope: scope,
    productSlug: product_slug,
    rating: Number(rating),
    reviewType: "written",
  });

  return NextResponse.json({ ok: true });
}
