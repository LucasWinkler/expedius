import type { List, SavedPlace } from "@/types";
import type { DbListWithPlacesCount } from "@/server/types/db";
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

export type ListsResponse = PaginatedResponse<List>;
export type ListsWithCountResponse = PaginatedResponse<DbListWithPlacesCount>;
export type SavedPlacesResponse = PaginatedResponse<SavedPlace>;
export type { List, SavedPlace };
