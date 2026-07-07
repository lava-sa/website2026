import { NextRequest, NextResponse } from "next/server";
import { buildReviewLoginPath, isCustomerEmailOnFile } from "@/lib/review-customer-gate";

export const dynamic = "force-dynamic";

// POST /api/reviews/video  — save metadata after client has uploaded directly to Supabase
export async function POST(req: NextRequest) {
  const { createServiceClient } = await import("@/lib/supabase");
  const supabase = createServiceClient();
  try {
    const { path, name, email, product, product_slug, review_scope } = await req.json();

    if (!path || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!(await isCustomerEmailOnFile(normalizedEmail))) {
      return NextResponse.json(
        {
          error:
            "We couldn't find this email in our customer records. Sign in or create an account to continue.",
          code: "customer_not_found",
          loginUrl: buildReviewLoginPath(normalizedEmail, "/submit-review"),
        },
        { status: 403 }
      );
    }

    const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(path);

    const scope = review_scope === "general" ? "general" : "product";

    const { error: dbError } = await supabase.from("reviews").insert({
      name,
      email: normalizedEmail,
      machine: product || null,
      product_slug: scope === "general" ? null : product_slug?.trim() || null,
      review_scope: scope,
      review_type: "video",
      video_url: publicUrl,
      approved: false,
      rating: null,
      headline: null,
      review: null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json(
        { error: "Could not save your video submission. Please try again or use WhatsApp." },
        { status: 500 }
      );
    }

    const { sendReviewSubmissionEmails } = await import("@/lib/reviews/email");
    void sendReviewSubmissionEmails({
      name,
      email: email.trim(),
      machine: product,
      reviewScope: scope,
      productSlug: product_slug,
      reviewType: "video",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Video review metadata error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/reviews/video?name=xxx&ext=webm  — create a signed upload URL
export async function GET(req: NextRequest) {
  const { createServiceClient } = await import("@/lib/supabase");
  const supabase = createServiceClient();
  try {
    const name = req.nextUrl.searchParams.get("name") || "unknown";
    const ext  = req.nextUrl.searchParams.get("ext") === "mp4" ? "mp4" : "webm";
    const path = `testimonials/${Date.now()}-${name.replace(/\s+/g, "-").toLowerCase()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("videos")
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Signed URL error:", error);
      return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl, path });
  } catch (err) {
    console.error("Presign error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
