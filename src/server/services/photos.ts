import "server-only";

import { env } from "@/env";
import { getPlacePhotoUrl } from "@/lib/place";
import { getPlaiceholder } from "plaiceholder";
import { Place } from "@/types";

export const getEnhancedPlacePhoto = async (photoRef: string) => {
  try {
    const apiUrl = `${env.NEXT_PUBLIC_BASE_URL}${getPlacePhotoUrl(photoRef)}`;
    const res = await fetch(apiUrl);

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
};

export const processPlaceThumbnail = async (place: Place): Promise<Place> => {
  try {
    if (!place.photos?.[0]) {
      return place;
    }

    return {
      ...place,
      image: await getEnhancedPlacePhoto(place.photos[0].name),
    };
  } catch (error) {
    console.warn(`Failed to process photo for place ${place.id}:`, error);
    return place;
  }
};
