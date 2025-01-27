import type { SavedPlacesResponse, SavedPlace } from "./types";

export const getSavedPlaces = async (
  listId: string,
  { page = 1, limit = 20 } = {},
) => {
  const response = await fetch(
    `/api/lists/${listId}/places?page=${page}&limit=${limit}`,
  );
  if (!response.ok) throw new Error("Failed to fetch saved places");
  return response.json() as Promise<SavedPlacesResponse>;
};

export const savePlaceToList = async (listId: string, placeId: string) => {
  const response = await fetch(`/api/lists/${listId}/places`, {
    method: "POST",
    body: JSON.stringify({ placeId }),
  });
  if (!response.ok) throw new Error("Failed to save place");
  return response.json() as Promise<SavedPlace>;
}; 