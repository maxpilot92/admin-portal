import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://3.26.41.86/:path*", // 👈 AWS API IP
      },
    ];
  },
};

export default nextConfig;
