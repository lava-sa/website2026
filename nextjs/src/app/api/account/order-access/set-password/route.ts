export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { setCustomerPasswordByEmail, signInCustomerByEmail } from "@/lib/order-access-session";
import { verifyOrderAccessToken } from "@/lib/order-access-token";
import { createServiceClient } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
      return NextResponse.json(
        { error: "Password setup is temporarily unavailable. Please contact us for help." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const order = String(body?.order ?? "").trim();
    const token = String(body?.token ?? "").trim();
    const password = String(body?.password ?? "");

    if (!order || !token) {
      return NextResponse.json({ error: "Order and access token are required." }, { status: 400 });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const claims = verifyOrderAccessToken(token);
    if (!claims || claims.orderNumber !== order) {
      return NextResponse.json(
        { error: "This link has expired or is invalid. Open the link from your latest order email." },
        { status: 403 }
      );
    }

    const service = createServiceClient();
    const { data: dbOrder } = await service
      .from("orders")
      .select("email")
      .eq("order_number", order)
      .maybeSingle();

    if (!dbOrder?.email || dbOrder.email.toLowerCase() !== claims.email) {
      return NextResponse.json(
        { error: "This link does not match our records." },
        { status: 403 }
      );
    }

    const updated = await setCustomerPasswordByEmail(claims.email, password);
    if (!updated.ok) {
      return NextResponse.json(
        { error: "Could not save your password. Please try again in a moment." },
        { status: 500 }
      );
    }

    const signIn = await signInCustomerByEmail(claims.email);
    if (!signIn.ok) {
      return NextResponse.json({
        ok: true,
        signedIn: false,
        message: "Password saved. You can sign in with your email and new password.",
      });
    }

    return NextResponse.json({
      ok: true,
      signedIn: true,
      message: "Password saved. You're signed in — open your order whenever you're ready.",
    });
  } catch (err) {
    console.error("[order-access/set-password]", err);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}
