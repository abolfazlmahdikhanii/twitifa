import { NextResponse } from "next/server";

const publicRoutes = ["/", "auth"];
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isProtected = !isPublic;
  const isAuthRoute = pathname.startsWith("/auth");

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  if (isAuthRoute && (token || refreshToken)) {
    return NextResponse.redirect("/feed", req.url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
