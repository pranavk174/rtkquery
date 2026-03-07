import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['https://picsum.photos', 'https://cdn.dummyjson.com']
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
