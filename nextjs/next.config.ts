import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Allow self-signed SSL for LocalWP in development
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Production domains that should be indexed by Google
const PRODUCTION_DOMAINS = ["lava-sa.com", "www.lava-sa.com"];

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        // microphone/camera=(self) required for Janet voice + review video; keep geolocation blocked
        value: "camera=(self), microphone=(self), geolocation=()",
      },
    ];

    const vercelEnv = process.env.VERCEL_ENV;
    const isProduction = !vercelEnv || vercelEnv === "production";

    const headers = [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          ...(isProduction
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];

    return headers;
  },

  images: {
    // Explicit optimization policy for predictable SEO/Core Web Vitals behavior.
    // Next/Image will generate responsive srcset and serve AVIF/WebP when supported.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 120, 180, 256, 384],
    remotePatterns: [
      // LocalWP dev
      {
        protocol: "http",
        hostname: "lava-sa.local",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lava-sa.local",
        pathname: "/wp-content/uploads/**",
      },
      // Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // German reference site
      {
        protocol: "https",
        hostname: "la-va.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // WordPress-style admin login path — /lava-sa/ maps to internal /admin/*
      { source: "/lava-sa", destination: "/admin/login" },
      { source: "/lava-sa/", destination: "/admin/login" },
      { source: "/lava-sa/:path*", destination: "/admin/:path*" },
    ];
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable in dev so HMR isn't fighting a cached service worker.
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  cacheOnNavigation: true,
});

export default withSerwist(nextConfig);
