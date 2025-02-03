export const getPlacePhotoUrl = (
  photoRef: string,
  width = 400,
  height = 400,
) => {
  const encodedRef = encodeURIComponent(photoRef);
  return `/api/places/photo/${encodedRef}?maxHeightPx=${height}&maxWidthPx=${width}`;
};

export const getPriceLevelDisplay = (level?: string): string | null => {
  const priceLevelMap: Record<string, string> = {
    PRICE_LEVEL_FREE: "Free",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  };

  return level ? priceLevelMap[level] : null;
};
