import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Externalize heavy packages to prevent serverless function bloat
  serverExternalPackages: [
    'sharp',
    'three',
    '@react-three/fiber',
    '@react-three/drei', 
    '@react-three/postprocessing',
    '@react-three/rapier',
  ],
  // Exclude heavy packages from output file tracing
  outputFileTracingExcludes: {
    '*': [
      './node_modules/three/**',
      './node_modules/@react-three/**',
      './node_modules/sharp/**',
      './node_modules/@dimforge/**',
      './node_modules/postprocessing/**',
    ],
  },
  // Custom webpack config to externalize heavy packages on server
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'sharp': 'commonjs sharp',
        'three': 'commonjs three',
        '@react-three/fiber': 'commonjs @react-three/fiber',
        '@react-three/drei': 'commonjs @react-three/drei',
        '@react-three/postprocessing': 'commonjs @react-three/postprocessing',
        '@react-three/rapier': 'commonjs @react-three/rapier',
      });
    }
    return config;
  },
};

export default nextConfig;

