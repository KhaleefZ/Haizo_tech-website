import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5001/uploads/:path*' // Proxy to Backend Uploads
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*'
      }
    ];
  }
};

export default nextConfig;
