import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@use 'src/styles/variables' as *;`,
  },
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_BACKEND_URL ||
      (process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_BACKEND_URL && !process.env.NEXT_PUBLIC_BACKEND_URL.includes("localhost")
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://backend:8000")
        : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"));

    return [
      {
        source: "/admin/:path*",
        destination: `${backendUrl}/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
