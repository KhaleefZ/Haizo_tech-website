import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*` // Proxy to Backend
      },
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*` // Proxy to Backend Uploads
      }
    ];
  }
};

export default nextConfig;
