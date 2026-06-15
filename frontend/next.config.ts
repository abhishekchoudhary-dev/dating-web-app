import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    },
    devIndicators:false
};

export default nextConfig;
