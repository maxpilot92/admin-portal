// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // enough for your base64 payload
    },
  },
  async rewrites() {
    return [
      // 1) Bypass the proxy for your upload route
      {
        source: "/api/upload",
        destination: "/api/upload",
      },
      // 2) Everything else still goes to your AWS backend
      {
        source: "/api/:path*",
        destination: "http://54.66.132.165/:path*",
      },
    ];
  },
};

export default nextConfig;
