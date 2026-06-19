import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth(async (req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Custom type cast to get role from session
  const user = req.auth?.user as any;
  const userRole = user?.role;
  const isLoginPage = nextUrl.pathname.startsWith("/auth/login");

  // Clone headers to set pathname for RootLayout conditional check
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", nextUrl.pathname);

  if (isLoginPage) {
    if (isLoggedIn && userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  }

  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
