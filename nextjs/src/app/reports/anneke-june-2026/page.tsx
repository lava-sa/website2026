import type { Metadata } from "next";
import AnnekeReportDocument from "@/components/reports/AnnekeReportDocument";
import ReportToolbar from "@/components/reports/ReportToolbar";
import { ANNEKE_REPORT_META } from "@/content/anneke-report-june-2026";
import "../../manuals/v300-series/manual-print.css";

export const metadata: Metadata = {
  title: `${ANNEKE_REPORT_META.title} · Lava-SA`,
  description: ANNEKE_REPORT_META.subtitle,
  robots: { index: false, follow: false },
};

export default function AnnekeJune2026ReportPage() {
  return (
    <div className="manual-viewer min-h-screen bg-[#d8e0e0] print:bg-white">
      <ReportToolbar title={`${ANNEKE_REPORT_META.title} · ${ANNEKE_REPORT_META.meetingDate}`} />
      <div className="section-container py-8 print:py-0 print:px-0 print:max-w-none">
        <AnnekeReportDocument />
      </div>
    </div>
  );
}
