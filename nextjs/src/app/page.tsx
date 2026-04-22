import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import StaticHero from "@/components/home/StaticHero";

export const metadata: Metadata = {
  title: { absolute: "Lava South Africa — German Vacuum Sealers Since 2007" },
  description:
    "Buy LAVA German vacuum sealers in South Africa. Machines, bags, rolls, containers and spare parts — trusted by hunters, biltong makers, anglers and home cooks since 2007. 2-year warranty, nationwide delivery.",
  alternates: { canonical: "/" },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lava South Africa",
  url: SITE_URL,
  inLanguage: "en-ZA",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lava South Africa",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/lava-sa-logo.png`,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  sameAs: [
    "https://www.facebook.com/lavasouthafrica",
    "https://www.instagram.com/lavasouthafrica",
  ],
};

import StatsBand from "@/components/home/StatsBand";
import TrustBar from "@/components/home/TrustBar";
import ReviewCTA from "@/components/home/ReviewCTA";
import ProductGallery from "@/components/home/ProductGallery";
import HeritageSection from "@/components/home/HeritageSection";
import QualitySection from "@/components/home/QualitySection";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import GreenLivingSection from "@/components/home/GreenLivingSection";
import HuntexBanner from "@/components/home/HuntexBanner";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import IndustryLeadersSection from "@/components/home/IndustryLeadersSection";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[websiteSchema, orgSchema]} />

      {/* 1 — Hero: one image, one message, 100vh with header */}
      <StaticHero />

      {/* 2 — Credentials: 4 stats + partner logos */}
      <StatsBand />

      {/* 2b — Trust badges: one consolidated strip */}
      <TrustBar />

      {/* 3 — Customer review CTA: written + video */}
      <ReviewCTA />

      {/* 4 — Product range: V.100, V.300, V.333, V.400 */}
      <ProductGallery />

      {/* 5 — Heritage: German family story, Landig family */}
      <HeritageSection />

      {/* 6 — Quality: built to last a lifetime */}
      <QualitySection />

      {/* 7 — Sustainability: beyond disposable culture */}
      <SustainabilitySection />

      {/* 8 — Green Living: reforestation, responsible future */}
      <GreenLivingSection />

      {/* 9 — Event: Huntex 2026 */}
      <HuntexBanner variant="section" />

      {/* 10 — Social proof: 3 verified reviews */}
      <TestimonialsSection />

      {/* 11 — Industry leaders: SA business partners */}
      <IndustryLeadersSection />

      {/* 12 — Closing conversion */}
      <FinalCTA />

    </main>
  );
}
