import { buildReviewLoginPath } from "@/lib/review-customer-gate";

/** Redirect to login when email is not on file; returns false if redirected. */
export async function ensureCustomerEmailOnFile(
  email: string,
  returnPath: string
): Promise<boolean> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return false;

  const res = await fetch("/api/reviews/customer-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: trimmed }),
  });

  if (!res.ok) return true;

  const data = (await res.json().catch(() => ({}))) as { onFile?: boolean };
  if (data.onFile) return true;

  window.location.href = buildReviewLoginPath(trimmed, returnPath);
  return false;
}
