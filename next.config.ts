import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";
import { env } from "./src/env";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${env.UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
