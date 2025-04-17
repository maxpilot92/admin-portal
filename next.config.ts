import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"],
  },
  experimental: {
    serverActions: {
      // allow up to 5 MB request bodies (you can also use '500kb', '10mb', etc.)
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
