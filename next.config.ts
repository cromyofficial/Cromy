import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  eslint: {
    ignoreDuringBuilds: true, // ← lets the build pass even if lint errors exist
  },
};

export default nextConfig;