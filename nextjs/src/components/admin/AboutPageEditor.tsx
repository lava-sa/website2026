"use client";

import HtmlEditor from "@/components/admin/HtmlEditor";
import CmsImageField from "@/components/admin/CmsImageField";
import type { AboutPageContent, SitePageContent } from "@/lib/content/site-pages-types";
import { DEFAULT_ABOUT_PAGE } from "@/lib/content/about-page-defaults";

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
          className={`${inputCls} min-h-[72px] resize-y`}
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
  content: SitePageContent;
  onChange: (aboutPage: AboutPageContent) => void;
};

export default function AboutPageEditor({ content, onChange }: Props) {
  const about = content.aboutPage ?? DEFAULT_ABOUT_PAGE;

  function patch(partial: Partial<AboutPageContent>) {
    onChange({ ...about, ...partial });
  }

  return (
    <div className="space-y-8">
      <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        All About page sections are editable here — including images. Use paths under{" "}
        <strong>public/images/</strong>. Upload new files via FTP or your host file manager, then paste
        the path below.
      </div>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Hero background image</h2>
        <CmsImageField
          label="Hero"
          value={about.heroImage}
          onChange={(heroImage) => patch({ heroImage })}
        />
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Origin — Landig family</h2>
        <Field label="Overline" value={about.origin.overline} onChange={(overline) => patch({ origin: { ...about.origin, overline } })} />
        <Field label="Heading" value={about.origin.heading} onChange={(heading) => patch({ origin: { ...about.origin, heading } })} />
        <CmsImageField
          label="Section image"
          value={about.origin.image ?? { src: "", alt: "" }}
          showCaptions
          onChange={(image) => patch({ origin: { ...about.origin, image } })}
        />
        <Field label="Quote" value={about.origin.quote.text} onChange={(text) => patch({ origin: { ...about.origin, quote: { ...about.origin.quote, text } } })} multiline />
        <Field label="Quote attribution" value={about.origin.quote.attribution} onChange={(attribution) => patch({ origin: { ...about.origin, quote: { ...about.origin.quote, attribution } } })} />
        <div>
          <label className={labelCls}>Body</label>
          <HtmlEditor value={about.origin.bodyHtml} onChange={(bodyHtml) => patch({ origin: { ...about.origin, bodyHtml } })} />
        </div>
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Timeline</h2>
        <Field label="Overline" value={about.timeline.overline} onChange={(overline) => patch({ timeline: { ...about.timeline, overline } })} />
        <Field label="Heading" value={about.timeline.heading} onChange={(heading) => patch({ timeline: { ...about.timeline, heading } })} />
        {about.timeline.items.map((item, i) => (
          <div key={i} className="border border-border p-4 space-y-2 bg-surface">
            <p className="text-xs font-bold text-copy-muted">Milestone {i + 1}</p>
            <Field label="Year" value={item.year} onChange={(year) => {
              const items = [...about.timeline.items];
              items[i] = { ...items[i], year };
              patch({ timeline: { ...about.timeline, items } });
            }} />
            <Field label="Event" value={item.event} onChange={(event) => {
              const items = [...about.timeline.items];
              items[i] = { ...items[i], event };
              patch({ timeline: { ...about.timeline, items } });
            }} multiline />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!item.highlight}
                onChange={(e) => {
                  const items = [...about.timeline.items];
                  items[i] = { ...items[i], highlight: e.target.checked };
                  patch({ timeline: { ...about.timeline, items } });
                }}
              />
              Highlight (Lava-SA founded style)
            </label>
            {item.highlight && (
              <Field label="Highlight label" value={item.highlightLabel ?? ""} onChange={(highlightLabel) => {
                const items = [...about.timeline.items];
                items[i] = { ...items[i], highlightLabel };
                patch({ timeline: { ...about.timeline, items } });
              }} />
            )}
          </div>
        ))}
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">South Africa — Wilco &amp; Anneke</h2>
        <Field label="Overline" value={about.saFounders.overline} onChange={(overline) => patch({ saFounders: { ...about.saFounders, overline } })} />
        <Field label="Heading" value={about.saFounders.heading} onChange={(heading) => patch({ saFounders: { ...about.saFounders, heading } })} />
        <CmsImageField
          label="Section image (use a different photo from the Landig family section)"
          value={about.saFounders.image ?? { src: "", alt: "" }}
          showCaptions
          onChange={(image) => patch({ saFounders: { ...about.saFounders, image } })}
        />
        <div>
          <label className={labelCls}>Body</label>
          <HtmlEditor value={about.saFounders.bodyHtml} onChange={(bodyHtml) => patch({ saFounders: { ...about.saFounders, bodyHtml } })} />
        </div>
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Four pillars</h2>
        <Field label="Overline" value={about.pillars.overline} onChange={(overline) => patch({ pillars: { ...about.pillars, overline } })} />
        <Field label="Heading" value={about.pillars.heading} onChange={(heading) => patch({ pillars: { ...about.pillars, heading } })} />
        <Field label="Subtitle" value={about.pillars.subtitle} onChange={(subtitle) => patch({ pillars: { ...about.pillars, subtitle } })} multiline />
        {about.pillars.items.map((pillar, i) => (
          <div key={pillar.title} className="border border-border p-4 space-y-2 bg-surface">
            <p className="text-xs font-bold text-copy-muted">Pillar {i + 1}</p>
            <Field label="Title" value={pillar.title} onChange={(title) => {
              const items = [...about.pillars.items];
              items[i] = { ...items[i], title };
              patch({ pillars: { ...about.pillars, items } });
            }} />
            <Field label="Body" value={pillar.body} onChange={(body) => {
              const items = [...about.pillars.items];
              items[i] = { ...items[i], body };
              patch({ pillars: { ...about.pillars, items } });
            }} multiline />
          </div>
        ))}
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Quality / machine section</h2>
        <Field label="Overline" value={about.quality.overline} onChange={(overline) => patch({ quality: { ...about.quality, overline } })} />
        <Field label="Heading" value={about.quality.heading} onChange={(heading) => patch({ quality: { ...about.quality, heading } })} />
        <CmsImageField
          label="Machine image (use a current model, e.g. V.300 Premium X)"
          value={about.quality.image ?? { src: "", alt: "" }}
          onChange={(image) => patch({ quality: { ...about.quality, image } })}
        />
        <div>
          <label className={labelCls}>Body</label>
          <HtmlEditor value={about.quality.bodyHtml} onChange={(bodyHtml) => patch({ quality: { ...about.quality, bodyHtml } })} />
        </div>
        <Field
          label="Feature chips (one per line)"
          value={about.quality.features.join("\n")}
          onChange={(raw) => patch({ quality: { ...about.quality, features: raw.split("\n").map((s) => s.trim()).filter(Boolean) } })}
          multiline
        />
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Sustainability</h2>
        <Field label="Overline" value={about.sustainability.overline} onChange={(overline) => patch({ sustainability: { ...about.sustainability, overline } })} />
        <Field label="Heading" value={about.sustainability.heading} onChange={(heading) => patch({ sustainability: { ...about.sustainability, heading } })} />
        <CmsImageField
          label="Section image"
          value={about.sustainability.image ?? { src: "", alt: "" }}
          onChange={(image) => patch({ sustainability: { ...about.sustainability, image } })}
        />
        <div>
          <label className={labelCls}>Body</label>
          <HtmlEditor value={about.sustainability.bodyHtml} onChange={(bodyHtml) => patch({ sustainability: { ...about.sustainability, bodyHtml } })} />
        </div>
        {about.sustainability.impactStats.map((stat, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Field label={`Stat ${i + 1} value`} value={stat.value} onChange={(value) => {
              const impactStats = [...about.sustainability.impactStats];
              impactStats[i] = { ...impactStats[i], value };
              patch({ sustainability: { ...about.sustainability, impactStats } });
            }} />
            <Field label={`Stat ${i + 1} label`} value={stat.label} onChange={(label) => {
              const impactStats = [...about.sustainability.impactStats];
              impactStats[i] = { ...impactStats[i], label };
              patch({ sustainability: { ...about.sustainability, impactStats } });
            }} />
          </div>
        ))}
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Service &amp; contact intro</h2>
        <Field label="Overline" value={about.service.overline} onChange={(overline) => patch({ service: { ...about.service, overline } })} />
        <Field label="Heading" value={about.service.heading} onChange={(heading) => patch({ service: { ...about.service, heading } })} />
        <Field label="Subtitle" value={about.service.subtitle} onChange={(subtitle) => patch({ service: { ...about.service, subtitle } })} multiline />
      </section>

      <section className="border border-border bg-white p-6 space-y-4">
        <h2 className="text-lg font-black text-primary">Final call-to-action</h2>
        <Field label="Overline" value={about.finalCta.overline} onChange={(overline) => patch({ finalCta: { ...about.finalCta, overline } })} />
        <Field label="Heading (HTML allowed, e.g. &lt;br /&gt;)" value={about.finalCta.headingHtml} onChange={(headingHtml) => patch({ finalCta: { ...about.finalCta, headingHtml } })} multiline />
        <Field label="Subtitle" value={about.finalCta.subtitle} onChange={(subtitle) => patch({ finalCta: { ...about.finalCta, subtitle } })} multiline />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary button label" value={about.finalCta.primaryLabel} onChange={(primaryLabel) => patch({ finalCta: { ...about.finalCta, primaryLabel } })} />
          <Field label="Primary button link" value={about.finalCta.primaryHref} onChange={(primaryHref) => patch({ finalCta: { ...about.finalCta, primaryHref } })} />
          <Field label="Secondary button label" value={about.finalCta.secondaryLabel} onChange={(secondaryLabel) => patch({ finalCta: { ...about.finalCta, secondaryLabel } })} />
          <Field label="Secondary button link" value={about.finalCta.secondaryHref} onChange={(secondaryHref) => patch({ finalCta: { ...about.finalCta, secondaryHref } })} />
        </div>
      </section>
    </div>
  );
}
