import type { DbLike, DbListWithPlacesCount } from "@/server/db/schema";

interface UserPlaceDataResponse {
  likes: DbLike[];
  lists: DbListWithPlacesCount[];
}

export const getUserPlaceData = async (): Promise<UserPlaceDataResponse> => {
  const response = await fetch("/api/users/data");
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};
