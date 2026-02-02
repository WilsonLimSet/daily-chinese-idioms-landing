import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    domains: ['chineseidioms.com', 'www.chineseidioms.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect non-www to www
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
      // Fix malformed URLs with $ character
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      // Redirects for old translated listicle slugs (slugs changed during translation regeneration)
      {
        source: '/th/blog/lists/samnuan-jiin-wan-pii-mai',
        destination: '/th/blog/lists/samnuuk-chin-wan-pi-mai',
        permanent: true,
      },
      {
        source: '/ja/blog/lists/sotsugyou-shiki-chuugokugo-kanyouku',
        destination: '/ja/blog/lists/sotsugyou-shiki-no-chuugokugo-ijisetto',
        permanent: true,
      },
      {
        source: '/ko/blog/lists/ujong-e-daehan-uimi-inneun-junggugeo-sogeo-8gae',
        destination: '/ko/blog/lists/ujong-e-daehan-jungguk-seogeo',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
