import { getSitePageContent } from "@/lib/queries/site-pages";
import CmsBody from "@/components/cms/CmsBody";

/** Optional CMS body HTML appended to static pages (slug matches site-page-registry). */
export default async function CmsPageExtras({ slug }: { slug: string }) {
  const cms = await getSitePageContent(slug);
  if (!cms.bodyHtml?.trim()) return null;

  return (
    <section className="section-container py-16 border-t border-border">
      <CmsBody html={cms.bodyHtml} />
    </section>
  );
}
