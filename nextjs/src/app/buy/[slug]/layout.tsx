import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy — Lava-SA",
  description: "Complete your LAVA vacuum sealer purchase. Secure checkout, 2-year warranty, nationwide delivery.",
  robots: { index: false, follow: false },
};

export default function BuyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
