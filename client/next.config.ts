import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/ClickClack',
  assetPrefix: '/ClickClack',
  // Enable static HTML export
  output: 'export',
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
