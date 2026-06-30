export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import ReviewCard from "@/components/admin/ReviewCard";
import { Star } from "lucide-react";
import type { ReviewScope } from "@/lib/reviews/types";

async function getReviews() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      "id, name, email, company, city, machine, product_slug, review_scope, rating, headline, review, answers_json, approved, created_at, review_type, video_url"
    )
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getProductOptions() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("slug, name, categories(name)")
    .eq("is_published", true)
    .order("name");

  return (data ?? []).map((p) => ({
    slug: p.slug as string,
    name: p.name as string,
    category: (p.categories as { name?: string } | null)?.name ?? "Product",
  }));
}

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
  video_url: string | null;
};

export default async function AdminReviewsPage() {
  const [reviews, productOptions] = await Promise.all([getReviews(), getProductOptions()]);
  const typed = reviews as Review[];
  const pending = typed.filter((r) => !r.approved);
  const approved = typed.filter((r) => r.approved);
  const videos = typed.filter((r) => r.review_type === "video");

  return (
    <AdminShell>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pending.length} pending approval · {approved.length} published
            {videos.length > 0 && ` · ${videos.length} video testimonial${videos.length > 1 ? "s" : ""}`}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Reject/Delete permanently removes the review. Link product pages under &ldquo;Display location&rdquo; before approving.
          </p>
        </div>

        {typed.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1">Reviews submitted via the website will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending Approval ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map((r) => (
                    <ReviewCard key={r.id} review={r} productOptions={productOptions} />
                  ))}
                </div>
              </div>
            )}

            {approved.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Published ({approved.length})
                </h2>
                <div className="space-y-3">
                  {approved.map((r) => (
                    <ReviewCard key={r.id} review={r} productOptions={productOptions} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
