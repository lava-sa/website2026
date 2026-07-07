"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { JanetAgent } from "@/components/layout/JanetAgent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import CookieConsent from "@/components/CookieConsent";
import CartDrawer from "@/components/shop/CartDrawer";
import InstallPrompt from "@/components/pwa/InstallPrompt";

/**
 * Conditionally renders the site chrome (header, breadcrumbs, footer, Janet).
 * Hidden on /admin/*, /lava-sa/* (admin login), /buy/* funnels, /lp/*, /site-access, and /site-review/*.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/lava-sa") ||
    pathname.startsWith("/buy") ||
    pathname.startsWith("/lp") ||
    pathname.startsWith("/site-review") ||
    pathname.startsWith("/site-access") ||
    pathname.startsWith("/manuals");

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
      <CartDrawer />
      <CookieConsent />
      <InstallPrompt />
    </>
  );
}
