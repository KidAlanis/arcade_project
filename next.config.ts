import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Preserve main's public CA files for runtime database TLS configuration.
  outputFileTracingIncludes: {
    "/*": ["./certs/*.crt", "./certs/*.cer", "./certs/*.pem"],
  },
};

export default nextConfig;
