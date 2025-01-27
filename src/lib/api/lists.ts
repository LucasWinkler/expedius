import type { ListsResponse } from "./types";
import type { CreateListInput, UpdateListInput } from "@/types";

export const getLists = async ({ page = 1, limit = 10 } = {}) => {
  const response = await fetch(`/api/lists?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch lists");
  return response.json() as Promise<ListsResponse>;
};

export const getList = async (id: string) => {
  const response = await fetch(`/api/lists/${id}`);
  if (!response.ok) throw new Error("Failed to fetch list");
  return response.json() as Promise<List>;
};

export const createList = async (data: CreateListInput) => {
  const response = await fetch("/api/lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create list");
  return response.json() as Promise<List>;
};

export const updateList = async (id: string, data: UpdateListInput) => {
  const response = await fetch(`/api/lists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update list");
  return response.json() as Promise<List>;
};
