export type PlacePhoto = {
  name: string;
  widthPx: number;
  heightPx: number;
};

export type Place = {
  id: string;
  formattedAddress: string;
  rating?: number;
  priceLevel?: string;
  userRatingCount?: number;
  displayName: {
    text: string;
    languageCode: string;
  };
  photos?: PlacePhoto[];
  image?: {
    url: string;
    blurDataURL: string;
    height: number;
    width: number;
  };
};

export interface PlaceSearchResponse {
  places: Place[];
}
