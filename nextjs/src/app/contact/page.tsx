import type { Metadata } from "next";
import ContactPageClient from "@/app/contact/ContactPageClient";
import { getSitePageContent } from "@/lib/queries/site-pages";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getSitePageContent("contact");
  return {
    title: cms.seo.title,
    description: cms.seo.description,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const cms = await getSitePageContent("contact");
  return <ContactPageClient cms={cms} />;
}
