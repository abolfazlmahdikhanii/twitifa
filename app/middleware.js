import { NextResponse } from "next/server";

const publicRoutes = ["/auth", "/auth/reset-password"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  // const resetSession = req.cookies.get("reset_session")?.value;

  // if (pathname.startsWith("/auth/reset-password")) {
  //   if (!resetSession) {
  //     return NextResponse.redirect(new URL("/auth/forgot-password", req.url));
  //   }

  //   return NextResponse.next();
  // }
  const isHome = pathname === "/";
  const isPublic =
    isHome || publicRoutes.some((route) => pathname.startsWith(route));
  const isProtected = !isPublic;

  const isResetPassword = pathname.startsWith("/auth/reset-password");
  const isAuthRoute = pathname.startsWith("/auth") && !isResetPassword;

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (isAuthRoute && (token || refreshToken)) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
