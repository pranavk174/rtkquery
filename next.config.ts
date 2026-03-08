import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    domains: ["picsum.photos", "cdn.dummyjson.com"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withBundleAnalyzer(nextConfig);