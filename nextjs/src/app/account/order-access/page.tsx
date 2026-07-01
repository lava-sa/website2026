import type { Metadata } from "next";
import PostPurchaseOrderAccess from "@/components/account/PostPurchaseOrderAccess";
import { verifyOrderAccessToken } from "@/lib/order-access-token";
import { createServiceClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "View Your Order — LAVA-SA",
  description: "Secure post-purchase access to your LAVA order.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ order?: string; token?: string; error?: string }>;
};

async function loadOrderContext(orderNumber: string) {
  const service = createServiceClient();
  const { data: dbOrder } = await service
    .from("orders")
    .select("email, first_name")
    .eq("order_number", orderNumber)
    .maybeSingle();

  let firstName = dbOrder?.first_name?.trim() ?? "";
  const email = dbOrder?.email?.trim().toLowerCase() ?? "";

  if (!firstName && email) {
    const { data: customer } = await service
      .from("customers")
      .select("first_name")
      .eq("email", email)
      .maybeSingle();
    firstName = customer?.first_name?.trim() ?? "";
  }

  return { email, firstName };
}

export default async function OrderAccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderNumber = params.order?.trim() ?? "";
  const token = params.token?.trim() ?? "";
  const errorParam = params.error?.trim() ?? null;

  if (!orderNumber) {
    return (
      <PostPurchaseOrderAccess
        orderNumber="—"
        email=""
        token=""
        firstName=""
        error="missing"
      />
    );
  }

  const { email: orderEmail, firstName } = await loadOrderContext(orderNumber);

  if (errorParam && !token) {
    return (
      <PostPurchaseOrderAccess
        orderNumber={orderNumber}
        email={orderEmail}
        token=""
        firstName={firstName}
        error={errorParam}
      />
    );
  }

  const claims = token ? verifyOrderAccessToken(token) : null;

  if (!claims || claims.orderNumber !== orderNumber) {
    return (
      <PostPurchaseOrderAccess
        orderNumber={orderNumber}
        email={claims?.email ?? orderEmail}
        token={token}
        firstName={firstName}
        error={errorParam ?? "expired"}
      />
    );
  }

  if (!orderEmail || orderEmail !== claims.email) {
    return (
      <PostPurchaseOrderAccess
        orderNumber={orderNumber}
        email={claims.email}
        token={token}
        firstName={firstName}
        error="invalid"
      />
    );
  }

  return (
    <PostPurchaseOrderAccess
      orderNumber={orderNumber}
      email={claims.email}
      token={token}
      firstName={firstName}
      error={errorParam}
    />
  );
}
