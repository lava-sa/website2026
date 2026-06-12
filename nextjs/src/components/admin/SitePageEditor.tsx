"use client";

import { useState } from "react";
import { Loader2, Save, ExternalLink } from "lucide-react";
import HtmlEditor from "@/components/admin/HtmlEditor";
import type { SitePageContent, SitePageRegistryEntry } from "@/lib/content/site-pages-types";

const inputCls =
  "w-full border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary";
const labelCls = "block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide";

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {multiline ? (
        <textarea
          className={`${inputCls} min-h-[88px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

type Props = {
  slug: string;
  entry: SitePageRegistryEntry;
  initialContent: SitePageContent;
};

export default function SitePageEditor({ slug, entry, initialContent }: Props) {
  const [content, setContent] = useState<SitePageContent>(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const fields = new Set(entry.fields);

  function patch<K extends keyof SitePageContent>(key: K, value: SitePageContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const res = await fetch(`/api/admin/site-pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Save failed");
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3">
        <p className="text-sm text-copy-muted">
          Layout and images stay in code — edit text, SEO and HTML content here.
        </p>
        <a
          href={entry.path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary"
        >
          View live <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {fields.has("seo") && (
        <section className="border border-border bg-white p-6 space-y-4">
          <h2 className="text-lg font-black text-primary">SEO</h2>
          <Field
            label="Page title (meta title)"
            value={content.seo.title}
            onChange={(title) => patch("seo", { ...content.seo, title })}
          />
          <Field
            label="Meta description"
            value={content.seo.description}
            onChange={(description) => patch("seo", { ...content.seo, description })}
            multiline
          />
        </section>
      )}

      {fields.has("hero") && (
        <section className="border border-border bg-white p-6 space-y-4">
          <h2 className="text-lg font-black text-primary">Hero / page header</h2>
          <Field
            label="Overline (small label above heading)"
            value={content.hero.overline ?? ""}
            onChange={(overline) => patch("hero", { ...content.hero, overline })}
          />
          <Field
            label="Main heading"
            value={content.hero.heading ?? ""}
            onChange={(heading) => patch("hero", { ...content.hero, heading })}
          />
          <Field
            label="Heading emphasis (accent line — optional)"
            value={content.hero.headingEmphasis ?? ""}
            onChange={(headingEmphasis) => patch("hero", { ...content.hero, headingEmphasis })}
          />
          <Field
            label="Subtitle"
            value={content.hero.subtitle ?? ""}
            onChange={(subtitle) => patch("hero", { ...content.hero, subtitle })}
            multiline
          />
        </section>
      )}

      {fields.has("excerpt") && (
        <section className="border border-border bg-white p-6 space-y-4">
          <h2 className="text-lg font-black text-primary">Blog card excerpt</h2>
          <Field
            label="Excerpt"
            value={content.excerpt ?? ""}
            onChange={(excerpt) => patch("excerpt", excerpt)}
            multiline
          />
          <Field
            label="Category label"
            value={content.category ?? ""}
            onChange={(category) => patch("category", category)}
          />
        </section>
      )}

      {fields.has("ctas") && (
        <section className="border border-border bg-white p-6 space-y-4">
          <h2 className="text-lg font-black text-primary">Call-to-action buttons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Primary button label"
              value={content.ctas?.primaryLabel ?? ""}
              onChange={(primaryLabel) =>
                patch("ctas", { ...content.ctas, primaryLabel })
              }
            />
            <Field
              label="Primary button link"
              value={content.ctas?.primaryHref ?? ""}
              onChange={(primaryHref) =>
                patch("ctas", { ...content.ctas, primaryHref })
              }
            />
            <Field
              label="Secondary button label"
              value={content.ctas?.secondaryLabel ?? ""}
              onChange={(secondaryLabel) =>
                patch("ctas", { ...content.ctas, secondaryLabel })
              }
            />
            <Field
              label="Secondary button link"
              value={content.ctas?.secondaryHref ?? ""}
              onChange={(secondaryHref) =>
                patch("ctas", { ...content.ctas, secondaryHref })
              }
            />
          </div>
        </section>
      )}

      {fields.has("stats") && (
        <section className="border border-border bg-white p-6 space-y-4">
          <h2 className="text-lg font-black text-primary">Stats row</h2>
          {(content.stats ?? []).map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field
                label={`Stat ${i + 1} — value`}
                value={stat.value}
                onChange={(value) => {
                  const stats = [...(content.stats ?? [])];
                  stats[i] = { ...stats[i], value };
                  patch("stats", stats);
                }}
              />
              <Field
                label={`Stat ${i + 1} — label`}
                value={stat.label}
                onChange={(label) => {
                  const stats = [...(content.stats ?? [])];
                  stats[i] = { ...stats[i], label };
                  patch("stats", stats);
                }}
              />
            </div>
          ))}
        </section>
      )}

      {fields.has("trustBadge") && (
        <section className="border border-border bg-white p-6 space-y-4">
          <h2 className="text-lg font-black text-primary">Trust badge (homepage)</h2>
          <Field
            label="Badge title"
            value={content.trustBadge?.title ?? ""}
            onChange={(title) =>
              patch("trustBadge", { ...content.trustBadge, title })
            }
          />
          <Field
            label="Badge subtitle"
            value={content.trustBadge?.subtitle ?? ""}
            onChange={(subtitle) =>
              patch("trustBadge", { ...content.trustBadge, subtitle })
            }
          />
        </section>
      )}

      {fields.has("blocks") && (
        <section className="border border-border bg-white p-6 space-y-6">
          <h2 className="text-lg font-black text-primary">Content blocks</h2>
          {(content.blocks ?? []).map((block, i) => (
            <div key={block.id || i} className="border border-border p-4 space-y-3 bg-surface">
              <p className="text-xs font-bold text-copy-muted uppercase">Block {i + 1}</p>
              <Field
                label="Overline"
                value={block.overline ?? ""}
                onChange={(overline) => {
                  const blocks = [...(content.blocks ?? [])];
                  blocks[i] = { ...blocks[i], overline };
                  patch("blocks", blocks);
                }}
              />
              <Field
                label="Heading"
                value={block.heading}
                onChange={(heading) => {
                  const blocks = [...(content.blocks ?? [])];
                  blocks[i] = { ...blocks[i], heading };
                  patch("blocks", blocks);
                }}
              />
              <div>
                <label className={labelCls}>Body HTML</label>
                <HtmlEditor
                  value={block.bodyHtml}
                  onChange={(bodyHtml) => {
                    const blocks = [...(content.blocks ?? [])];
                    blocks[i] = { ...blocks[i], bodyHtml };
                    patch("blocks", blocks);
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {fields.has("bodyHtml") && (
        <section className="border border-border bg-white p-6 space-y-3">
          <h2 className="text-lg font-black text-primary">Page body HTML</h2>
          <p className="text-xs text-copy-muted">
            Optional full-page HTML. When set on wired pages, this can replace or append to the
            built-in layout. Use headings, paragraphs and lists.
          </p>
          <HtmlEditor
            value={content.bodyHtml ?? ""}
            onChange={(bodyHtml) => patch("bodyHtml", bodyHtml)}
          />
        </section>
      )}

      {status === "error" && error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "saving" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : status === "saved" ? (
          <>Saved</>
        ) : (
          <>
            <Save className="h-4 w-4" /> Save page
          </>
        )}
      </button>
    </form>
  );
}
