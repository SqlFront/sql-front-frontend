import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@use 'src/styles/variables' as *;`,
  },
};

export default nextConfig;
