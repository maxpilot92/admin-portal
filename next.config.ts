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
};

export default nextConfig;
