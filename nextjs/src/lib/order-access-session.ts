import type { EmailOtpType } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

/** Ensure Supabase Auth user exists (checkout may have failed silently). */
export async function ensureAuthUser(email: string): Promise<void> {
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

async function getAuthUserIdByEmail(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  const service = createServiceClient();

  for (let page = 1; page <= 10; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) break;

    const user = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (user) return user.id;

    if (data.users.length < 200) break;
  }

  return null;
}

/** Set password via admin API (works before the customer has signed in). */
export async function setCustomerPasswordByEmail(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();
  await ensureAuthUser(normalized);

  const userId = await getAuthUserIdByEmail(normalized);
  if (!userId) {
    return { ok: false, error: "user_not_found" };
  }

  const service = createServiceClient();
  const { error } = await service.auth.admin.updateUserById(userId, { password });
  if (error) {
    console.error("[order-access] updateUserById:", error.message);
    return { ok: false, error: "update_failed" };
  }

  return { ok: true };
}
