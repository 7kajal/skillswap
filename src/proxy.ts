import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const isAuthPage =
    request.nextUrl.pathname === "/auth/login" ||
    request.nextUrl.pathname === "/auth/register";

  if (request.auth) {
    if (!isAuthPage) return NextResponse.next();

    const continueUrl = new URL("/auth/continue", request.nextUrl);
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    if (redirectTo) continueUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(continueUrl);
  }

  if (isAuthPage) return NextResponse.next();

  const loginUrl = new URL("/auth/login", request.nextUrl);
  loginUrl.searchParams.set(
    "redirectTo",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/sessions/:path*",
    "/review/:path*",
    "/reputation/:path*",
    "/profile/complete",
    "/auth/login",
    "/auth/register",
  ],
};
