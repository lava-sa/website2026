import Image from "next/image";
import {
  ACTION_ANNEKE,
  ACTION_IGNATIUS,
  ANNEKE_REPORT_META,
  KEY_DECISIONS,
  LAUNCH_PLAN,
  MEETING_SUMMARY,
  OUTSTANDING_QUESTIONS,
  POST_MEETING_STATUS,
  STOREVAC_PROJECT,
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
  { src: V300_MANUAL_IMAGES.cover, alt: "LAVA V.300 vacuum sealer" },
  { src: V300_MANUAL_IMAGES.bagFold, alt: "Vacuum-sealed product" },
  { src: "/images/products/machines/lava-vacuum-sealer-v100-premium.webp", alt: "LAVA V.100 Premium" },
] as const;

const LOGO_SRC = "/images/manual/v300-premium-x/lava-website-logo.png";

function ReportPageFooter({ page }: { page: number }) {
  return (
    <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border px-8 py-3 text-[9px] uppercase tracking-widest text-copy-muted">
      <span>Lava-SA · Post-meeting briefing · {ANNEKE_REPORT_META.version}</span>
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
    "Agreed — keep": "bg-secondary/20 text-primary border border-secondary/40",
  };
  return (
    <span className={`inline-block shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function AnnekeReportDocument() {
  return (
    <div id="manual-print-root" className="manual-document space-y-8 pb-16 print:space-y-0 print:pb-0">
      {/* COVER */}
      <ManualPage dark className="overflow-hidden !bg-[#0c4242]">
        <div className="relative min-h-[297mm] flex flex-col text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c4242] via-[#0a3838] to-[#062828]" />
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-6 px-8 pt-10">
              <Image src={LOGO_SRC} alt="la.va" width={200} height={52} unoptimized className="h-11 w-auto brightness-0 invert" />
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/80">www.lava-sa.com</p>
              </div>
            </div>
            <div className="px-8 mt-10">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-secondary">Post-meeting edition</p>
              <h1 className="mt-3 font-heading text-3xl font-black leading-tight">{ANNEKE_REPORT_META.title}</h1>
              <p className="mt-3 text-sm text-white/80">{ANNEKE_REPORT_META.subtitle}</p>
            </div>
            <div className="relative mt-8 overflow-hidden">
              <div className="flex h-[130px] -skew-y-2 scale-[1.04]" style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}>
                {COVER_PHOTOS.map((p) => (
                  <div key={p.src} className="relative flex-1">
                    <Image src={p.src} alt={p.alt} fill unoptimized className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-8 mt-6 -skew-y-1 bg-secondary py-4 px-6">
              <div className="skew-y-1">
                <p className="text-[10px] font-black uppercase text-primary/70">Meeting · {ANNEKE_REPORT_META.meetingDate} · {ANNEKE_REPORT_META.meetingTime}</p>
                <p className="text-lg font-black text-primary mt-1">Anneke Hofmeyr & Ignatius Ackermann</p>
                <p className="text-sm font-bold text-primary/90 mt-2">Go-live target: {ANNEKE_REPORT_META.launchDate}</p>
              </div>
            </div>
            <div className="mt-auto px-8 pt-10 pb-20 text-sm text-white/85 space-y-1">
              <p><span className="text-secondary font-black">T:</span> {ANNEKE_PHONE.display} | {MAIN_PHONE.display}</p>
              <p><span className="text-secondary font-black">E:</span> info@lava-sa.com · anneke@lava-sa.co.za</p>
            </div>
          </div>
          <footer className="absolute bottom-0 left-0 right-0 border-t border-white/15 px-8 py-3 text-[9px] uppercase tracking-widest text-white/50 flex justify-between">
            <span>Lava-SA · Post-meeting briefing</span>
            <span>1</span>
          </footer>
        </div>
      </ManualPage>

      {/* SUMMARY */}
      <ManualPage>
        <ManualPageHeader section="Overview" title="Meeting outcome" subtitle="Not much to change — Anneke happy with direction. Prices and assets from Anneke; Ignatius sends links, PDFs, and StoreVac quote." />
        <ManualBody>
          <ManualBulletList items={[...MEETING_SUMMARY]} />
        </ManualBody>
        <ReportPageFooter page={2} />
      </ManualPage>

      {/* DECISIONS */}
      <ManualPage>
        <ManualPageHeader section="Decisions" title="Key decisions from the call" />
        <ManualBody className="space-y-3">
          {KEY_DECISIONS.map((d) => (
            <div key={d.topic} className="border-b border-border/60 pb-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-primary">{d.topic}</p>
              <p className="text-[12px] mt-1 leading-relaxed">{d.decision}</p>
            </div>
          ))}
        </ManualBody>
        <ReportPageFooter page={3} />
      </ManualPage>

      {/* ACTIONS */}
      <ManualPage>
        <ManualPageHeader section="Actions" title="Who does what next" />
        <ManualBody>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide">Ignatius</h3>
          <ol className="space-y-2 mt-2 mb-6">
            {ACTION_IGNATIUS.map((item, i) => (
              <li key={item} className="flex gap-3 text-[12px]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-white text-[10px] font-black">{i + 1}</span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide">Anneke</h3>
          <ol className="space-y-2 mt-2">
            {ACTION_ANNEKE.map((item, i) => (
              <li key={item} className="flex gap-3 text-[12px]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-secondary text-primary text-[10px] font-black">{i + 1}</span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
        </ManualBody>
        <ReportPageFooter page={4} />
      </ManualPage>

      {/* STATUS TABLE */}
      <ManualPage>
        <ManualPageHeader section="Status" title="Implementation status after meeting" />
        <ManualBody className="!pt-4 !space-y-0">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b-2 border-primary text-left">
                <th className="py-2 pr-2 font-black text-primary w-[14%]">Area</th>
                <th className="py-2 pr-2 font-black text-primary w-[28%]">Item</th>
                <th className="py-2 pr-2 font-black text-primary w-[12%]">Status</th>
                <th className="py-2 font-black text-primary">Notes</th>
              </tr>
            </thead>
            <tbody>
              {POST_MEETING_STATUS.map((row, i) => (
                <tr key={`${row.area}-${i}`} className="border-b border-border/70 align-top">
                  <td className="py-2 pr-2 font-bold text-primary">{row.area}</td>
                  <td className="py-2 pr-2">{row.request}</td>
                  <td className="py-2 pr-2"><StatusBadge status={row.status} /></td>
                  <td className="py-2 text-copy-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ManualBody>
        <ReportPageFooter page={5} />
      </ManualPage>

      {/* LAUNCH + STOREVAC + DELIVERED */}
      <ManualPage>
        <ManualPageHeader section="Launch" title={`Go-live plan · ${LAUNCH_PLAN.date}`} />
        <ManualBody>
          <ManualBulletList items={[...LAUNCH_PLAN.steps]} />
          <div className="mt-6 border-l-4 border-secondary bg-secondary/10 px-4 py-3">
            <p className="text-[10px] font-black uppercase text-primary mb-1">{STOREVAC_PROJECT.name}</p>
            <p className="text-[12px] leading-relaxed">
              <strong>{STOREVAC_PROJECT.domain}</strong> — {STOREVAC_PROJECT.domainStatus}. Scope: {STOREVAC_PROJECT.scope}.
              Quote: <strong>{STOREVAC_PROJECT.quote}</strong>. {STOREVAC_PROJECT.assetsNeeded}.
            </p>
          </div>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-6">Already live on main site</h3>
          <table className="w-full text-[11px] border-collapse mt-2">
            <tbody>
              {WEBSITE_EXPERIENCE_DELIVERED.map((r) => (
                <tr key={r.feature} className="border-b border-border/60">
                  <td className="py-2 pr-3 font-bold text-primary w-[40%]">{r.feature}</td>
                  <td className="py-2">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="font-black text-primary text-sm uppercase tracking-wide pt-6">Still to confirm</h3>
          <ManualBulletList items={[...OUTSTANDING_QUESTIONS]} />
          <p className="text-xs text-copy-muted pt-6 border-t border-border mt-4">
            Lava Groete · Anneke Hofmeyr · {ANNEKE_PHONE.display}
          </p>
        </ManualBody>
        <ReportPageFooter page={6} />
      </ManualPage>
    </div>
  );
}
