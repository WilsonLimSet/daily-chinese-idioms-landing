import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['chineseidioms.com', 'www.chineseidioms.com'],
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'chineseidioms.com',
          },
        ],
        destination: 'https://www.chineseidioms.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
