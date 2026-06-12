export const dynamic = "force-dynamic";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { SITE_PAGE_GROUPS, SITE_PAGE_REGISTRY } from "@/lib/content/site-page-registry";

export default function AdminPagesListPage() {
  return (
    <AdminShell>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-primary">Pages</h1>
          <p className="mt-2 text-sm text-copy-muted">
            Edit homepage, about, contact, blog, help, legal and guide copy. Layout and images stay
            fixed — update headings, SEO and HTML content here.
          </p>
        </div>

        <div className="space-y-10">
          {SITE_PAGE_GROUPS.map((group) => {
            const pages = SITE_PAGE_REGISTRY.filter((p) => p.group === group);
            if (!pages.length) return null;

            return (
              <section key={group}>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-copy-muted mb-3">
                  {group}
                </h2>
                <div className="space-y-2">
                  {pages.map((page) => (
                    <div
                      key={page.slug}
                      className="flex items-center justify-between border border-border bg-white px-5 py-4"
                    >
                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-primary truncate">{page.title}</p>
                        <p className="text-xs text-copy-muted mt-0.5">{page.path}</p>
                      </div>
                      <Link
                        href={`/admin/pages/${page.slug}/edit`}
                        className="shrink-0 text-xs font-bold uppercase tracking-wider bg-primary text-white px-4 py-2.5 hover:bg-primary/90"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
