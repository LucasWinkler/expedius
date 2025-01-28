import { LikeStatuses } from "./types";

export const getLikeStatuses = async (
  placeIds: string[],
): Promise<LikeStatuses> => {
  const response = await fetch(
    `/api/likes/status?placeIds=${placeIds.join(",")}`,
  );
  if (!response.ok) throw new Error("Failed to get like statuses");
  return response.json();
};
