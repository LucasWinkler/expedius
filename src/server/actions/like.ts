"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "../auth/session";
import { likes } from "@/server/data/likes";
import { withActionLimit } from "../lib/rate-limit";
import { userTypePreferences } from "@/server/data/userTypePreferences";
import { getPlaceTypes } from "@/lib/api/places";

export const toggleLike = withActionLimit(async (placeId: string) => {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const result = await likes.mutations.toggle(session.user.id, placeId);

  revalidateTag("user-likes");
  revalidateTag(`like-${session.user.id}-${placeId}`);
  revalidateTag(`user-${session.user.id}-likes-statuses`);

  if (result.liked === true) {
    try {
      const placeTypes = await getPlaceTypes(placeId);

      if (placeTypes) {
        await userTypePreferences.mutations.trackPlaceTypes(
          session.user.id,
          placeTypes.primaryType || null,
          placeTypes.types || [],
        );
      }
    } catch (error) {
      console.error("Failed to update type preferences:", error);
    }
  }

  return result;
}, "likes");
