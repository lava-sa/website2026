import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-posts";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Lava Blog — Vacuum Sealing Guides, Tips & South African Food Stories",
  description:
    "Expert guides on vacuum sealing game meat, biltong, fish and everyday food. Tips for South African kitchens, hunters and fishermen.",
};

const categories = ["All", "Our Story", "Food Guide", "Hunting & Game", "South African Food", "Fishing", "Cooking", "Buying Guide", "South African Living", "Quality", "Sustainability"];

function PostCard({ post, featured = false }: { post: typeof blogPosts[0]; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block bg-white border border-border hover:shadow-lg transition-all duration-200 ${featured ? "lg:flex" : ""}`}
    >
      {/* Image */}
      <div className={`relative bg-primary/10 overflow-hidden ${featured ? "lg:w-2/5 aspect-video lg:aspect-auto" : "aspect-video"}`}>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-white/20 text-7xl font-black select-none">L</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 flex flex-col ${featured ? "lg:w-3/5 lg:p-8" : ""}`}>
        <div className="flex items-center gap-3 text-[11px] text-copy-muted font-medium mb-3">
          <span>{new Date(post.date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
        </div>
        <h2 className={`font-bold text-primary leading-snug mb-3 group-hover:text-secondary transition-colors ${featured ? "text-2xl" : "text-base"}`}>
          {post.title}
        </h2>
        <p className="text-sm text-copy-muted leading-relaxed flex-1">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-secondary">
          Read Article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const featured = blogPosts.filter((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <main className="py-16">
      <div className="section-container">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="overline mb-3">Knowledge Hub</p>
          <h1 className="text-5xl font-black text-primary">Lava Blog</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Guides for South African hunters, fishermen, home cooks and butchers — written
            by people who actually use vacuum sealers every day.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 border transition-colors ${
                cat === "All"
                  ? "bg-primary text-white border-primary"
                  : "border-border text-copy-muted hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured posts */}
        <section className="mb-14 space-y-6">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} featured />
          ))}
        </section>

        {/* All other posts */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-copy-muted mb-6 pb-3 border-b border-border">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Vacuum Packaging guides CTA */}
        <div className="mt-20 bg-primary text-white p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Deep Dives</p>
            <h2 className="text-2xl font-bold mb-3">Vacuum Packaging Guides</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              From shelf life charts to dry aging technique — detailed guides for getting
              the most out of your LAVA system.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Advantages of Vacuum Packaging", "/vacuum-packaging/advantages"],
              ["Shelf Life Chart", "/vacuum-packaging/shelf-life-chart"],
              ["Dry Aging Guide", "/vacuum-packaging/dry-aging"],
              ["Expert Tips", "/vacuum-packaging/expert-tips"],
              ["Our Vacuum Bags", "/vacuum-packaging/bags-guide"],
              ["Gift Ideas", "/vacuum-packaging/gift-ideas"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5 text-secondary shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
