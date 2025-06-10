
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
    // allowedDevOrigins: ['https://9000-firebase-studio-1749297919077.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev'], // Removed due to unrecognized key error
  },
};

export default nextConfig;
