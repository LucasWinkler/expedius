"use client";

import dynamic from "next/dynamic";

const ParallaxDestinations = dynamic(
  () =>
    import("./ParallaxDestinations").then((mod) => mod.ParallaxDestinations),
  { ssr: false, loading: () => null },
);

export function ParallaxDestinationsWrapper() {
  return <ParallaxDestinations />;
}
