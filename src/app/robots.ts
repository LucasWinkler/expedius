import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/auth/",
    },
    sitemap: "https://www.expedius.app/sitemap.xml",
  };
}
