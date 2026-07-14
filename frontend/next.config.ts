import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.haizotech.com' },
      { protocol: 'http', hostname: 'localhost', port: '5001' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return [
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;