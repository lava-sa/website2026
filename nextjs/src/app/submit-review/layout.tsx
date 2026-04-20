import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Product Review — Lava South Africa",
  description:
    "Share your experience with a LAVA vacuum sealer. Your review helps other South African hunters, anglers and cooks choose the right machine.",
  alternates: { canonical: "/submit-review" },
};

export default function SubmitReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
