import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SITE_ACCESS_COOKIE,
  isSiteAccessEnabled,
  isSiteAccessExemptPath,
  verifySiteAccessCookie,
} from "@/lib/site-access";
import { isGatedWriteApi } from "@/lib/security/public-form-guard";

// Only these hostnames should be indexed by Google
const PRODUCTION_HOSTS = new Set(["lava-sa.com", "www.lava-sa.com"]);

/** Old marketing / dev hosts → single canonical site */
const LEGACY_REDIRECT_HOSTS = new Set([
  "lava-sa.co.za",
  "www.lava-sa.co.za",
  "lava-sa.online",
  "www.lava-sa.online",
]);

function isPreviewHost(request: NextRequest): boolean {
  const host = request.headers.get("host") ?? "";
  const bare = host.split(":")[0].toLowerCase(); // strip port
  return !PRODUCTION_HOSTS.has(bare);
}

function withNoindex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const bareHost = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (LEGACY_REDIRECT_HOSTS.has(bareHost)) {
    const url = request.nextUrl.clone();
    url.hostname = "lava-sa.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const preview = isPreviewHost(request);

  // ── Block public write APIs during preview (bots bypass the HTML gate) ───
  if (
    isSiteAccessEnabled() &&
    request.method === "POST" &&
    isGatedWriteApi(pathname)
  ) {
    const accessCookie = request.cookies.get(SITE_ACCESS_COOKIE)?.value;
    if (!(await verifySiteAccessCookie(accessCookie))) {
      return NextResponse.json({ error: "Site access required" }, { status: 403 });
    }
  }

  // ── Site-wide preview password (public site + APIs except webhooks/admin) ─
  if (isSiteAccessEnabled() && !isSiteAccessExemptPath(pathname)) {
    const accessCookie = request.cookies.get(SITE_ACCESS_COOKIE)?.value;
    if (!(await verifySiteAccessCookie(accessCookie))) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Site access required" }, { status: 401 });
      }
      const gateUrl = new URL("/site-access", request.url);
      if (pathname !== "/") {
        gateUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(gateUrl);
    }
  }

  // ── Admin auth (existing cookie-based approach) ──────────────────────────
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/lava-sa")
  ) {
    const isPublicAdminPath =
      pathname === "/admin/login" ||
      pathname === "/lava-sa" ||
      pathname.startsWith("/lava-sa/login");

    if (!isPublicAdminPath) {
      const session = request.cookies.get("admin_session")?.value;
      if (session !== "authenticated") {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // ── Member-only operating manuals ───────────────────────────────────────
  if (pathname.startsWith("/manuals")) {
    let manualResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            manualResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              manualResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (preview) withNoindex(manualResponse);
    return manualResponse;
  }

  // ── Customer auth (Supabase session) ────────────────────────────────────
  if (pathname.startsWith("/account")) {
    const isPublicAccountPath =
      pathname === "/account/login" ||
      pathname.startsWith("/account/login") ||
      pathname === "/account/reset-password" ||
      pathname === "/account/order-access" ||
      pathname.startsWith("/account/order-access");

    // Always refresh the session so it doesn't expire
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublicAccountPath) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from the login page
    if (user && isPublicAccountPath) {
      return NextResponse.redirect(new URL("/account/profile", request.url));
    }

    if (preview) withNoindex(supabaseResponse);
    return supabaseResponse;
  }

  // ── Noindex on all non-production routes ────────────────────────────────
  const res = NextResponse.next();
  if (preview) withNoindex(res);
  return res;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)",
  ],
};
