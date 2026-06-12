import type { Metadata } from "next";
import { getBlogPostMetadata } from "@/lib/blog-cms";

export function createBlogMetadata(slug: string) {
  return async function generateMetadata(): Promise<Metadata> {
    const meta = await getBlogPostMetadata(slug);
    return meta ? { title: meta.title, description: meta.description } : {};
  };
}
