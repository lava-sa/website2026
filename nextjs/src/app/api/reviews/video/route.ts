import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file    = formData.get("video") as File | null;
    const name    = formData.get("name") as string;
    const product = formData.get("product") as string;

    if (!file || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Limit to 100 MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "Video file too large (max 100 MB)" }, { status: 413 });
    }

    const filename = `testimonials/${Date.now()}-${name.replace(/\s+/g, "-").toLowerCase()}.webm`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage (bucket: "videos")
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(filename, buffer, {
        contentType: "video/webm",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(filename);

    // Save record to reviews table (same columns as text reviews)
    const { error: dbError } = await supabase.from("reviews").insert({
      name,
      machine:     product || null,
      review_type: "video",
      video_url:   publicUrl,
      approved:    false,
      rating:      null,
      headline:    null,
      review:      null,
      email:       null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      // Don't fail — video is uploaded, just log the DB issue
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Video review upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
