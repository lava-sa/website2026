import Image from "next/image";
import { Video } from "lucide-react";
import StructuredReviewBody from "@/components/reviews/StructuredReviewBody";
import { DEFAULT_REVIEW_AVATAR } from "@/lib/reviews/constants";
import type { DisplayReview, ReviewAnswer } from "@/lib/reviews/types";

export type TestimonialCardProps = {
  name: string;
  location?: string;
  tagLine?: string;
  avatarUrl?: string;
  rating?: number;
  headline?: string;
  quote?: string;
  text?: string;
  answers?: ReviewAnswer[];
  videoUrl?: string;
  isVideo?: boolean;
  showStructured?: boolean;
  compact?: boolean;
  className?: string;
};

function StarRow({ rating, size = "default" }: { rating: number; size?: "default" | "compact" }) {
  const dim = size === "compact" ? 14 : 16;
  return (
    <div className={`flex gap-1 ${size === "compact" ? "mb-3" : "mb-6"}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={dim}
          height={dim}
          viewBox="0 0 24 24"
          fill={i <= rating ? "var(--color-secondary)" : "var(--color-border)"}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function buildTagLine(review: DisplayReview): string | undefined {
  if (review.productLabel) return review.productLabel;
  if (review.date) return `Verified Buyer · ${review.date}`;
  return undefined;
}

export function displayReviewToTestimonial(review: DisplayReview): TestimonialCardProps {
  return {
    name: review.name,
    location: review.location,
    tagLine: buildTagLine(review),
    avatarUrl: review.avatarUrl,
    rating: review.rating,
    headline: review.headline,
    text: review.text,
    answers: review.answers,
    videoUrl: review.videoUrl,
    isVideo: review.isVideo,
  };
}

export default function ReviewTestimonialCard({
  name,
  location,
  tagLine,
  avatarUrl,
  rating = 5,
  headline,
  quote,
  text,
  answers,
  videoUrl,
  isVideo,
  showStructured = true,
  compact = false,
  className = "",
}: TestimonialCardProps) {
  const bodyText = quote ?? text;
  const hasStructured = showStructured && answers && answers.length > 0;
  const avatarSrc = avatarUrl || DEFAULT_REVIEW_AVATAR;

  return (
    <article
      className={`uk-card uk-card-default flex flex-col h-full border border-border/40 ${className}`}
    >
      <div className={`flex flex-col flex-1 min-h-0 ${compact ? "p-4" : "uk-card-body"}`}>
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex items-center justify-between gap-2">
            <StarRow rating={rating} size={compact ? "compact" : "default"} />
            {isVideo && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 shrink-0">
                <Video className="h-3 w-3" /> Video
              </span>
            )}
          </div>

          {headline && (
            <h3
              className={`font-black text-primary leading-snug ${compact ? "text-xs mb-2" : "text-sm mb-3"}`}
            >
              {headline}
            </h3>
          )}

          {isVideo && videoUrl ? (
            <video src={videoUrl} controls className="w-full aspect-video bg-black flex-1" />
          ) : hasStructured ? (
            <div className="flex-1">
              <StructuredReviewBody
                answers={answers!}
                compact
                className={compact ? "text-[13px]" : undefined}
              />
            </div>
          ) : bodyText ? (
            <blockquote
              className={`flex-1 italic leading-relaxed text-copy ${
                compact ? "text-[13px] line-clamp-6" : "text-[15px]"
              }`}
            >
              &ldquo;{bodyText}&rdquo;
            </blockquote>
          ) : null}
        </div>

        <footer className="mt-auto pt-5 border-t border-border flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-primary-wash">
            <Image
              src={avatarSrc}
              alt={name}
              fill
              className="object-cover object-center"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-base font-bold text-primary m-0 truncate">{name}</p>
            {location && (
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-copy-muted truncate">
                {location}
              </p>
            )}
            {tagLine && (
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-secondary line-clamp-2">
                {tagLine}
              </p>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
