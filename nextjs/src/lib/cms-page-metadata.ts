import type { Metadata } from "next";
import { getSitePageContent } from "@/lib/queries/site-pages";

/** SEO metadata from site_pages CMS for any registered slug. */
export async function cmsPageMetadata(
  slug: string,
  canonical: string,
  options?: { titleAbsolute?: boolean }
): Promise<Metadata> {
  const cms = await getSitePageContent(slug);
  return {
    title: options?.titleAbsolute
      ? { absolute: cms.seo.title }
      : cms.seo.title,
    description: cms.seo.description,
    alternates: { canonical },
  };
}
