import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart — Lava South Africa",
  description: "Review the items in your cart and checkout securely via PayFast.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
