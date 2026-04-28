import type { NextConfig } from "next";

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
    // Noindex every deployment that is NOT the live production domain.
    // VERCEL_ENV is set automatically by Vercel: 'production' | 'preview' | 'development'
    // We treat any deployment on a non-production Vercel env as noindex.
    const vercelEnv = process.env.VERCEL_ENV;
    if (vercelEnv && vercelEnv !== "production") {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Robots-Tag", value: "noindex, nofollow" },
          ],
        },
      ];
    }
    return [];
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
  async redirects() {
    return [
      // Canonical host policy: route all variants to https://www.lava-sa.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "lava-sa.co.za" }],
        destination: "https://www.lava-sa.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "lava-sa.com" }],
        destination: "https://www.lava-sa.com/:path*",
        permanent: true,
      },
    ];
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

export default nextConfig;
