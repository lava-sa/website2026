export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import {
  SITE_ACCESS_COOKIE,
  isSiteAccessEnabled,
  signSiteAccessCookie,
  verifySiteAccessPassword,
} from "@/lib/site-access";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

export async function POST(request: NextRequest) {
  if (!isSiteAccessEnabled()) {
    return NextResponse.json({ error: "Site access gate is not enabled" }, { status: 503 });
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifySiteAccessPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await signSiteAccessCookie();
  if (!token) {
    return NextResponse.json({ error: "Site access not configured" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SITE_ACCESS_COOKIE, token, cookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SITE_ACCESS_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
