import Image from "next/image";
import {
  ANNEKE_REPORT_META,
  BUGS_FIXED,
  COMPLETED_ITEMS,
  DEFERRED_ITEMS,
  DEMO_STEPS,
  EXECUTIVE_SUMMARY,
  MEMBER_FLOWS,
  REQUESTED_VS_DELIVERED,
  SUPABASE_CHECKLIST,
} from "@/content/anneke-report-june-2026";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";
import { V300_MANUAL_IMAGES } from "@/lib/v300-manual-images";
import {
  ManualBody,
  ManualBulletList,
  ManualPage,
  ManualPageHeader,
} from "@/components/manual/ManualPrimitives";

const COVER_PHOTOS = [
  { src: V300_MANUAL_IMAGES.cover, alt: "LAVA V.300 vacuum sealer with fresh produce" },
  { src: V300_MANUAL_IMAGES.bagFold, alt: "Vacuum-sealed steaks and scale" },
  { src: "/images/products/machines/lava-vacuum-sealer-v100-premium.webp", alt: "LAVA V.100 Premium vacuum sealer" },
] as const;

const LOGO_SRC = "/images/manual/v300-premium-x/lava-website-logo.png";

function ReportPageFooter({
  page,
  dark = false,
}: {
  page: number;
  dark?: boolean;
}) {
  return (
    <footer
      className={`absolute bottom-0 left-0 right-0 flex items-center justify-between border-t px-8 py-3 text-[9px] uppercase tracking-widest ${
        dark ? "border-white/15 text-white/50" : "border-border text-copy-muted"
      }`}
    >
      <span>Lava-SA · Website update briefing · {ANNEKE_REPORT_META.version}</span>
      <span>{page}</span>
    </footer>
  );
}

function StatusBadge({ status }: { status: string }) {
  const done = status.toLowerCase().startsWith("done");
  return (
    <span
      className={`inline-block shrink-0 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 ${
        done ? "bg-secondary/30 text-primary" : "bg-surface text-copy-muted border border-border"
      }`}
    >
      {status}
    </span>
  );
}

export default function AnnekeReportDocument() {
  return (
    <div id="manual-print-root" className="manual-document space-y-8 pb-16 print:space-y-0 print:pb-0">
      {/* ── COVER (HuntEx-inspired) ─────────────────────────────── */}
      <ManualPage dark className="overflow-hidden !bg-[#0c4242]">
        <div className="relative min-h-[297mm] flex flex-col text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c4242] via-[#0a3838] to-[#062828]" />

          <div className="relative z-10 flex flex-1 flex-col">
            {/* Header row */}
            <div className="flex items-start justify-between gap-6 px-8 pt-10">
              <Image
                src={LOGO_SRC}
                alt="la.va"
                width={200}
                height={52}
                unoptimized
                className="h-11 w-auto object-contain brightness-0 invert"
              />
              <div className="text-right shrink-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/80">
                  Visit our online store
                </p>
                <p className="mt-1 text-lg font-black tracking-tight">www.lava-sa.com</p>
              </div>
            </div>

            {/* Headline */}
            <div className="px-8 mt-8 max-w-[90%]">
              <p className="text-base leading-snug text-white/90">
                <strong className="text-white font-black">Website update</strong> briefing — manuals, member accounts,
                admin Leads, and product page improvements for Lava-SA.com.
              </p>
            </div>

            {/* Photo strip — diagonal HuntEx-style */}
            <div className="relative mt-10 mx-0 overflow-hidden">
              <div
                className="flex h-[155px] -skew-y-2 origin-center scale-[1.04]"
                style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
              >
                {COVER_PHOTOS.map((photo) => (
                  <div key={photo.src} className="relative flex-1 min-w-0">
                    <Image src={photo.src} alt={photo.alt} fill unoptimized className="object-cover" sizes="33vw" />
                  </div>
                ))}
              </div>
              {/* Warranty seal accent */}
              <div
                className="absolute -top-2 right-6 z-20 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-[#4a9fd4] bg-secondary text-center shadow-lg"
                aria-hidden
              >
                <div>
                  <p className="text-[8px] font-black uppercase leading-tight text-primary">2 years</p>
                  <p className="text-[7px] font-bold uppercase text-primary/80">warranty</p>
                </div>
              </div>
            </div>

            {/* Yellow band */}
            <div
              className="relative z-10 -mt-2 -skew-y-2 bg-secondary py-5 px-8 shadow-md"
              style={{ clipPath: "polygon(0 0, 100% 12%, 100% 100%, 0 88%)" }}
            >
              <div className="skew-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Briefing</p>
                  <p className="text-xl font-black text-primary leading-tight">
                    Meeting with Anneke · {ANNEKE_REPORT_META.meetingDate}
                  </p>
                  <p className="text-sm font-bold text-primary/90 mt-0.5">{ANNEKE_REPORT_META.meetingTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary/70">Prepared for</p>
                  <p className="text-lg font-black text-primary">Lava-SA team</p>
                </div>
              </div>
            </div>

            {/* Document title block */}
            <div className="px-8 mt-10">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-secondary">Internal report</p>
              <h1 className="mt-2 font-heading text-3xl font-black leading-tight">{ANNEKE_REPORT_META.title}</h1>
              <p className="mt-2 text-sm text-white/75">{ANNEKE_REPORT_META.subtitle}</p>
            </div>

            {/* Contact footer */}
            <div className="mt-auto px-8 pt-10 pb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-3">Contact us</p>
              <div className="space-y-1 text-sm text-white/85">
                <p>
                  <span className="font-black text-secondary">T:</span> {ANNEKE_PHONE.display} | {MAIN_PHONE.display}
                </p>
                <p>
                  <span className="font-black text-secondary">E:</span> info@lava-sa.com
                </p>
                <p>
                  <span className="font-black text-secondary">A:</span> 5 Stirling Road, Bryanston, Johannesburg
                </p>
              </div>
            </div>
          </div>

          <ReportPageFooter page={1} dark />
        </div>
      </ManualPage>

      {/* ── EXECUTIVE SUMMARY ───────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader
          section="Overview"
          title="Executive summary"
          subtitle="Work completed ahead of the 17 June briefing. Most items are on live lava-sa.com after deployment from GitHub."
        />
        <ManualBody>
          <ManualBulletList items={[...EXECUTIVE_SUMMARY]} />
          <p className="text-xs text-copy-muted border-t border-border pt-4 mt-4">
            Deploy: push <strong>main</strong> via GitHub Desktop → Vercel builds in ~2 minutes. Hard refresh or clear
            cache if changes do not appear immediately.
          </p>
        </ManualBody>
        <ReportPageFooter page={2} />
      </ManualPage>

      {/* ── COMPLETED ───────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="Delivered" title="What you can demo today" />
        <ManualBody className="!space-y-0">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="border-b-2 border-primary text-left">
                <th className="py-2 pr-3 font-black text-primary w-[28%]">Feature</th>
                <th className="py-2 pr-3 font-black text-primary w-[32%]">Where</th>
                <th className="py-2 font-black text-primary">Notes</th>
              </tr>
            </thead>
            <tbody>
              {COMPLETED_ITEMS.map((row) => (
                <tr key={row.feature} className="border-b border-border/70 align-top">
                  <td className="py-2.5 pr-3 font-bold text-primary">{row.feature}</td>
                  <td className="py-2.5 pr-3 text-copy-muted">{row.where}</td>
                  <td className="py-2.5">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ManualBody>
        <ReportPageFooter page={3} />
      </ManualPage>

      {/* ── MEMBER FLOWS ────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader
          section="Accounts"
          title="Member accounts — how it works"
          subtitle="Member logins live in Supabase Authentication. Customers with orders live in Admin → Customers (WooCommerce import)."
        />
        <ManualBody className="!space-y-0">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="border-b-2 border-primary text-left">
                <th className="py-2 pr-3 font-black text-primary">Audience</th>
                <th className="py-2 pr-3 font-black text-primary">Action</th>
                <th className="py-2 font-black text-primary">Data</th>
              </tr>
            </thead>
            <tbody>
              {MEMBER_FLOWS.map((row) => (
                <tr key={row.audience} className="border-b border-border/70 align-top">
                  <td className="py-2.5 pr-3 font-bold">{row.audience}</td>
                  <td className="py-2.5 pr-3">{row.action}</td>
                  <td className="py-2.5 text-copy-muted">{row.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-copy-muted pt-4">
            Activation and reset emails should come from Lava (<strong>send.lava-sa.com</strong>) when Resend and
            Supabase URL settings are correct. Ignore old test emails that pointed to localhost.
          </p>
        </ManualBody>
        <ReportPageFooter page={4} />
      </ManualPage>

      {/* ── BUGS FIXED ──────────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="Stability" title="Bugs fixed this cycle" />
        <ManualBody className="!space-y-0">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b-2 border-primary text-left">
                <th className="py-2 pr-2 font-black text-primary">Issue</th>
                <th className="py-2 pr-2 font-black text-primary">Cause</th>
                <th className="py-2 font-black text-primary">Fix</th>
              </tr>
            </thead>
            <tbody>
              {BUGS_FIXED.map((row) => (
                <tr key={row.issue} className="border-b border-border/70 align-top">
                  <td className="py-2 pr-2 font-bold text-primary">{row.issue}</td>
                  <td className="py-2 pr-2 text-copy-muted">{row.cause}</td>
                  <td className="py-2">{row.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ManualBody>
        <ReportPageFooter page={5} />
      </ManualPage>

      {/* ── REQUESTED VS DELIVERED ──────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="Scope" title="Requested vs delivered" />
        <ManualBody className="space-y-2">
          {REQUESTED_VS_DELIVERED.map((row) => (
            <div
              key={row.request}
              className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-2.5"
            >
              <p className="text-[12px] flex-1 min-w-[200px]">{row.request}</p>
              <StatusBadge status={row.status} />
            </div>
          ))}
        </ManualBody>
        <ReportPageFooter page={6} />
      </ManualPage>

      {/* ── DEFERRED + DEMO ─────────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="Follow-up" title="Not done yet — discuss today" />
        <ManualBody>
          <ManualBulletList items={[...DEFERRED_ITEMS]} />
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-6">15-minute demo script</h3>
          <ol className="space-y-2 mt-3">
            {DEMO_STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 text-[12px]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-white text-[10px] font-black">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </ManualBody>
        <ReportPageFooter page={7} />
      </ManualPage>

      {/* ── SUPABASE CHECKLIST ──────────────────────────────────── */}
      <ManualPage>
        <ManualPageHeader section="Configuration" title="Supabase & Vercel checklist" />
        <ManualBody>
          <ManualBulletList items={[...SUPABASE_CHECKLIST]} />
          <div className="mt-8 border-l-4 border-secondary bg-secondary/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Leads vs customers</p>
            <p className="text-[12px] leading-relaxed">
              A person with orders is a <strong>Customer</strong>, not a Lead. The Leads page now excludes WooCommerce
              buyers. If the same email appears on the mailing list and as a customer, stats may overlap — we can sync
              newsletter opt-in rules after import cleanup.
            </p>
          </div>
          <p className="text-xs text-copy-muted pt-6">
            Document generated for internal use · {ANNEKE_REPORT_META.version} · lava-sa.com
          </p>
        </ManualBody>
        <ReportPageFooter page={8} />
      </ManualPage>
    </div>
  );
}
