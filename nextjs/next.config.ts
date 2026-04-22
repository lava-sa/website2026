import type { NextConfig } from "next";

// Allow self-signed SSL for LocalWP in development
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Production domains that should be indexed by Google
const PRODUCTION_DOMAINS = ["lava-sa.co.za", "www.lava-sa.co.za"];

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

export default nextConfig;
