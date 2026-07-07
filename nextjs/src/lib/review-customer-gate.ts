import { createServiceClient } from "@/lib/supabase";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** True when the email appears on a customer row or any order (website purchaser). */
export async function isCustomerEmailOnFile(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) return false;

  const supabase = createServiceClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();

  if (customer) return true;

  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("email", normalized)
    .limit(1)
    .maybeSingle();

  return Boolean(order);
}

export function buildReviewLoginPath(email: string, returnPath: string): string {
  const params = new URLSearchParams({
    from: returnPath || "/submit-review",
    email: normalizeEmail(email),
    reason: "review",
    mode: "login",
  });
  return `/account/login?${params.toString()}`;
}
