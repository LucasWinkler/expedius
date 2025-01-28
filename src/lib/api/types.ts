import { DbListWithPlacesCount } from "@/server/db/schema";
import type { List, SavedPlace } from "@/types";

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

export type ListsResponse = PaginatedResponse<List>;
export type ListsWithCountResponse = PaginatedResponse<DbListWithPlacesCount>;
export type SavedPlacesResponse = PaginatedResponse<SavedPlace>;
export type { List, SavedPlace };
