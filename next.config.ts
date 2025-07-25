import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['chineseidioms.com', 'www.chineseidioms.com'],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
