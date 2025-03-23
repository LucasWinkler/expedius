import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Expedius",
    short_name: "Expedius",
    description:
      "Find, organize, and share your favourite places from around the world.",
    start_url: "/",
    id: "/",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#2563eb",
    background_color: "#ffffff",
    display: "standalone",
    categories: ["travel", "maps", "navigation"],
    orientation: "portrait",
    prefer_related_applications: false,
    display_override: ["standalone", "minimal-ui"],
    launch_handler: {
      client_mode: ["navigate-existing", "auto"],
    },
    scope: "/",
    lang: "en",
    dir: "ltr",
  };
}
