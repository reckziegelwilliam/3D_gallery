import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Externalize heavy native packages to prevent serverless function bloat
  serverExternalPackages: ['sharp'],
};

export default nextConfig;

