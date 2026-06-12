import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@cline/sdk",
    "@cline/core",
    "@cline/agents",
    "@cline/llms",
    "@cline/shared",
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4000/api/:path*", // Proxy API requests to Express
      },
    ];
  },
};

export default nextConfig;
