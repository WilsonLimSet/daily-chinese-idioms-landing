import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    inlineCss: true,
  },
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
