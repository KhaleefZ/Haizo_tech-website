import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = (envApiUrl && envApiUrl !== 'undefined') ? envApiUrl : 'http://localhost:5001';
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
