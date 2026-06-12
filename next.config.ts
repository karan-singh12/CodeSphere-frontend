import type { NextConfig } from "next";

const getBackendUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  return url;
};

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@cline/sdk",
    "@cline/core",
    "@cline/agents",
    "@cline/llms",
    "@cline/shared",
  ],
  async rewrites() {
    const backendUrl = getBackendUrl();
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`, // Proxy API requests to Express
      },
    ];
  },
};

export default nextConfig;
