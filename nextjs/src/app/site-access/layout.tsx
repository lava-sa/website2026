import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site access — Lava-SA",
  robots: { index: false, follow: false },
};

export default function SiteAccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-petrol-900 text-white flex flex-col">
      {children}
    </div>
  );
}
