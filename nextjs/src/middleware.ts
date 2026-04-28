import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Only these hostnames should be indexed by Google
const PRODUCTION_HOSTS = new Set(["lava-sa.com", "www.lava-sa.com"]);

function isPreviewHost(request: NextRequest): boolean {
  const host = request.headers.get("host") ?? "";
  const bare = host.split(":")[0]; // strip port
  return !PRODUCTION_HOSTS.has(bare);
}

function withNoindex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const preview = isPreviewHost(request);

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

  // ── Customer auth (Supabase session) ────────────────────────────────────
  if (pathname.startsWith("/account")) {
    const isPublicAccountPath =
      pathname === "/account/login" ||
      pathname.startsWith("/account/login") ||
      pathname === "/account/reset-password";

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
      return NextResponse.redirect(new URL("/account/dashboard", request.url));
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
