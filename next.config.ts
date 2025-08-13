import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for GitHub upload preparation
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checks during builds for GitHub upload preparation
    ignoreBuildErrors: true,
  },
  experimental: {
    // Turbopack is disabled via --turbopack flag in dev script
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
