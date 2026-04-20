import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@supabase/supabase-js";
import ReviewCard from "@/components/admin/ReviewCard";
import { Star, Video } from "lucide-react";

async function getReviews() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await supabase
    .from("reviews")
    .select("id, name, email, company, city, machine, rating, headline, review, approved, created_at, review_type, video_url")
    .order("created_at", { ascending: false });
  return data ?? [];
}

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

export default async function AdminReviewsPage() {
  const reviews  = await getReviews() as Review[];
  const pending  = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);
  const videos   = reviews.filter((r) => r.review_type === "video");

  return (
    <AdminShell>
      <div className="max-w-4xl">

        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pending.length} pending approval · {approved.length} published
            {videos.length > 0 && ` · ${videos.length} video testimonial${videos.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {reviews.length === 0 ? (
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
                  {pending.map((r) => <ReviewCard key={r.id} review={r} />)}
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
                  {approved.map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </AdminShell>
  );
}
