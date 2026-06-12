import { blogPosts, type BlogPost } from "@/lib/blog-posts";
import { getSitePageContent } from "@/lib/queries/site-pages";

/** Blog index + cards with CMS overrides for title, excerpt, category. */
export async function getMergedBlogPosts(): Promise<BlogPost[]> {
  const merged = await Promise.all(
    blogPosts.map(async (post) => {
      const cms = await getSitePageContent(`blog-${post.slug}`);
      return {
        ...post,
        title: cms.seo.title || post.title,
        excerpt: cms.excerpt || cms.hero.subtitle || post.excerpt,
        category: cms.category || post.category,
      };
    })
  );
  return merged;
}

export async function getBlogPostMetadata(slug: string) {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;

  const cms = await getSitePageContent(`blog-${slug}`);
  return {
    title: cms.seo.title || post.title,
    description: cms.seo.description || post.excerpt,
  };
}
