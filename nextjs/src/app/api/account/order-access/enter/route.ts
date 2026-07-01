export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { signInCustomerByEmail } from "@/lib/order-access-session";
import { verifyOrderAccessToken } from "@/lib/order-access-token";
import { createServiceClient } from "@/lib/supabase";
import { getCustomerFacingSiteUrl } from "@/lib/seo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const order = searchParams.get("order")?.trim();
  const token = searchParams.get("token")?.trim();
  const site = getCustomerFacingSiteUrl();

  if (!order || !token) {
    return NextResponse.redirect(`${site}/account/order-access?error=missing`);
  }

  const claims = verifyOrderAccessToken(token);
  if (!claims || claims.orderNumber !== order) {
    return NextResponse.redirect(
      `${site}/account/order-access?order=${encodeURIComponent(order)}&error=expired`
    );
  }

  const service = createServiceClient();
  const { data: dbOrder } = await service
    .from("orders")
    .select("email")
    .eq("order_number", order)
    .maybeSingle();

  if (!dbOrder?.email || dbOrder.email.toLowerCase() !== claims.email) {
    return NextResponse.redirect(
      `${site}/account/order-access?order=${encodeURIComponent(order)}&error=invalid`
    );
  }

  const signIn = await signInCustomerByEmail(claims.email);
  if (!signIn.ok) {
    return NextResponse.redirect(
      `${site}/account/order-access?order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}&error=signin`
    );
  }

  return NextResponse.redirect(`${site}/account/orders/${encodeURIComponent(order)}`);
}
