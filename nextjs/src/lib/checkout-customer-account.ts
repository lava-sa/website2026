import { randomBytes } from "node:crypto";
import { getOrderTrackingAuthRedirectUrl } from "@/lib/auth-redirect";
import { createServiceClient } from "@/lib/supabase";

export type CheckoutAccountResult = {
  customerId: string | null;
  isNewAccount: boolean;
  /** Secure one-click link — signs the customer in and opens their order page */
  orderAccessUrl?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function internalPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  const bytes = randomBytes(24);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function authUserExistsMessage(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("already") ||
    lower.includes("registered") ||
    lower.includes("exists") ||
    lower.includes("duplicate")
  );
}

async function upsertCustomerRow(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<string | null> {
  const supabase = createServiceClient();
  const email = normalizeEmail(params.email);

  const { data: existing } = await supabase
    .from("customers")
    .select("id, first_name, last_name, phone")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("customers")
      .update({
        first_name: params.firstName || existing.first_name,
        last_name: params.lastName || existing.last_name,
        phone: params.phone || existing.phone,
      })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("customers")
    .insert({
      email,
      first_name: params.firstName,
      last_name: params.lastName,
      phone: params.phone ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[checkout-account] customers insert failed:", error.message);
    return null;
  }

  return inserted.id;
}

/** Magic link that signs the customer in and lands on their order tracking page. */
export async function generateOrderAccessMagicLink(
  email: string,
  orderNumber: string
): Promise<string | null> {
  const supabase = createServiceClient();
  const normalized = normalizeEmail(email);
  const redirectTo = getOrderTrackingAuthRedirectUrl(orderNumber);

  const link = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: normalized,
    options: { redirectTo },
  });

  const actionLink = link.data?.properties?.action_link;
  if (!link.error && actionLink) return actionLink;

  console.error(
    `[checkout-account] magiclink failed for ${orderNumber} (${normalized}):`,
    link.error?.message
  );
  return null;
}

/** Resolve a one-click order URL, optionally verifying the shopper email matches the order. */
export async function resolveOrderAccessUrl(
  orderNumber: string,
  emailHint?: string
): Promise<{ url: string | null; email: string | null }> {
  const supabase = createServiceClient();
  const { data: order } = await supabase
    .from("orders")
    .select("email")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order?.email) return { url: null, email: null };

  const email = normalizeEmail(order.email);
  if (emailHint && normalizeEmail(emailHint) !== email) {
    return { url: null, email: null };
  }

  const url = await generateOrderAccessMagicLink(email, orderNumber);
  return { url, email };
}

/**
 * Ensure a Supabase Auth user + customers row exist for checkout.
 * Returns a one-click magic link for order tracking (no password in email).
 */
export async function ensureCheckoutCustomerAccount(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  orderNumber: string;
}): Promise<CheckoutAccountResult> {
  const email = normalizeEmail(params.email);
  const customerId = await upsertCustomerRow({
    email,
    firstName: params.firstName,
    lastName: params.lastName,
    phone: params.phone,
  });

  const supabase = createServiceClient();
  let isNewAccount = false;

  const created = await supabase.auth.admin.createUser({
    email,
    password: internalPassword(),
    email_confirm: true,
    user_metadata: {
      first_name: params.firstName,
      last_name: params.lastName,
    },
  });

  if (!created.error && created.data.user) {
    isNewAccount = true;
  } else if (!authUserExistsMessage(created.error?.message ?? "")) {
    console.error("[checkout-account] createUser failed:", created.error?.message);
  }

  const orderAccessUrl =
    (await generateOrderAccessMagicLink(email, params.orderNumber)) ?? undefined;

  if (!orderAccessUrl) {
    console.warn(
      `[checkout-account] No magic link for ${params.orderNumber} (${email}) — customer must use password reset`
    );
  }

  return { customerId, isNewAccount, orderAccessUrl };
}
