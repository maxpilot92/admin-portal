import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // adjust higher than your largest base64 payload
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://54.66.132.165/:path*", // 👈 AWS API IP
      },
    ];
  },
};

export default nextConfig;
