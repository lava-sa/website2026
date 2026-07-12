import { permanentRedirect } from "next/navigation";
import { DEMO_BOOKING_ENABLED } from "@/lib/demo-booking-config";
import DemoBookingWizard from "./DemoBookingWizard";

export default function BookDemoPage() {
  if (!DEMO_BOOKING_ENABLED) {
    permanentRedirect("/contact");
  }

  return (
    <main className="min-h-screen bg-surface">
      <DemoBookingWizard />
    </main>
  );
}
