// middleware.ts
import { auth } from "@/app/actions/auth"; // PERHATIAN: Sesuaikan path ini dengan lokasi file auth.ts kamu!
import { NextResponse } from "next/server";

export default auth((req) => {
  // Mengecek apakah ada data sesi (user sudah login atau belum)
  const isLoggedIn = !!req.auth;
  
  // Mendapatkan path URL yang sedang coba diakses
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith("/login");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // SKENARIO 1: User SUDAH login, tapi iseng buka halaman /login lagi.
  // Aksi: Langsung lempar kembali ke dashboard (biar gak kerja dua kali).
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next(); // Biarkan lewat kalau memang belum login
  }

  // SKENARIO 2: User BELUM login, tapi mencoba masuk ke area /dashboard.
  // Aksi: Tendang keluar ke halaman /login!
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next(); // Biarkan masuk kalau sudah login
  }

  // Biarkan lewat untuk rute publik lainnya (misal: halaman utama portal berita nanti)
  return NextResponse.next();
});

// SKENARIO 3: Konfigurasi Matcher
// Ini memberitahu Next.js: "Tolong jalankan satpam ini di semua halaman KECUALI file gambar, css, api, dll"
// Ini sangat penting agar website kamu tidak lemot.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};