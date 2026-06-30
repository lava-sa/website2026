"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Package, Star, Users, Video } from "lucide-react";
import ReviewCard from "@/components/admin/ReviewCard";
import type { ReviewScope } from "@/lib/reviews/types";

export type AdminReview = {
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
  source?: string | null;
  legacy_import_key?: string | null;
};

type ProductOption = { slug: string; name: string; category: string };

type ImportStats = {
  productSlugs: number;
  jsonReviewCount: number;
  homepageReviewCount: number;
  totalImportable: number;
  importedCount: number;
  pendingImport: number;
};

type ProductGroup = {
  slug: string | null;
  label: string;
  category: string;
  reviews: AdminReview[];
  published: number;
  pending: number;
};

function groupReviewsByProduct(
  reviews: AdminReview[],
  productOptions: ProductOption[]
): ProductGroup[] {
  const nameBySlug = new Map(productOptions.map((p) => [p.slug, p.name]));
  const categoryBySlug = new Map(productOptions.map((p) => [p.slug, p.category]));
  const buckets = new Map<string, AdminReview[]>();

  for (const review of reviews) {
    if (review.review_scope === "general") continue;
    if (review.review_type === "video") continue;
    const slug = review.product_slug ?? "__unlinked__";
    const list = buckets.get(slug) ?? [];
    list.push(review);
    buckets.set(slug, list);
  }

  const groups: ProductGroup[] = [];

  for (const [slug, list] of buckets.entries()) {
    if (slug === "__unlinked__") {
      groups.push({
        slug: null,
        label: "Unlinked — no product page",
        category: "Needs assignment",
        reviews: list.sort((a, b) => b.created_at.localeCompare(a.created_at)),
        published: list.filter((r) => r.approved).length,
        pending: list.filter((r) => !r.approved).length,
      });
      continue;
    }

    groups.push({
      slug,
      label: nameBySlug.get(slug) ?? slug.replace(/-/g, " "),
      category: categoryBySlug.get(slug) ?? "Product",
      reviews: list.sort((a, b) => b.created_at.localeCompare(a.created_at)),
      published: list.filter((r) => r.approved).length,
      pending: list.filter((r) => !r.approved).length,
    });
  }

  return groups.sort((a, b) => a.label.localeCompare(b.label));
}

export default function ReviewsAdminClient({
  reviews,
  productOptions,
  importStats,
}: {
  reviews: AdminReview[];
  productOptions: ProductOption[];
  importStats: ImportStats;
}) {
  const router = useRouter();
  const [view, setView] = useState<"products" | "pending" | "general" | "videos">("products");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string>("");

  const pending = useMemo(() => reviews.filter((r) => !r.approved), [reviews]);
  const general = useMemo(
    () => reviews.filter((r) => r.review_scope === "general" && r.review_type !== "video"),
    [reviews]
  );
  const videos = useMemo(() => reviews.filter((r) => r.review_type === "video"), [reviews]);
  const productGroups = useMemo(
    () => groupReviewsByProduct(reviews, productOptions),
    [reviews, productOptions]
  );

  const publishedCount = reviews.filter((r) => r.approved).length;

  async function handleImport() {
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await fetch("/api/admin/reviews/import-static", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setImportMsg(data.error ?? "Import failed");
        return;
      }
      setImportMsg(
        `Imported ${data.imported} reviews${data.skipped ? ` (${data.skipped} already in database)` : ""}.`
      );
      router.refresh();
    } catch {
      setImportMsg("Import failed — check server logs.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {pending.length} pending · {publishedCount} published · {productGroups.length} product groups
          {videos.length > 0 && ` · ${videos.length} video${videos.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {importStats.pendingImport > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-amber-900 text-sm">
              {importStats.pendingImport} site reviews are not in the database yet
            </p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Reviews on product pages and the homepage currently come from{" "}
              <code className="bg-amber-100 px-1">reviews.json</code> ({importStats.jsonReviewCount} across{" "}
              {importStats.productSlugs} products) plus {importStats.homepageReviewCount} homepage testimonials.
              Import them once to manage, replace, and approve everything from here.
            </p>
            {importMsg && <p className="text-xs font-medium text-emerald-800 mt-2">{importMsg}</p>}
          </div>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="shrink-0 inline-flex items-center gap-2 bg-amber-700 text-white text-sm font-bold px-4 py-2.5 hover:bg-amber-800 disabled:opacity-60"
          >
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Import site reviews
          </button>
        </div>
      )}

      {importStats.importedCount > 0 && importStats.pendingImport === 0 && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2">
          All {importStats.importedCount} legacy site reviews are in the database. Delete or unpublish old ones
          when you publish fresher customer reviews.
        </p>
      )}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "products" as const, label: "By product", icon: Package, count: productGroups.length },
          { id: "pending" as const, label: "Pending", icon: Star, count: pending.length },
          { id: "general" as const, label: "General service", icon: Users, count: general.length },
          { id: "videos" as const, label: "Videos", icon: Video, count: videos.length },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 border transition-colors ${
              view === id
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {count > 0 && <span className="opacity-70">({count})</span>}
          </button>
        ))}
      </div>

      {reviews.length === 0 && importStats.pendingImport > 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="font-bold text-gray-700">No reviews in the database yet</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Click <strong>Import site reviews</strong> above to load your existing product and homepage reviews
            into admin. New customer submissions will appear under Pending.
          </p>
        </div>
      ) : null}

      {view === "pending" && (
        <section className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200">
              No reviews waiting for approval.
            </p>
          ) : (
            pending.map((r) => <ReviewCard key={r.id} review={r} productOptions={productOptions} />)
          )}
        </section>
      )}

      {view === "general" && (
        <section className="space-y-3">
          {general.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200">
              No general service reviews yet.
            </p>
          ) : (
            general.map((r) => <ReviewCard key={r.id} review={r} productOptions={productOptions} />)
          )}
        </section>
      )}

      {view === "videos" && (
        <section className="space-y-3">
          {videos.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200">
              No video testimonials yet.
            </p>
          ) : (
            videos.map((r) => <ReviewCard key={r.id} review={r} productOptions={productOptions} />)
          )}
        </section>
      )}

      {view === "products" && (
        <section className="space-y-4">
          {productGroups.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-200">
              No product-linked reviews yet. Import site reviews or approve new submissions with a product link.
            </p>
          ) : (
            productGroups.map((group) => {
              const key = group.slug ?? "__unlinked__";
              const isOpen = expandedSlug === key;
              return (
                <div key={key} className="border border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedSlug(expandedSlug === key ? "" : key)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{group.label}</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">
                        {group.category}
                        {group.slug && (
                          <>
                            {" "}
                            ·{" "}
                            <a
                              href={`/products/${group.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-700 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View product page ↗
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-700">{group.published} published</p>
                      {group.pending > 0 && (
                        <p className="text-[10px] font-bold text-amber-600">{group.pending} pending</p>
                      )}
                      <p className="text-[10px] text-gray-400">{group.reviews.length} total</p>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 p-3 space-y-3 bg-gray-50/50">
                      {group.reviews.map((r) => (
                        <ReviewCard key={r.id} review={r} productOptions={productOptions} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}
    </div>
  );
}
