import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import StaticHero from "@/components/home/StaticHero";

export const metadata: Metadata = {
  title: {
    absolute:
      "LAVA Vacuum Sealers South Africa | Premium German Food Preservation Since 2007 | Lava-SA",
  },
  description:
    "LAVA vacuum sealers South Africa — German-engineered V.300 Premium X, bags, rolls & accessories. 2-year warranty, free shipping over R2,500. Since 2007.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "LAVA Vacuum Sealers South Africa | Premium German Food Preservation Since 2007 | Lava-SA",
    url: "/",
  },
  twitter: {
    title:
      "LAVA Vacuum Sealers South Africa | Premium German Food Preservation | Lava-SA",
  },
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
import ProductGallery from "@/components/home/ProductGallery";
import HeritageSection from "@/components/home/HeritageSection";
import QualitySection from "@/components/home/QualitySection";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import GreenLivingSection from "@/components/home/GreenLivingSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ReviewCTA from "@/components/home/ReviewCTA";
import IndustryLeadersSection from "@/components/home/IndustryLeadersSection";
import FinalCTA from "@/components/home/FinalCTA";
import MailingListSignup from "@/components/common/MailingListSignup";

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

      {/* 3 — Product range: V.100, V.300, V.333, V.400 */}
      <ProductGallery />

      {/* 5 — Heritage: German family story, Landig family */}
      <HeritageSection />

      {/* 6 — Quality: built to last a lifetime */}
      <QualitySection />

      {/* 7 — Sustainability: beyond disposable culture */}
      <SustainabilitySection />

      {/* 8 — Green Living: reforestation, responsible future */}
      <GreenLivingSection />

      {/* 9 — Social proof: 3 verified reviews + full review / gratitude CTA */}
      <TestimonialsSection />

      <ReviewCTA />

      {/* 10 — Industry leaders: SA business partners */}
      <IndustryLeadersSection />

      <section className="py-14 bg-surface border-y border-border">
        <div className="section-container max-w-3xl">
          <MailingListSignup
            source="homepage"
            title="Stay in the Loop"
            subtitle="Join the LAVA Mailing List for practical preservation tips, product updates, and member-only specials."
          />
        </div>
      </section>

      {/* 12 — Closing conversion */}
      <FinalCTA />

    </main>
  );
}
