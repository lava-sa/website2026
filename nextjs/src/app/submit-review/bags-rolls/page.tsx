import type { Metadata } from "next";
import ReviewFormShell from "@/components/reviews/ReviewFormShell";
import { getReviewFormConfig } from "@/lib/review-forms";

const config = getReviewFormConfig("bags-rolls");

export const metadata: Metadata = {
  title: `${config.pageTitle} — Lava-SA`,
  description: config.pageDescription,
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SubmitBagsRollsReviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialTab: "write" | "video" = params.tab === "video" ? "video" : "write";

  return <ReviewFormShell variant="bags-rolls" initialTab={initialTab} />;
}
