import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Lava South Africa",
  description: "Secure PayFast checkout for Lava South Africa.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
