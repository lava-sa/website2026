import type { Metadata } from "next";
import V100ManualDocument from "@/components/manual/V100ManualDocument";
import ManualToolbar from "@/components/manual/ManualToolbar";
import { V100_MANUAL_META } from "@/lib/v100-manual-images";
import { pageMetadata } from "@/lib/seo";
import "../v300-series/manual-print.css";

export const metadata: Metadata = pageMetadata({
  title: "V.100 Premium X Operating Manual (English)",
  description:
    "Official Lava-SA operating manual for the LAVA V.100 Premium X vacuum sealer. Manual vacuum control, double seal, setup, troubleshooting, and specifications.",
  path: V100_MANUAL_META.path,
});

export default function V100PremiumXManualPage() {
  return (
    <div className="manual-viewer min-h-screen bg-[#d8e0e0] print:bg-white">
      <ManualToolbar
        title={V100_MANUAL_META.title}
        productHref="/products/v100-premium-x"
        logoSrc="/images/manual/v100-premium-x/lava-website-logo.png"
      />
      <div className="section-container py-8 print:py-0 print:px-0 print:max-w-none">
        <V100ManualDocument />
      </div>
    </div>
  );
}
