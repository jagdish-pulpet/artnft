
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false, // Changed to false for stricter checks
  },
  eslint: {
    ignoreDuringBuilds: false, // Changed to false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        port: '',
        pathname: '/static/img/coins/**',
      }
    ],
  },
  experimental: {
    // If you were using experimental.outputFileTracingRoot for monorepo:
    // outputFileTracingRoot: require('path').join(__dirname, '../../'), 
  },
  // To make Turbopack work better with symlinked packages in a monorepo
  // webpack: (config, { isServer }) => {
  //   config.resolve.symlinks = false;
  //   return config;
  // },
};

export default nextConfig;
