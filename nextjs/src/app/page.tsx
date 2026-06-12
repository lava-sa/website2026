import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import StaticHero from "@/components/home/StaticHero";
import { getSitePageContent } from "@/lib/queries/site-pages";

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

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getSitePageContent("home");
  return {
    title: { absolute: cms.seo.title },
    description: cms.seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: cms.seo.title,
      description: cms.seo.description,
      url: "/",
    },
    twitter: {
      title: cms.seo.title,
      description: cms.seo.description,
    },
  };
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lava-SA",
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
  name: "Lava-SA",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/lava-sa-logo.png`,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  sameAs: [
    "https://www.facebook.com/lavavidesa",
    "https://www.instagram.com/lava_vide_sa",
    "https://la-va.com",
  ],
};

export default async function HomePage() {
  const cms = await getSitePageContent("home");

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[websiteSchema, orgSchema]} />

      <StaticHero content={cms} />
      <StatsBand />
      <TrustBar />
      <ProductGallery />
      <HeritageSection />
      <QualitySection />
      <SustainabilitySection />
      <GreenLivingSection />
      <TestimonialsSection />
      <ReviewCTA />
      <IndustryLeadersSection />
      <FinalCTA />
    </main>
  );
}
