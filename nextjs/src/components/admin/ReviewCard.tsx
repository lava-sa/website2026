"use client";

import { useState } from "react";
import { Check, X, Loader2, Star, Video, MessageSquare, Play } from "lucide-react";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  city: string | null;
  machine: string | null;
  rating: number | null;
  headline: string | null;
  review: string | null;
  approved: boolean;
  created_at: string;
  review_type: "text" | "video" | null;
  video_url: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function VideoPreview({ url, name }: { url: string; name: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        src={url}
        controls
        autoPlay
        className="w-full max-w-md aspect-video bg-black"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full max-w-md aspect-video bg-gray-900 flex flex-col items-center justify-center gap-3 group hover:bg-gray-800 transition-colors border border-gray-700"
    >
      <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
        <Play className="h-7 w-7 text-white fill-white ml-1" />
      </div>
      <span className="text-white/60 text-xs font-medium">Click to play {name}&apos;s video</span>
    </button>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  const router  = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const isVideo = review.review_type === "video";

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, approved: action === "approve" }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className={`bg-white border p-5 ${
      review.approved
        ? "border-gray-200"
        : isVideo
        ? "border-purple-200 bg-purple-50/20"
        : "border-amber-200 bg-amber-50/30"
    }`}>

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-3">
        {isVideo ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 border border-purple-200 px-2 py-1">
            <Video className="h-3 w-3" /> Video Testimonial
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1">
            <MessageSquare className="h-3 w-3" /> Written Review
          </span>
        )}
        <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">

          {/* VIDEO: player */}
          {isVideo && review.video_url && (
            <VideoPreview url={review.video_url} name={review.name} />
          )}

          {/* TEXT: stars + headline + body */}
          {!isVideo && (
            <>
              {review.rating && (
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5"
                      fill={i < (review.rating ?? 0) ? "var(--color-secondary)" : "none"}
                      stroke={i < (review.rating ?? 0) ? "var(--color-secondary)" : "#d1d5db"} />
                  ))}
                </div>
              )}
              {review.headline && (
                <p className="font-bold text-gray-900 text-sm">{review.headline}</p>
              )}
              {review.review && (
                <p className="text-sm text-gray-600 leading-relaxed">{review.review}</p>
              )}
            </>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-1 border-t border-gray-100">
            <span className="font-semibold text-gray-700">{review.name}</span>
            {review.company && <span className="text-gray-600">{review.company}</span>}
            {review.city && <span>{review.city}</span>}
            {review.email && <span>{review.email}</span>}
            {review.machine && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 font-medium">{review.machine}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {!review.approved ? (
            <>
              <button
                onClick={() => handleAction("approve")}
                disabled={loading !== null}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 px-3 py-2 hover:bg-emerald-100 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading === "approve"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Check className="h-3.5 w-3.5" />}
                {isVideo ? "Approve Video" : "Approve"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={loading !== null}
                className="flex items-center gap-1.5 text-xs font-bold text-red-700 border border-red-200 bg-red-50 px-3 py-2 hover:bg-red-100 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading === "reject"
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <X className="h-3.5 w-3.5" />}
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => handleAction("reject")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 border border-gray-200 px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              {loading === "reject"
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <X className="h-3.5 w-3.5" />}
              Unpublish
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
