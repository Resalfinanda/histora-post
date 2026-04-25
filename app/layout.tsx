import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import { NextAuthProvider } from "@/components/provider/providers";
import { Metadata } from "next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Historapost - Portal Berita Sejarah, Budaya, dan Politik Indonesia",
  description:
    "Historapost adalah portal berita yang menyajikan informasi terkini seputar sejarah, budaya, dan politik Indonesia. Kami berkomitmen untuk memberikan berita yang akurat, mendalam, dan menarik bagi pembaca yang ingin memahami lebih dalam tentang warisan budaya dan dinamika politik di Indonesia.",
  openGraph: {
    title: "Histora Post | Berita dan Sejarah",
    description:
      "Portal berita yang menyajikan informasi terkini dan artikel sejarah mendalam.",
    url: "https://histora-post.vercel.app",
    siteName: "Histora Post",
    images: [
      {
        url: "https://histora-post.vercel.app/icon.png",
        width: 1200,
        height: 630,
        alt: "Logo dan Preview Histora Post",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Histora Post | Berita dan Sejarah",
    description:
      "Portal berita yang menyajikan informasi terkini dan artikel sejarah mendalam.",
    images: ["https://histora-post.vercel.app/icon.png"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>{children}</NextAuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
