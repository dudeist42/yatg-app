import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  async rewrites() {
    return [
      {
        source: '/api/tmdb-image/:path*',
        destination: 'https://image.tmdb.org/t/p/:path*',
      },
    ];
  },
};

export default nextConfig;
