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
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*' // Proxy to Backend
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5001/uploads/:path*' // Proxy to Backend Uploads
      }
    ];
  }
};

export default nextConfig;
