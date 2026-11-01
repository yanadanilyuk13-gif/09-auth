import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
      },
    ],
  },
};

export default nextConfig;
