import Image from "next/image";
import {
  ANNEKE_EMAIL_REQUESTS,
  ANNEKE_REPORT_META,
  FIRST_MEETING_FOLLOWUPS,
  LAUNCH_MAILING,
  LAUNCH_PLAN,
  LAUNCH_READINESS,
  MIGHT_HAVE_MISSED,
  STOREVAC_DOMAIN,
  SUMMARY_COUNTS,
  TRANSCRIPT_ONLY_REQUESTS,
  WEBSITE_EXPERIENCE_DELIVERED,
  type RequestStatus,
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

function ReportPageFooter({ page }: { page: number }) {
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border px-8 py-3 text-[9px] uppercase tracking-widest text-copy-muted"
    >
      <span>Lava-SA · Launch briefing · {ANNEKE_REPORT_META.version}</span>
      <span>{page}</span>
    </footer>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    Done: "bg-secondary/35 text-primary",
    Partial: "bg-amber-100 text-amber-900",
    "Not yet": "bg-surface text-copy-muted border border-border",
    "Waiting on Anneke": "bg-primary/10 text-primary",
  };
  return (
    <span
      className={`inline-block shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function RequestTable({ rows }: { rows: typeof ANNEKE_EMAIL_REQUESTS }) {
  return (
    <table className="w-full text-[11px] border-collapse">
      <thead>
        <tr className="border-b-2 border-primary text-left">
          <th className="py-2 pr-2 font-black text-primary w-[16%]">Area</th>
          <th className="py-2 pr-2 font-black text-primary w-[30%]">Request</th>
          <th className="py-2 pr-2 font-black text-primary w-[11%]">Status</th>
          <th className="py-2 font-black text-primary">Notes</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`${row.area}-${i}`} className="border-b border-border/70 align-top">
            <td className="py-2 pr-2 font-bold text-primary">{row.area}</td>
            <td className="py-2 pr-2">{row.request}</td>
            <td className="py-2 pr-2">
              <StatusBadge status={row.status} />
            </td>
            <td className="py-2 text-copy-muted">{row.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AnnekeReportDocument() {
  const emailRowsPage1 = ANNEKE_EMAIL_REQUESTS.slice(0, 11);
  const emailRowsPage2 = ANNEKE_EMAIL_REQUESTS.slice(11);

  return (
    <div id="manual-print-root" className="manual-document space-y-8 pb-16 print:space-y-0 print:pb-0">
      {/* COVER */}
      <ManualPage dark className="overflow-hidden !bg-[#0c4242]">
        <div className="relative min-h-[297mm] flex flex-col text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c4242] via-[#0a3838] to-[#062828]" />
          <div className="relative z-10 flex flex-1 flex-col">
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
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/80">Visit our online store</p>
                <p className="mt-1 text-lg font-black tracking-tight">www.lava-sa.com</p>
              </div>
            </div>

            <div className="px-8 mt-8 max-w-[92%]">
              <p className="text-base leading-snug text-white/90">
                <strong className="text-white font-black">Launch briefing</strong> — catalogue requests, meeting
                follow-ups, and plan for <strong className="text-secondary">Monday 22 June 2026</strong>.
              </p>
            </div>

            <div className="relative mt-10 mx-0 overflow-hidden">
              <div
                className="flex h-[140px] -skew-y-2 origin-center scale-[1.04]"
                style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
              >
                {COVER_PHOTOS.map((photo) => (
                  <div key={photo.src} className="relative flex-1 min-w-0">
                    <Image src={photo.src} alt={photo.alt} fill unoptimized className="object-cover" sizes="33vw" />
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative z-10 -mt-2 -skew-y-2 bg-secondary py-5 px-8 shadow-md"
              style={{ clipPath: "polygon(0 0, 100% 12%, 100% 100%, 0 88%)" }}
            >
              <div className="skew-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Target go-live</p>
                  <p className="text-xl font-black text-primary leading-tight">{LAUNCH_PLAN.date}</p>
                  <p className="text-sm font-bold text-primary/90 mt-0.5">{LAUNCH_PLAN.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary/70">Briefing</p>
                  <p className="text-lg font-black text-primary">Anneke · Ignatius</p>
                </div>
              </div>
            </div>

            <div className="px-8 mt-8">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-secondary">Final edition</p>
              <h1 className="mt-2 font-heading text-3xl font-black leading-tight">{ANNEKE_REPORT_META.title}</h1>
              <p className="mt-2 text-sm text-white/75">{ANNEKE_REPORT_META.subtitle}</p>
            </div>

            <div className="mt-6 px-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { n: SUMMARY_COUNTS.done, label: "Done" },
                { n: SUMMARY_COUNTS.partial, label: "Partial" },
                { n: SUMMARY_COUNTS.notYet, label: "Not yet" },
                { n: SUMMARY_COUNTS.waiting, label: "Waiting" },
              ].map((s) => (
                <div key={s.label} className="border border-white/20 py-3 px-2">
                  <p className="text-2xl font-black text-secondary">{s.n}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto px-8 pt-8 pb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-3">Contact us</p>
              <div className="space-y-1 text-sm text-white/85">
                <p>
                  <span className="font-black text-secondary">T:</span> {ANNEKE_PHONE.display} | {MAIN_PHONE.display}
                </p>
                <p>
                  <span className="font-black text-secondary">E:</span> info@lava-sa.com · anneke@lava-sa.co.za
                </p>
                <p>
                  <span className="font-black text-secondary">A:</span> 5 Stirling Road, Bryanston, Johannesburg
                </p>
              </div>
            </div>
          </div>
          <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/15 px-8 py-3 text-[9px] uppercase tracking-widest text-white/50">
            <span>Lava-SA · Launch briefing · {ANNEKE_REPORT_META.version}</span>
            <span>1</span>
          </footer>
        </div>
      </ManualPage>

      {/* OVERVIEW */}
      <ManualPage>
        <ManualPageHeader
          section="Overview"
          title="Where we are"
          subtitle="Anneke’s email plus first-meeting notes. Lava-SA prices are correct — no shop-wide price rework (that was Star Aesthetic)."
        />
        <ManualBody>
          <p>
            Anneke approved the <strong>new look</strong>. This document tracks every catalogue and content request,
            what is already live, and the <strong>Monday 22 June</strong> launch checklist.
          </p>
          <div className="border-l-4 border-primary bg-surface px-4 py-3 mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Warranty rule (meeting)</p>
            <p className="text-[12px] leading-relaxed">
              <strong>2-year guarantee</strong> on vacuum <strong>machines</strong> and <strong>applicable scales</strong> —
              not on bags, rolls, butchery accessories, or general consumables.
            </p>
          </div>
          <p className="text-[12px] text-copy-muted mt-4">
            Internal SEO scores: <strong>lava-sa.com/site-info</strong> (not for customer emails).
          </p>
        </ManualBody>
        <ReportPageFooter page={2} />
      </ManualPage>

      {/* EMAIL 1 */}
      <ManualPage>
        <ManualPageHeader section="Anneke’s email" title="Catalogue requests (1 of 2)" />
        <ManualBody className="!space-y-0 !pt-4">
          <RequestTable rows={emailRowsPage1} />
        </ManualBody>
        <ReportPageFooter page={3} />
      </ManualPage>

      {/* EMAIL 2 */}
      <ManualPage>
        <ManualPageHeader section="Anneke’s email" title="Catalogue requests (2 of 2)" />
        <ManualBody className="!space-y-0 !pt-4">
          <RequestTable rows={emailRowsPage2} />
        </ManualBody>
        <ReportPageFooter page={4} />
      </ManualPage>

      {/* TRANSCRIPT ONLY */}
      <ManualPage>
        <ManualPageHeader
          section="First meeting"
          title="Discussed in meeting — not all in email"
          subtitle="Warranty copy, contact blocks, butchery strategy, SEO, StoreVac idea, domains."
        />
        <ManualBody className="!space-y-0 !pt-4">
          <RequestTable rows={TRANSCRIPT_ONLY_REQUESTS} />
        </ManualBody>
        <ReportPageFooter page={5} />
      </ManualPage>

      {/* FOLLOWUPS + DELIVERED */}
      <ManualPage>
        <ManualPageHeader section="Completed" title="Already delivered & first-meeting items done" />
        <ManualBody className="!space-y-4">
          <RequestTable rows={FIRST_MEETING_FOLLOWUPS} />
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-4">Website experience live</h3>
          <table className="w-full text-[11px] border-collapse">
            <tbody>
              {WEBSITE_EXPERIENCE_DELIVERED.map((row) => (
                <tr key={row.feature} className="border-b border-border/70 align-top">
                  <td className="py-2 pr-3 font-bold text-primary w-[38%]">{row.feature}</td>
                  <td className="py-2">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ManualBody>
        <ReportPageFooter page={6} />
      </ManualPage>

      {/* LAUNCH PLAN */}
      <ManualPage>
        <ManualPageHeader
          section="Launch"
          title={`Go live — ${LAUNCH_PLAN.date}`}
          subtitle={LAUNCH_READINESS.verdict}
        />
        <ManualBody>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide">Launch steps</h3>
          <ol className="space-y-2 mt-2">
            {LAUNCH_PLAN.steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-[12px]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-white text-[10px] font-black">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-6">Customer mailing</h3>
          <p className="text-[12px] text-copy-muted mt-1">{LAUNCH_MAILING.audience}</p>
          <ManualBulletList items={[...LAUNCH_MAILING.include]} />
          <p className="text-[11px] text-copy-muted mt-2">
            Do <strong>not</strong> mention in mail: {LAUNCH_MAILING.exclude.join("; ")}.
          </p>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-4">Launch risks</h3>
          <ManualBulletList items={[...LAUNCH_READINESS.risks]} />
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-4">Ready now</h3>
          <ManualBulletList items={[...LAUNCH_READINESS.strengths]} />
        </ManualBody>
        <ReportPageFooter page={7} />
      </ManualPage>

      {/* CHECKLIST + STOREVAC */}
      <ManualPage>
        <ManualPageHeader section="Checklist" title="Did we miss anything? + StoreVac domain" />
        <ManualBody>
          <ManualBulletList items={[...MIGHT_HAVE_MISSED]} />
          <div className="mt-6 border-l-4 border-secondary bg-secondary/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{STOREVAC_DOMAIN.domain}</p>
            <p className="text-[12px] leading-relaxed">
              <strong>{STOREVAC_DOMAIN.status}</strong> (~R99 on domains.co.za). {STOREVAC_DOMAIN.note}
            </p>
          </div>
          <p className="text-xs text-copy-muted pt-6 border-t border-border mt-6">
            Lava Greetings / Lava Groete · Anneke Hofmeyr · {ANNEKE_PHONE.display}
          </p>
        </ManualBody>
        <ReportPageFooter page={8} />
      </ManualPage>
    </div>
  );
}
