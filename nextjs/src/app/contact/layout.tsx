import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Lava South Africa — Speak to Anneke",
  description:
    "Contact Lava South Africa directly. Phone +27 72 160 5556, email info@lava-sa.co.za, or visit us at 5 Stirling Road, Bryanston, Johannesburg.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
