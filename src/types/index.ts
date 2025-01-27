// API/External types
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

// Business/Domain types
export interface UserList {
  id: string;
  name: string;
  description?: string;
  image?: string;
  colour: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  savedPlaces?: SavedPlace[];
}

export interface SavedPlace {
  id: string;
  listId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
  place?: Place;
}

export interface Like {
  id: string;
  userId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
  place?: Place;
}

// API Response types
export interface PlaceSearchResponse {
  places: Place[];
}

export interface ListResponse {
  list: UserList;
  savedPlaces: SavedPlace[];
}

export interface LikeResponse {
  liked: boolean;
}
