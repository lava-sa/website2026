export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SitePageEditor from "@/components/admin/SitePageEditor";
import { getRegistryEntry, isValidSitePageSlug } from "@/lib/content/site-page-registry";
import { getSitePageContent } from "@/lib/queries/site-pages";

export default async function EditSitePagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isValidSitePageSlug(slug)) notFound();

  const entry = getRegistryEntry(slug)!;
  const content = await getSitePageContent(slug);

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <div className="mb-6">
          <Link
            href="/admin/pages"
            className="text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary"
          >
            ← All pages
          </Link>
          <h1 className="mt-3 text-2xl font-black text-primary">Edit {entry.title}</h1>
          <p className="mt-1 text-sm text-copy-muted">
            Public URL:{" "}
            <a
              href={entry.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline"
            >
              {entry.path}
            </a>
          </p>
        </div>

        <SitePageEditor slug={slug} entry={entry} initialContent={content} />
      </div>
    </AdminShell>
  );
}
