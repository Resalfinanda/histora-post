import { auth } from "@/app/actions/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Mengecek apakah ada data sesi (user sudah login atau belum)
  const isLoggedIn = !!req.auth;

  // Mendapatkan path URL yang sedang coba diakses
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith("/login");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};
