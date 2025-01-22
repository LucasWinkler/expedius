import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",

        hostname: "utfs.io",
      },
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      // },
    ],
  },
};

export default withPlaiceholder(nextConfig);
