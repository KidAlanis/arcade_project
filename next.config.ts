import type { NextConfig } from "next";

const config: NextConfig = {
  // Certificate paths are runtime inputs. Include only the public CA files,
  // rather than making dynamic fs reads watch the entire workspace in dev.
  outputFileTracingIncludes: {
    "/*": ["./certs/*.crt", "./certs/*.cer", "./certs/*.pem"],
  },
};
export default config;
