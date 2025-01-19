import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['dailychineseidioms.com'],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
