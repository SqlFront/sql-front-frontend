import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@use 'src/styles/variables' as *;`,
  },
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_BACKEND_URL ||
      (process.env.NODE_ENV === "development"
        ? (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000")
        : "http://backend:8000");

    return [
      {
        source: "/admin/:path*",
        destination: `${backendUrl}/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
