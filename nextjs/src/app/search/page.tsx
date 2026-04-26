"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Package, BookOpen, ArrowRight, X } from "lucide-react";
import ProductCatalogImage from "@/components/shop/ProductCatalogImage";
import { getSupabase } from "@/lib/supabase";
import { blogPosts } from "@/lib/blog-posts";
import type { BlogPost } from "@/lib/blog-posts";

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  regular_price: number;
  short_description: string | null;
  primary_image_url: string | null;
  categories: { name: string } | null;
}

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 }).format(n);
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [input, setInput] = useState(initialQ);
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setArticles([]);
      return;
    }

    const q = query.trim().toLowerCase();
    setLoading(true);

    // ── Blog search (client-side, instant) ──────────────────────────────────
    const matchedArticles = blogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
    setArticles(matchedArticles);

    // ── Product search (Supabase) ────────────────────────────────────────────
    const supabase = getSupabase();
    supabase
      .from("products")
      .select("id, name, slug, regular_price, short_description, primary_image_url, categories(name)")
      .eq("is_published", true)
      .or(`name.ilike.%${q}%,short_description.ilike.%${q}%,sku.ilike.%${q}%`)
      .order("sort_order", { ascending: true })
      .limit(12)
      .then(({ data }) => {
        setProducts((data as ProductResult[]) ?? []);
        setLoading(false);
      });
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setQuery(q);
    router.replace(`/search?q=${encodeURIComponent(q)}`);
  }

  const totalResults = products.length + articles.length;

  return (
    <main className="min-h-screen bg-surface">

      {/* ── Search Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-primary py-12">
        <div className="section-container max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">Search</p>
          <h1 className="text-3xl font-black text-white mb-6">Find what you&apos;re looking for</h1>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products, articles, guides…"
              autoFocus
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50
                         pl-14 pr-14 py-4 text-base focus:outline-none focus:border-secondary transition-colors"
            />
            {input && (
              <button type="button" onClick={() => { setInput(""); setQuery(""); }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
            <button type="submit"
              className="absolute right-0 top-0 h-full px-5 bg-secondary text-white font-bold text-sm hover:bg-secondary/90 transition-colors">
              Go
            </button>
          </form>
        </div>
      </div>

      <div className="section-container max-w-6xl py-12">

        {/* ── No query ────────────────────────────────────────────────────── */}
        {!query && (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-border mx-auto mb-4" />
            <p className="text-copy-muted text-lg">Type something above to search products and articles.</p>
          </div>
        )}

        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {loading && query && (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-copy-muted mt-4">Searching…</p>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────────── */}
        {!loading && query && (
          <>
            <p className="text-sm text-copy-muted mb-8">
              <span className="font-bold text-primary">{totalResults}</span> result{totalResults !== 1 ? "s" : ""} for &ldquo;<span className="font-bold text-primary">{query}</span>&rdquo;
            </p>

            {totalResults === 0 && (
              <div className="text-center py-20">
                <p className="text-xl font-bold text-primary mb-2">No results found</p>
                <p className="text-copy-muted mb-8">Try a different search term, or browse our categories below.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Vacuum Machines", "Vacuum Bags", "Containers", "Butchery", "Spare Parts"].map((cat) => (
                    <Link key={cat} href={`/products/${cat.toLowerCase().replace(/ /g, "-")}`}
                      className="px-4 py-2 border border-border text-sm font-bold text-primary hover:border-primary hover:bg-primary hover:text-white transition-colors">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {products.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-black text-primary">Products</h2>
                  <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-0.5">{products.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`}
                      className="group bg-white hover:shadow-md transition-all duration-200 overflow-hidden">
                      {p.primary_image_url && (
                        <ProductCatalogImage
                          src={p.primary_image_url}
                          alt={p.name}
                          title={p.name}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-copy-muted mb-1">
                          {(p.categories as { name: string } | null)?.name ?? "Product"}
                        </p>
                        <h3 className="font-bold text-primary text-sm leading-snug mb-2 group-hover:text-secondary transition-colors">
                          {p.name}
                        </h3>
                        <p className="font-black text-primary">{formatZAR(p.regular_price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Articles */}
            {articles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-black text-primary">Articles & Guides</h2>
                  <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-0.5">{articles.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((a) => (
                    <Link key={a.slug} href={`/blog/${a.slug}`}
                      className="group bg-white p-5 hover:shadow-md transition-all duration-200 flex gap-4">
                      {a.image && (
                        <div className="shrink-0 w-20 h-20 overflow-hidden bg-primary/10 relative">
                          <Image src={a.image} alt={a.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">{a.category}</p>
                        <h3 className="font-bold text-primary text-sm leading-snug mb-1 group-hover:text-secondary transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <p className="text-xs text-copy-muted line-clamp-2">{a.excerpt}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-copy-muted shrink-0 mt-1 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
