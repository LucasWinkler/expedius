import { DbList } from "@/server/db/schema";
import type { ListsResponse, ListsWithCountResponse } from "./types";
import { CreateListInput, UpdateListInput } from "../validations/list";
import { ListForPlaceCard } from "@/types";

export const getLists = async ({ page = 1, limit = 10 } = {}) => {
  const response = await fetch(`/api/lists?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch lists");
  return response.json() as Promise<ListsResponse>;
};

export const getList = async (id: string) => {
  const response = await fetch(`/api/lists/${id}`);
  if (!response.ok) throw new Error("Failed to fetch list");
  return response.json() as Promise<DbList>;
};

export const createList = async (data: CreateListInput) => {
  const response = await fetch("/api/lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create list");
  return response.json() as Promise<DbList>;
};

export const updateList = async (id: string, data: UpdateListInput) => {
  const response = await fetch(`/api/lists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update list");
  return response.json() as Promise<DbList>;
};

export const getListsByUsername = async (
  username: string,
  { page = 1, limit = 12 } = {},
) => {
  const response = await fetch(
    `/api/users/${username}/lists?page=${page}&limit=${limit}`,
  );
  if (!response.ok) throw new Error("Failed to fetch user lists");
  return response.json() as Promise<ListsWithCountResponse>;
};

export const getListsForPlaceCard = async (placeId: string) => {
  const response = await fetch(`/api/lists/place/${placeId}`);
  if (!response.ok) throw new Error("Failed to fetch lists");
  return response.json() as Promise<ListForPlaceCard[]>;
};
