import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return [
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*` // Proxy to Backend Uploads
      },
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
