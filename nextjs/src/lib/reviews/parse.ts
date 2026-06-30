import type { ReviewAnswer } from "./types";

/** Parse stored review text (Question\\nAnswer blocks) into structured pairs. */
export function parseStructuredReview(text: string | null | undefined): ReviewAnswer[] {
  if (!text?.trim()) return [];

  const blocks = text.trim().split(/\n\n+/);
  const pairs: ReviewAnswer[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length < 2) continue;
    const question = lines[0]?.trim() ?? "";
    const answer = lines.slice(1).join("\n").trim();
    if (question && answer) pairs.push({ question, answer });
  }

  return pairs;
}

/** Prefer answers_json; fall back to parsing review text. */
export function getReviewAnswers(
  answersJson: ReviewAnswer[] | null | undefined,
  reviewText: string | null | undefined
): ReviewAnswer[] {
  if (Array.isArray(answersJson) && answersJson.length > 0) {
    return answersJson.filter((a) => a.question?.trim() && a.answer?.trim());
  }
  return parseStructuredReview(reviewText);
}

/** Short excerpt for cards when only structured answers exist. */
export function reviewExcerpt(
  headline: string | null | undefined,
  answers: ReviewAnswer[],
  reviewText: string | null | undefined,
  maxLen = 220
): string {
  if (headline?.trim()) return headline.trim();
  const service = answers.find((a) => /service|support|team|anneke/i.test(a.question));
  if (service?.answer) return truncate(service.answer, maxLen);
  if (answers[0]?.answer) return truncate(answers[0].answer, maxLen);
  if (reviewText?.trim()) return truncate(reviewText.trim(), maxLen);
  return "";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function formatReviewDate(isoOrDisplay: string): string {
  if (!isoOrDisplay.includes("T") && !isoOrDisplay.includes("-")) return isoOrDisplay;
  const d = new Date(isoOrDisplay);
  if (Number.isNaN(d.getTime())) return isoOrDisplay;
  return d.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

/** Higher score = more detailed review (for hero gallery placement). */
export function reviewDetailScore(review: {
  isVideo?: boolean;
  text?: string;
  headline?: string;
  answers?: { answer: string }[];
}): number {
  if (review.isVideo) return 0;
  let score = 0;
  if (review.answers?.length) {
    score += review.answers.reduce((sum, a) => sum + a.answer.length, 0);
    score += review.answers.length * 40;
  }
  if (review.text) score += review.text.length;
  if (review.headline) score += 30;
  return score;
}

export function pickMostDetailedReviews<T extends { id: string; isVideo?: boolean; text?: string; headline?: string; answers?: { answer: string }[] }>(
  reviews: T[],
  count = 2
): T[] {
  const written = reviews.filter((r) => !r.isVideo && reviewDetailScore(r) > 0);
  if (written.length === 0) return [];
  return [...written]
    .sort((a, b) => reviewDetailScore(b) - reviewDetailScore(a))
    .slice(0, count);
}
