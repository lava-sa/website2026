import type { Metadata } from "next";
import Link from "next/link";
import MailingUnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe from mailing list",
  description: "Remove your email from the LAVA South Africa product updates and tips mailing list.",
  robots: { index: false, follow: true },
};

export default async function MailingUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const initialEmail = String(params?.email ?? "").trim().toLowerCase();

  return (
    <main className="min-h-[60vh] bg-surface py-16">
      <div className="section-container max-w-lg">
        <p className="overline text-secondary mb-2">Mailing list</p>
        <h1 className="text-3xl font-black text-primary mb-3">Unsubscribe</h1>
        <p className="text-sm text-copy-muted leading-relaxed mb-8">
          Enter the email address you used to join the LAVA mailing list. We will stop sending you
          marketing messages (product tips and specials). Order and account emails are not affected.
        </p>
        <MailingUnsubscribeForm initialEmail={initialEmail} />
        <p className="mt-10 text-xs text-copy-muted">
          <Link href="/" className="text-primary font-semibold hover:text-secondary underline underline-offset-2">
            Back to home
          </Link>
          {" · "}
          <Link href="/legal/privacy" className="text-primary font-semibold hover:text-secondary underline underline-offset-2">
            Privacy policy
          </Link>
        </p>
      </div>
    </main>
  );
}
