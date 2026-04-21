"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { JanetAgent } from "@/components/layout/JanetAgent";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/**
 * Conditionally renders the site chrome (header, breadcrumbs, footer, Janet).
 * Hidden on /admin/* and /lava-sa/* (the admin login path).
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/lava-sa") ||
    pathname.startsWith("/buy");        // funnel — distraction-free, no header/footer

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <Breadcrumbs />
      {children}
      <SiteFooter />
      <JanetAgent />
    </>
  );
}
