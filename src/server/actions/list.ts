"use server";

import { lists } from "@/server/data/lists";
import { revalidateTag } from "next/cache";
import { getServerSession } from "../auth/session";
import { DbList } from "@/server/db/schema";
import {
  CreateListRequest,
  createListServerSchema,
  UpdateListRequest,
  updateListServerSchema,
} from "@/server/validations/lists";
import { withRateLimit } from "@/server/lib/rate-limit";

export const createList = withRateLimit(
  async (data: CreateListRequest): Promise<DbList> => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const validation = createListServerSchema.safeParse(data);
    if (!validation.success) throw new Error("Invalid data provided");

    const newList = await lists.mutations.create(
      session.user.id,
      validation.data,
    );

    revalidateTag("user-lists");
    revalidateTag(`user-${session.user.id}-lists`);

    return newList;
  },
  "lists",
);

export const updateList = withRateLimit(
  async (listId: DbList["id"], data: UpdateListRequest): Promise<DbList> => {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const existingList = await lists.queries.getById(listId);
    if (!existingList) {
      throw new Error("List not found");
    }

    if (existingList.userId !== session.user.id) {
      throw new Error("You don't have permission to update this list");
    }

    const validation = updateListServerSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("Invalid data provided");
    }

    const updatedList = await lists.mutations.update(listId, validation.data);

    revalidateTag("user-lists");
    revalidateTag(`user-${session.user.id}-lists`);
    revalidateTag(`list-${listId}`);

    return updatedList;
  },
  "lists",
);

export const deleteList = withRateLimit(async (listId: DbList["id"]) => {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const existingList = await lists.queries.getById(listId);
  if (!existingList) {
    throw new Error("List not found");
  }

  if (existingList.userId !== session.user.id) {
    throw new Error("You don't have permission to delete this list");
  }

  await lists.mutations.delete(listId);

  revalidateTag("user-lists");
  revalidateTag(`user-${session.user.id}-lists`);
  revalidateTag(`list-${listId}`);
  revalidateTag("list-places");

  return { success: true };
}, "lists");
