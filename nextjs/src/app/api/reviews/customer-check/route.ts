export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { isCustomerEmailOnFile } from "@/lib/review-customer-gate";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const onFile = await isCustomerEmailOnFile(email);
  return NextResponse.json({ onFile });
}
