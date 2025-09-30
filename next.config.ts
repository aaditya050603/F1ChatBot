import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ✅ add this */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
