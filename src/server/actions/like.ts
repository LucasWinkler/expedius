"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "../auth/session";
import { likes } from "@/server/data/likes";
import { z } from "zod";

const batchLikeSchema = z.object({
  placeIds: z.array(z.string().min(1)),
});

export const getLikeStatuses = async (placeIds: string[]) => {
  const session = await getServerSession();
  if (!session) return {};

  const result = batchLikeSchema.safeParse({ placeIds });
  if (!result.success) throw new Error("Invalid place IDs");

  const likedPlaces = await Promise.all(
    placeIds.map(async (placeId) => {
      const like = await likes.queries.getByPlaceId(session.user.id, placeId);
      return [placeId, !!like] as const;
    }),
  );

  return Object.fromEntries(likedPlaces);
};

export const toggleLike = async (placeId: string) => {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const result = await likes.mutations.toggle(session.user.id, placeId);
  revalidateTag("user-likes");
  return result;
};

export const checkLikeStatus = async (placeId: string) => {
  const session = await getServerSession();
  if (!session) return false;

  const like = await likes.queries.getByPlaceId(session.user.id, placeId);
  return !!like;
};
