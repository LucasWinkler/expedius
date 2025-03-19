import type { DbUser } from "@/server/types/db";
import type { Place } from "@/types";

export interface PaginatedResponse<T> {
  items: T[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

export interface LikeItem {
  placeId: string;
  place: Place;
}

export type ProfileData = {
  user: DbUser;
  isOwner: boolean;
  totalLikes: number;
  totalLists: number;
};
