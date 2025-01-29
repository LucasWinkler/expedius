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
