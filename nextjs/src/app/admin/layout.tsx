import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Lava South Africa",
  robots: { index: false, follow: false },
};

// Admin area uses its own layout — no SiteHeader/SiteFooter
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
