import ReviewFormShell from "@/components/reviews/ReviewFormShell";
import { reviewFormMetadata } from "@/lib/review-forms";

export const metadata = reviewFormMetadata("bags-rolls");

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SubmitBagsRollsReviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialTab: "write" | "video" = params.tab === "video" ? "video" : "write";

  return <ReviewFormShell variant="bags-rolls" initialTab={initialTab} />;
}
