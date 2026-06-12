import { getSitePageContent } from "@/lib/queries/site-pages";
import CmsBody from "@/components/cms/CmsBody";

/** Optional CMS body HTML appended to a blog article. */
export default async function BlogCmsExtras({ slug }: { slug: string }) {
  const cms = await getSitePageContent(`blog-${slug}`);
  if (!cms.bodyHtml?.trim()) return null;

  return (
    <section className="section-container py-12 border-t border-border mt-12">
      <CmsBody html={cms.bodyHtml} />
    </section>
  );
}
