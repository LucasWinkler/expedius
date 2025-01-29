import { LikeStatuses } from "@/lib/api/types";

import type { DbListWithPlacesCount } from "@/server/types/db";

export * from "./pagination";

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
export interface List {
  id: string;
  userId: string;
  name: string;
  description?: string;
  image?: string;
  colour: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedPlace {
  id: string;
  listId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
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
  likeStatuses: LikeStatuses;
  userLists: DbListWithPlacesCount[];
}

export interface ListResponse {
  list: List;
  savedPlaces: SavedPlace[];
}

export interface LikeResponse {
  liked: boolean;
}

export interface ListForPlaceCard {
  id: List["id"];
  name: List["name"];
  userId: List["userId"];
  isSelected?: boolean;
}
