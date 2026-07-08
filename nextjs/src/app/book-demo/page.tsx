import type { Metadata } from "next";
import DemoBookingWizard from "./DemoBookingWizard";

export const metadata: Metadata = {
  title: "Book a Demonstration | Lava-SA",
  description:
    "Book a free LAVA vacuum sealer demonstration with Anneke — online via video call or in person at our Bryanston showroom. Tuesday–Thursday mornings.",
  alternates: { canonical: "/book-demo" },
};

export default function BookDemoPage() {
  return (
    <main className="min-h-screen bg-surface">
      <DemoBookingWizard />
    </main>
  );
}
