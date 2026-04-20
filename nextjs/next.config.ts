import type { NextConfig } from "next";

// Allow self-signed SSL for LocalWP in development
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
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
