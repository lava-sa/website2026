import ReviewFormShell from "@/components/reviews/ReviewFormShell";
import { reviewFormMetadata } from "@/lib/review-forms";

export const metadata = reviewFormMetadata("machines");

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SubmitMachineReviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialTab: "write" | "video" = params.tab === "video" ? "video" : "write";

  return <ReviewFormShell variant="machines" initialTab={initialTab} />;
}
