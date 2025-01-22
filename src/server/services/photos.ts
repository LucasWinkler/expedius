"server-only";

import { cache } from "react";
import { env } from "@/env";
import { getPlacePhotoUrl } from "@/lib/utils";
import { getPlaiceholder } from "plaiceholder";

export const getEnhancedPlacePhoto = cache(async (photoRef: string) => {
  try {
    const apiUrl = `${env.BETTER_AUTH_URL}${getPlacePhotoUrl(photoRef)}`;
    const res = await fetch(apiUrl, {
      next: { revalidate: 604800 }, // Cache for 1 week
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch photo: ${res.statusText}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const {
      base64,
      metadata: { height, width },
    } = await getPlaiceholder(buffer);

    return {
      url: getPlacePhotoUrl(photoRef),
      blurDataURL: base64,
      height,
      width,
    };
  } catch (error) {
    console.error("Error processing place photo:", error);
    throw error;
  }
});
