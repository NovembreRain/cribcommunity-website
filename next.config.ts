import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ercwbrwfcwydemjdqpaw.supabase.co', // Your specific Supabase ID
        port: '',
        pathname: '/storage/v1/object/public/**', // Allow public storage bucket access
      },
      {
        protocol: 'https',
        hostname: 'travellers-crib.hotelsintamilnadu.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;