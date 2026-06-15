import type { Metadata } from "next";
import V300ManualDocument from "@/components/manual/V300ManualDocument";
import ManualToolbar from "@/components/manual/ManualToolbar";
import { V300_MANUAL_META } from "@/lib/v300-manual-images";
import { pageMetadata } from "@/lib/seo";
import "./manual-print.css";

export const metadata: Metadata = pageMetadata({
  title: "V.300 Series Operating Manual (English)",
  description:
    "Official Lava-SA operating manual for the LAVA V.300 Premium X, White and Black vacuum sealers. Setup, operation, troubleshooting, and specifications.",
  path: V300_MANUAL_META.path,
});

export default function V300SeriesManualPage() {
  return (
    <div className="manual-viewer min-h-screen bg-[#d8e0e0] print:bg-white">
      <ManualToolbar
        title={V300_MANUAL_META.title}
        productHref="/products/v300-premium-x"
        logoSrc="/images/manual/v300-premium-x/lava-website-logo.png"
      />
      <div className="section-container py-8 print:py-0 print:px-0 print:max-w-none">
        <V300ManualDocument />
      </div>
    </div>
  );
}
