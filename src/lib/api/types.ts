import type { List, SavedPlace } from "@/types";
import type { DbListWithPlacesCount } from "@/server/types/db";
import type { Place } from "@/types";

export interface PaginatedResponse<T> {
  items: T[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface LikeStatuses {
  [placeId: string]: boolean;
}

export interface SavedPlaceWithPlace {
  id: string;
  listId: string;
  placeId: string;
  createdAt: Date;
  updatedAt: Date;
  place: Place;
}

export type ListsResponse = PaginatedResponse<List>;
export type ListsWithCountResponse = PaginatedResponse<DbListWithPlacesCount>;
export type SavedPlacesResponse = PaginatedResponse<SavedPlaceWithPlace>;
export type { List, SavedPlace };
