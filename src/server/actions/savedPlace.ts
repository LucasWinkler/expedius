"use server";

import { savedPlaces } from "@/server/data/savedPlaces";
import { lists } from "@/server/data/lists";
import { getServerSession } from "../auth/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { withActionLimit } from "@/server/lib/rate-limit";
import { userTypePreferences } from "@/server/data/userTypePreferences";
import { getPlaceTypes } from "@/lib/api/places";

const updateSavedPlacesSchema = z.object({
  placeId: z.string(),
  selectedLists: z.array(z.string()),
});

export const updateSavedPlaces = withActionLimit(
  async (input: z.infer<typeof updateSavedPlacesSchema>) => {
    try {
      const session = await getServerSession();
      if (!session) throw new Error("Unauthorized");

      const validation = updateSavedPlacesSchema.safeParse(input);
      if (!validation.success) throw new Error("Invalid input");

      const { placeId, selectedLists } = validation.data;

      const currentLists = await lists.queries.getAllForPlaceCardByUserId(
        session.user.id,
        placeId,
      );

      const currentListIds = new Set(
        currentLists.filter((list) => list.isSelected).map((list) => list.id),
      );
      const newListIds = new Set(selectedLists);

      let wasRemoved = false;
      for (const list of currentLists) {
        if (currentListIds.has(list.id) && !newListIds.has(list.id)) {
          await savedPlaces.mutations.delete(list.id, placeId);
          revalidateTag(`list-${list.id}-places`);
          wasRemoved = true;
        }
      }

      let wasAdded = false;
      for (const listId of newListIds) {
        if (!currentListIds.has(listId)) {
          await savedPlaces.mutations.create({ listId, placeId });
          revalidateTag(`list-${listId}-places`);
          wasAdded = true;
        }
      }

      revalidateTag(`user-${session.user.id}-lists`);
      revalidateTag("user-lists");
      revalidateTag("list-places");

      if (wasAdded) {
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

      return { success: true };
    } catch (error) {
      console.error("[UPDATE_SAVED_PLACES]", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update lists",
      };
    }
  },
  "savePlaces",
);

export const removeFromList = withActionLimit(
  async (listId: string, placeId: string) => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const list = await lists.queries.getById(listId);
    if (!list) throw new Error("List not found");

    if (list.userId !== session.user.id) {
      throw new Error("You don't have permission to modify this list");
    }

    await savedPlaces.mutations.delete(listId, placeId);

    revalidateTag(`list-${listId}-places`);
    revalidateTag(`user-${session.user.id}-lists`);

    return { success: true };
  },
  "removePlaceFromList",
);
