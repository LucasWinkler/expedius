import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";
import { env } from "./src/env";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${env.UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: "/f/*",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
