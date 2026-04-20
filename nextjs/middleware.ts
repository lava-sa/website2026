import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect both /admin/* and /lava-sa/* (rewritten to /admin/*)
  const isProtected =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    (pathname.startsWith("/lava-sa") &&
      pathname !== "/lava-sa" &&
      pathname !== "/lava-sa/");

  if (isProtected) {
    const session = request.cookies.get("admin_session");
    if (!session || session.value !== "authenticated") {
      // Send users back to the WordPress-style /lava-sa/ path
      const loginUrl = new URL("/lava-sa", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/lava-sa/:path*"],
};
