import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build as static files that Spring Boot can serve at localhost:8080
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // No rewrites needed — API calls go to /api/* which Spring Boot handles directly (same origin)
};

export default nextConfig;
