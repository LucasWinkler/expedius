import type { DbUser } from "@/server/types/db";
import type { Place } from "@/types";

interface GetLikesOptions {
  page?: number;
  limit?: number;
}

interface GetLikesResponse {
  items: Array<{
    placeId: string;
    place: Place;
  }>;
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

export const getLikeStatus = async (placeId: string): Promise<boolean> => {
  const response = await fetch(`/api/likes/${placeId}`);
  if (!response.ok) throw new Error("Failed to check like status");
  const data = await response.json();
  return data.isLiked;
};

export const toggleLike = async (
  placeId: string,
): Promise<{ liked: boolean }> => {
  const response = await fetch("/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeId }),
  });
  if (!response.ok) throw new Error("Failed to toggle like");
  return response.json();
};

export const getLikesByUsername = async (
  username: DbUser["username"],
  options: GetLikesOptions = {},
): Promise<GetLikesResponse> => {
  const searchParams = new URLSearchParams();
  if (options.page) searchParams.set("page", options.page.toString());
  if (options.limit) searchParams.set("limit", options.limit.toString());

  const response = await fetch(
    `/api/users/${username}/likes?${searchParams.toString()}`,
  );
  if (!response.ok) throw new Error("Failed to fetch likes");
  return response.json();
};
