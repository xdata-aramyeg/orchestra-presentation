import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module — keep it external from the server bundle
  // so Next.js doesn't try to bundle its .node binary.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
