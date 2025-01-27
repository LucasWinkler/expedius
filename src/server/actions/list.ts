"use server";

import { lists } from "@/server/data/lists";
import { revalidatePath } from "next/cache";
import { getServerSession } from "../auth/session";
import { DbList } from "@/server/db/schema";
import { CreateListInput, createListSchema } from "@/lib/validations/list";

export const createList = async (
  data: Omit<CreateListInput, "image"> & { image?: string },
): Promise<DbList> => {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const validation = createListSchema.safeParse({
    ...data,
    image: data.image ? [data.image] : undefined,
  });

  if (!validation.success) {
    throw new Error("Invalid data provided");
  }

  const newList = await lists.mutations.create(session.user.id, {
    name: data.name,
    description: data.description,
    colour: data.colour,
    isPublic: data.isPublic,
    image: data.image,
  });

  revalidatePath(`/u/${session.user.username}`, "page");
  return newList;
};

export const updateList = async (
  listId: DbList["id"],
  data: Omit<CreateListInput, "image"> & { image?: string | null },
): Promise<DbList> => {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existingList = await lists.queries.getById(listId);
  if (!existingList) {
    throw new Error("List not found");
  }

  if (existingList.userId !== session.user.id) {
    throw new Error("You don't have permission to update this list");
  }

  const validation = createListSchema.safeParse({
    ...data,
    image: data.image ? [data.image] : undefined,
  });

  if (!validation.success) {
    throw new Error("Invalid data provided");
  }

  const updatedList = await lists.mutations.update(listId, {
    name: data.name,
    description: data.description,
    colour: data.colour,
    isPublic: data.isPublic,
    image: data.image,
  });

  revalidatePath(`/u/${session.user.username}`, "page");
  revalidatePath(`/u/${session.user.username}/lists/${listId}`, "layout");

  return updatedList;
};

export const deleteList = async (listId: DbList["id"]) => {
  const session = await getServerSession();
  if (!session) {
    throw new Error("You must be logged in to delete a list");
  }

  const existingList = await lists.queries.getById(listId);
  if (!existingList) {
    throw new Error("List not found");
  }

  if (existingList.userId !== session.user.id) {
    throw new Error("You don't have permission to delete this list");
  }

  await lists.mutations.delete(listId);

  revalidatePath(`/u/${session.user.username}`, "page");
  revalidatePath(`/u/${session.user.username}/lists/${listId}`, "layout");
};
