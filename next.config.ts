import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {

    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@react-pdf-viewer/core', '@react-pdf-viewer/default-layout'],
};

export default nextConfig;
