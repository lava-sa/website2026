import type { Metadata } from "next";
import { Star } from "lucide-react";
import ReviewFormClient from "./ReviewFormClient";

export const metadata: Metadata = {
  title: "Share Your Lava Story — Submit a Review",
  description:
    "Tell us about your LAVA vacuum sealer experience. Write a review or record a short video story. All reviews are moderated by Anneke before going live.",
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SubmitReviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialTab: "write" | "video" = params.tab === "video" ? "video" : "write";

  return (
    <main className="min-h-screen bg-surface">

      {/* Hero — server rendered, visible without JS */}
      <section className="bg-primary py-16">
        <div className="section-container max-w-2xl text-center">
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-6 w-6 fill-secondary text-secondary" />
            ))}
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Share Your Lava Story</h1>
          <p className="text-white/70 text-base leading-relaxed">
            Baie dankie vir jou lojaliteit. Write a quick review or record a short video —
            your story helps other South Africans discover the LAVA difference.
          </p>
        </div>
      </section>

      {/* Form card */}
      <div className="section-container max-w-2xl py-12">
        <div className="bg-white shadow-sm border border-border px-8 py-10 sm:px-10">
          {/* No Suspense needed — initialTab is resolved server-side */}
          <ReviewFormClient initialTab={initialTab} />
        </div>
        <p className="text-center text-xs text-copy-muted mt-6">
          All submissions are moderated before going live · Your details are never shared publicly
        </p>
      </div>

    </main>
  );
}
