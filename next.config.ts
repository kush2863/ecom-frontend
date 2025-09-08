import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow builds and dev to proceed even if ESLint reports errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
