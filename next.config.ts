
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
    allowedDevOrigins: [
        'https://6000-firebase-studio-1749550509227.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev',
        'https://9000-firebase-studio-1749550509227.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev'
    ],
  },
};

export default nextConfig;
