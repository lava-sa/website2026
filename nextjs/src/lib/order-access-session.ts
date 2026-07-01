import type { EmailOtpType } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

/** Ensure Supabase Auth user exists (checkout may have failed silently). */
async function ensureAuthUser(email: string): Promise<void> {
  const supabase = createServiceClient();
  const created = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (created.error) {
    const msg = created.error.message.toLowerCase();
    if (!msg.includes("already") && !msg.includes("registered") && !msg.includes("exists")) {
      console.warn("[order-access] createUser:", created.error.message);
    }
  }
}

/**
 * Sign the customer in server-side (sets session cookies).
 * Generates a fresh OTP each call — safe for button clicks, not email prefetch.
 */
export async function signInCustomerByEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();
  await ensureAuthUser(normalized);

  const service = createServiceClient();
  const link = await service.auth.admin.generateLink({
    type: "magiclink",
    email: normalized,
  });

  const tokenHash = link.data?.properties?.hashed_token;
  if (link.error || !tokenHash) {
    console.error("[order-access] generateLink failed:", link.error?.message);
    return { ok: false, error: "link_failed" };
  }

  const supabase = await createClient();
  const types: EmailOtpType[] = ["email", "magiclink"];

  for (const type of types) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (!error) return { ok: true };
    console.warn(`[order-access] verifyOtp type=${type}:`, error.message);
  }

  return { ok: false, error: "verify_failed" };
}
