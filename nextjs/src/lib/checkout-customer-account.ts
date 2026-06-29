import { randomBytes } from "node:crypto";
import { createServiceClient } from "@/lib/supabase";

export type CheckoutAccountResult = {
  customerId: string | null;
  isNewAccount: boolean;
  temporaryPassword?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(12);
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

/**
 * Ensure a Supabase Auth user + customers row exist for a new checkout.
 * New buyers receive a temporary password in the order email.
 * Existing members keep their password — no reset.
 */
export async function ensureCheckoutCustomerAccount(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<CheckoutAccountResult> {
  const email = normalizeEmail(params.email);
  const customerId = await upsertCustomerRow({
    email,
    firstName: params.firstName,
    lastName: params.lastName,
    phone: params.phone,
  });

  const supabase = createServiceClient();
  const temporaryPassword = generateTemporaryPassword();

  const created = await supabase.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      first_name: params.firstName,
      last_name: params.lastName,
    },
  });

  if (!created.error && created.data.user) {
    return { customerId, isNewAccount: true, temporaryPassword };
  }

  if (authUserExistsMessage(created.error?.message ?? "")) {
    return { customerId, isNewAccount: false };
  }

  console.error("[checkout-account] createUser failed:", created.error?.message);
  return { customerId, isNewAccount: false };
}
