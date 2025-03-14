"use server";

import { lists } from "@/server/data/lists";
import { revalidateTag } from "next/cache";
import { getServerSession } from "../auth/session";
import type { DbList } from "@/server/types/db";
import {
  CreateListRequest,
  createListServerSchema,
  UpdateListRequest,
  updateListServerSchema,
} from "@/server/validations/lists";
import { withActionLimit } from "@/server/lib/rate-limit";

export const createList = withActionLimit(
  async (
    data: CreateListRequest,
  ): Promise<{ success: boolean; data?: DbList; error?: string }> => {
    try {
      const session = await getServerSession();
      if (!session) return { success: false, error: "Unauthorized" };

      const validation = createListServerSchema.safeParse(data);
      if (!validation.success)
        return { success: false, error: "Invalid data provided" };

      const existingList = await lists.queries.getByNameAndUserId(
        validation.data.name,
        session.user.id,
      );
      if (existingList) {
        return {
          success: false,
          error: "You already have a list with this name",
        };
      }

      const newList = await lists.mutations.create(
        session.user.id,
        validation.data,
      );

      revalidateTag("user-lists");
      revalidateTag(`user-${session.user.id}-lists`);

      return { success: true, data: newList };
    } catch (e) {
      console.error("Error creating list:", e);
      return { success: false, error: "Failed to create list" };
    }
  },
  "lists",
);

export const updateList = withActionLimit(
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

    if (validation.data.name && validation.data.name !== existingList.name) {
      const nameExists = await lists.queries.getByNameAndUserId(
        validation.data.name,
        session.user.id,
      );
      if (nameExists && nameExists.id !== listId) {
        throw new Error("You already have a list with this name");
      }
    }

    const updatedList = await lists.mutations.update(listId, validation.data);

    revalidateTag("user-lists");
    revalidateTag(`user-${session.user.id}-lists`);
    revalidateTag(`list-${listId}`);

    return updatedList;
  },
  "lists",
);

export const deleteList = withActionLimit(async (listId: DbList["id"]) => {
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
