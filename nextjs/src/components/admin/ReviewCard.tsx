"use client";

import { useState } from "react";
import { Check, X, Loader2, Star, Video, MessageSquare, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import StructuredReviewBody from "@/components/reviews/StructuredReviewBody";
import { getReviewAnswers } from "@/lib/reviews/parse";
import type { ReviewScope } from "@/lib/reviews/types";

type Review = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  city: string | null;
  machine: string | null;
  product_slug: string | null;
  review_scope: ReviewScope | null;
  rating: number | null;
  headline: string | null;
  review: string | null;
  answers_json: { question: string; answer: string }[] | null;
  approved: boolean;
  created_at: string;
  review_type: "text" | "video" | "written" | null;
  source?: string | null;
  legacy_import_key?: string | null;
};

type ProductOption = { slug: string; name: string; category: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function VideoPreview({ url, name }: { url: string; name: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video src={url} controls autoPlay className="w-full max-w-md aspect-video bg-black" />
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

export default function ReviewCard({
  review,
  productOptions,
}: {
  review: Review;
  productOptions: ProductOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | "unpublish" | "link" | null>(null);
  const [productSlug, setProductSlug] = useState(review.product_slug ?? "");
  const [reviewScope, setReviewScope] = useState<ReviewScope>(
    review.review_scope === "general" ? "general" : "product"
  );

  const isVideo = review.review_type === "video";
  const answers = getReviewAnswers(review.answers_json, review.review);

  async function handleApprove() {
    setLoading("approve");
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, approved: true }),
    });
    setLoading(null);
    router.refresh();
  }

  async function handleReject() {
    if (!confirm("Permanently delete this review? This cannot be undone.")) return;
    setLoading("reject");
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id }),
    });
    setLoading(null);
    router.refresh();
  }

  async function handleUnpublish() {
    setLoading("unpublish");
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, approved: false }),
    });
    setLoading(null);
    router.refresh();
  }

  async function handleLinkSave() {
    setLoading("link");
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: review.id,
        product_slug: reviewScope === "general" ? null : productSlug || null,
        review_scope: reviewScope,
      }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div
      className={`bg-white border p-5 ${
        review.approved
          ? "border-gray-200"
          : isVideo
            ? "border-purple-200 bg-purple-50/20"
            : "border-amber-200 bg-amber-50/30"
      }`}
    >
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
        {review.source === "imported" && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1">
            Imported
          </span>
        )}
        <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
        {review.review_scope === "general" && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1">
            General
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {isVideo && review.video_url && <VideoPreview url={review.video_url} name={review.name} />}

          {!isVideo && (
            <>
              {review.rating && (
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5"
                      fill={i < (review.rating ?? 0) ? "var(--color-secondary)" : "none"}
                      stroke={i < (review.rating ?? 0) ? "var(--color-secondary)" : "#d1d5db"}
                    />
                  ))}
                </div>
              )}
              {review.headline && (
                <p className="font-bold text-gray-900 text-sm">{review.headline}</p>
              )}
              {answers.length > 0 ? (
                <StructuredReviewBody answers={answers} compact className="max-w-2xl" />
              ) : review.review ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{review.review}</p>
              ) : null}
            </>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-1 border-t border-gray-100">
            <span className="font-semibold text-gray-700">{review.name}</span>
            {review.company && <span className="text-gray-600">{review.company}</span>}
            {review.city && <span>{review.city}</span>}
            {review.email && <span>{review.email}</span>}
            {review.machine && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 font-medium">{review.machine}</span>
            )}
            {review.product_slug && (
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 font-medium">
                → /products/{review.product_slug}
              </span>
            )}
          </div>

          <div className="border border-gray-200 bg-gray-50 p-3 space-y-2 max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Display location
            </p>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="radio"
                  name={`scope-${review.id}`}
                  checked={reviewScope === "general"}
                  onChange={() => setReviewScope("general")}
                />
                General service (/reviews)
              </label>
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="radio"
                  name={`scope-${review.id}`}
                  checked={reviewScope === "product"}
                  onChange={() => setReviewScope("product")}
                />
                Product page
              </label>
            </div>
            {reviewScope === "product" && (
              <select
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                className="w-full border border-gray-300 bg-white px-2 py-1.5 text-xs"
              >
                <option value="">— Select product page —</option>
                {productOptions.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={handleLinkSave}
              disabled={loading !== null}
              className="text-xs font-bold text-primary border border-gray-300 px-3 py-1.5 hover:bg-white disabled:opacity-60"
            >
              {loading === "link" ? <Loader2 className="h-3.5 w-3.5 animate-spin inline" /> : "Save link"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {!review.approved ? (
            <>
              <button
                onClick={handleApprove}
                disabled={loading !== null}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 px-3 py-2 hover:bg-emerald-100 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading === "approve" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {isVideo ? "Approve Video" : "Approve"}
              </button>
              <button
                onClick={handleReject}
                disabled={loading !== null}
                className="flex items-center gap-1.5 text-xs font-bold text-red-700 border border-red-200 bg-red-50 px-3 py-2 hover:bg-red-100 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading === "reject" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUnpublish}
                disabled={loading !== null}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 border border-gray-200 px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                {loading === "unpublish" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
                Unpublish
              </button>
              <button
                onClick={handleReject}
                disabled={loading !== null}
                className="flex items-center gap-1.5 text-xs font-bold text-red-700 border border-red-200 bg-red-50 px-3 py-2 hover:bg-red-100 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {loading === "reject" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
