import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import { NextAuthProvider } from "@/components/provider/providers";
import { Metadata } from "next";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Historapost - Portal Berita Sejarah, Budaya, dan Politik Indonesia",
    template: "%s | Historapost",
  },
  description:
    "Historapost adalah portal berita yang menyajikan informasi terkini seputar sejarah, budaya, dan politik Indonesia. Kami berkomitmen untuk memberikan berita yang akurat, mendalam, dan menarik bagi pembaca yang ingin memahami lebih dalam tentang warisan budaya dan dinamika politik di Indonesia.",
  openGraph: {
    title: "Histora Post | Berita dan Sejarah",
    description:
      "Portal berita yang menyajikan informasi terkini dan artikel sejarah mendalam.",
    url: "https://historapost.com",
    siteName: "Histora Post",
    images: [
      {
        url: "https://historapost.com/opengraph-image.png",
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
    images: ["https://historapost.com/opengraph-image.png"],
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
      <head>
        <link
          rel="preconnect"
          href="https://uyqexwhnwognigyqfegc.supabase.co"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://uyqexwhnwognigyqfegc.supabase.co"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>{children}</NextAuthProvider>
        <Toaster position="top-right" richColors />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
              window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', 'G-GZSBRWET9P');

            var gtagScript = document.createElement('script');
            gtagScript.async = true;
            gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-GZSBRWET9P';
            document.head.appendChild(gtagScript);
          `}
        </Script>
      </body>
    </html>
  );
}
