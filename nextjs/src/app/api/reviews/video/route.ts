import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { createServiceClient } = await import("@/lib/supabase");
  const supabase = createServiceClient();
  try {
    const formData = await req.formData();
    const file    = formData.get("video") as File | null;
    const name    = formData.get("name") as string;
    const product = formData.get("product") as string;

    if (!file || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "Video file too large (max 100 MB)" }, { status: 413 });
    }

    const ext      = file.type.includes("mp4") ? "mp4" : "webm";
    const filename = `testimonials/${Date.now()}-${name.replace(/\s+/g, "-").toLowerCase()}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(filename, buffer, {
        contentType: file.type || "video/webm",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(filename);

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
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Video review upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
