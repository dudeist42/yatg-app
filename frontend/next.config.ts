import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.*', '127.0.0.1'],
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  async rewrites() {
    return [
      {
        source: '/api/tmdb-image/:path*',
        destination: `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/t/p/:path*`,
      },
    ];
  },
};

export default nextConfig;
