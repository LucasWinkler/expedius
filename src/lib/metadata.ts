import type { Metadata } from "next";
import { env } from "@/env";

interface OpenGraphConfig {
  title?: string;
  description?: string;
}

export const createMetadata = ({
  title,
  description,
}: OpenGraphConfig): Metadata => {
  const baseTitle = title
    ? `${title} - Expedius`
    : "Discover your next adventure - Expedius";
  const baseDescription =
    description ||
    "Find and save your favourite places near you or anywhere in the world with Expedius. Create custom lists and share your public profile with others.";
  const baseUrl = new URL(env.NEXT_PUBLIC_BASE_URL);

  return {
    title: baseTitle,
    description: baseDescription,
    metadataBase: baseUrl,
    openGraph: {
      type: "website",
      url: baseUrl,
      title: baseTitle,
      description: baseDescription,
      siteName: "Expedius",
      images: [
        {
          url: `/og.png`,
          width: 1200,
          height: 630,
          alt: "Homepage screenshot showing a hero section with a search bar and suggested search terms.",
          type: "image/png",
        },
      ],
    },
    twitter: {
      creator: "@LucasJWinkler",
      card: "summary_large_image",
    },
  };
};
