import Link from "next/link";
import { resolveOrderAccessUrl } from "@/lib/checkout-customer-account";

type Props = {
  orderNumber: string;
  emailHint?: string;
};

export default async function OrderTrackingCTA({ orderNumber, emailHint }: Props) {
  const orderTrackPath = `/account/orders/${encodeURIComponent(orderNumber)}`;
  const { url: orderAccessUrl, email } = await resolveOrderAccessUrl(orderNumber, emailHint);

  const passwordSetupHref = `/account/login?mode=reset&email=${encodeURIComponent(email ?? emailHint ?? "")}&from=${encodeURIComponent(orderTrackPath)}`;

  if (orderAccessUrl) {
    return (
      <div className="mb-6 pb-6 border-b border-border text-center">
        <p className="text-sm font-semibold text-primary mb-2">Track this order in your account</p>
        <p className="text-sm text-copy-muted mb-4 max-w-md mx-auto">
          Open your order with one click — no password needed. We also sent this link to{" "}
          <strong className="text-primary">{email ?? "your email"}</strong>.
        </p>
        <a
          href={orderAccessUrl}
          className="inline-block bg-primary text-white font-bold px-8 py-3 hover:bg-primary/90 transition-colors mb-3"
        >
          Open my order — one click
        </a>
        <p className="text-xs text-copy-muted">
          Prefer a password?{" "}
          <Link href={passwordSetupHref} className="font-bold text-secondary hover:text-primary">
            Set your password first →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 pb-6 border-b border-border text-center">
      <p className="text-sm font-semibold text-primary mb-2">Track this order in your account</p>
      <p className="text-sm text-copy-muted mb-4 max-w-md mx-auto">
        {emailHint ? (
          <>
            First time on the new site? Set a password for{" "}
            <strong className="text-primary">{emailHint}</strong> — we created your account when you
            checked out. You never received a password by email.
          </>
        ) : (
          <>
            Enter the email you used at checkout to set your password and view this order.
          </>
        )}
      </p>
      <Link
        href={passwordSetupHref}
        className="inline-block bg-primary text-white font-bold px-8 py-3 hover:bg-primary/90 transition-colors mb-3"
      >
        Set password &amp; track order
      </Link>
      <p className="text-xs text-copy-muted">
        Already have a password?{" "}
        <Link
          href={`/account/login?email=${encodeURIComponent(emailHint ?? "")}&from=${encodeURIComponent(orderTrackPath)}`}
          className="font-bold text-secondary hover:text-primary"
        >
          Sign in instead →
        </Link>
      </p>
    </div>
  );
}
