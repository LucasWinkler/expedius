import { toggleLike } from "@/server/actions/like";

export const checkIfPlaceLiked = async (placeId: string) => {
  const response = await fetch(`/api/likes/${placeId}`);
  if (!response.ok) throw new Error("Failed to check like status");
  const data = await response.json();
  return data.isLiked;
};

export const togglePlaceLike = async (placeId: string) => {
  const response = await toggleLike(placeId);
  return response;
};
