import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["picsum.photos", "cdn.dummyjson.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
