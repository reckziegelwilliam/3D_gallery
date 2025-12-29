import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Externalize heavy packages to prevent serverless function bloat
  serverExternalPackages: [
    'sharp',
  ],
  // Exclude heavy packages from output file tracing for API routes
  outputFileTracingExcludes: {
    '/api/*': [
      './node_modules/three/**',
      './node_modules/@react-three/**',
      './node_modules/sharp/**',
    ],
  },
};

export default nextConfig;

