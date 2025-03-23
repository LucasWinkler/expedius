import type { Metadata } from "next";
import { env } from "@/env";

interface OpenGraphConfig {
  title?: string;
  description?: string;
  canonicalUrlRelative?: string;
}

export const createMetadata = ({
  title,
  description,
  canonicalUrlRelative,
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
    applicationName: "Expedius",
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
          alt: "Homepage screenshot saying Discover your next adventure with a search bar and search suggestions",
          type: "image/png",
        },
      ],
    },
    twitter: {
      creator: "@LucasJWinkler",
      card: "summary_large_image",
    },
    ...(canonicalUrlRelative && {
      alternates: {
        canonical: canonicalUrlRelative,
      },
    }),
    authors: {
      name: "Lucas Winkler",
      url: "https://www.lucaswinkler.dev",
    },
    publisher: "Lucas Winkler",
    creator: "Lucas Winkler",
    other: {
      thumbnail: `${baseUrl.origin}/og.png`,
    },
  };
};
