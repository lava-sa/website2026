import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Lava-SA",
  description: "Secure PayFast checkout for Lava-SA.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
