import Link from "next/link";
import { createOrderAccessToken } from "@/lib/order-access-token";
import { createServiceClient } from "@/lib/supabase";

type Props = {
  orderNumber: string;
  emailHint?: string;
};

export default async function OrderTrackingCTA({ orderNumber, emailHint }: Props) {
  const service = createServiceClient();
  const { data: dbOrder } = await service
    .from("orders")
    .select("email")
    .eq("order_number", orderNumber)
    .maybeSingle();

  const email = dbOrder?.email?.toLowerCase() ?? emailHint?.toLowerCase() ?? "";
  const orderTrackPath = `/account/orders/${encodeURIComponent(orderNumber)}`;
  const passwordSetupHref = `/account/login?mode=reset&email=${encodeURIComponent(email)}&from=${encodeURIComponent(orderTrackPath)}`;

  if (!email) {
    return (
      <div className="mb-6 pb-6 border-b border-border text-center">
        <p className="text-sm font-semibold text-primary mb-2">Track this order in your account</p>
        <p className="text-sm text-copy-muted mb-4">Use the link in your order confirmation email.</p>
      </div>
    );
  }

  const token = createOrderAccessToken(orderNumber, email);
  const orderAccessHref = `/account/order-access?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`;

  return (
    <div className="mb-6 pb-6 border-b border-border text-center">
      <p className="text-sm font-semibold text-primary mb-2">Track this order in your account</p>
      <p className="text-sm text-copy-muted mb-4 max-w-md mx-auto">
        Open your secure order page for <strong className="text-primary">{orderNumber}</strong> — we
        also emailed this link to <strong className="text-primary">{email}</strong>.
      </p>
      <Link
        href={orderAccessHref}
        className="inline-block bg-primary text-white font-bold px-8 py-3 hover:bg-primary/90 transition-colors mb-3"
      >
        View my order
      </Link>
      <p className="text-xs text-copy-muted">
        Access link valid 24 hours ·{" "}
        <Link href={passwordSetupHref} className="font-bold text-secondary hover:text-primary">
          Set a password for next time →
        </Link>
      </p>
    </div>
  );
}
