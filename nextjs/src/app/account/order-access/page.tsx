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
        error="missing"
      />
    );
  }

  if (errorParam && !token) {
    return (
      <PostPurchaseOrderAccess
        orderNumber={orderNumber}
        email=""
        token=""
        error={errorParam}
      />
    );
  }

  const claims = token ? verifyOrderAccessToken(token) : null;

  if (!claims || claims.orderNumber !== orderNumber) {
    return (
      <PostPurchaseOrderAccess
        orderNumber={orderNumber}
        email={claims?.email ?? ""}
        token={token}
        error={errorParam ?? "expired"}
      />
    );
  }

  const service = createServiceClient();
  const { data: dbOrder } = await service
    .from("orders")
    .select("email")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!dbOrder?.email || dbOrder.email.toLowerCase() !== claims.email) {
    return (
      <PostPurchaseOrderAccess
        orderNumber={orderNumber}
        email={claims.email}
        token={token}
        error="invalid"
      />
    );
  }

  return (
    <PostPurchaseOrderAccess
      orderNumber={orderNumber}
      email={claims.email}
      token={token}
      error={errorParam}
    />
  );
}
