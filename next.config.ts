import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uyqexwhmwognigyqfegc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/_next/static/**",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/_next/image(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=3600, s-maxage=86400",
            },
          ],
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
