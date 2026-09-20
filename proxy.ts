import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const session = request.auth;

  if (isAdminRoute && !session) {
    const signInUrl = new URL("/login", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", "/admin");
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    return new NextResponse("Not Found", { status: 404 });
  }

  if ((isAdminRoute || isDashboardRoute) && !session) {
    const signInUrl = new URL("/login", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
