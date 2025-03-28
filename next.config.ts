import type { NextConfig } from "next";
import withPlaiceholder from "@plaiceholder/next";
import { env } from "./src/env";
import nextBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${env.UPLOADTHING_APP_ID}/*`,
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "places.googleapis.com",
        pathname: "/v1/places/**",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
    ],
  },
  compiler: {
    removeConsole:
      env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withPlaiceholder(nextConfig));
