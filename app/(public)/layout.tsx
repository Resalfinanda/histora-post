import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { ThemeProvider } from "@/components/provider/themeProvider";
import { Suspense } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Historapost - Portal Berita Sejarah, Budaya, dan Politik Indonesia",
  description:
    "Historapost adalah portal berita yang menyajikan informasi terkini seputar sejarah, budaya, dan politik Indonesia. Kami berkomitmen untuk memberikan berita yang akurat, mendalam, dan menarik bagi pembaca yang ingin memahami lebih dalam tentang warisan budaya dan dinamika politik di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Suspense fallback={<div className="h-20 bg-[#0f172a] w-full" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
