import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow builds and dev to proceed even if ESLint reports errors.
    ignoreDuringBuilds: true,
  },
  // When your repository has multiple lockfiles or monorepo layout,
  // set this to the project root so Next picks the correct tracing root.
  outputFileTracingRoot: path.join(__dirname, '..'),
};

export default nextConfig;
