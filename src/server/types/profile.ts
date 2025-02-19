import type { DbUser } from "@/server/types/db";
import type { lists } from "@/server/data/lists";
import type { Place } from "@/types";

interface PaginatedResponse<T> {
  items: T[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

interface LikeItem {
  placeId: string;
  place: Place;
}

export type PublicProfileData = {
  user: DbUser & { type: "public" };
  lists: Awaited<ReturnType<typeof lists.queries.getAllByUserId>>;
  likes: PaginatedResponse<LikeItem>;
  isOwnProfile: boolean;
  totalLikes: number;
};

export type PrivateProfileData = {
  username: string;
  type: "private";
};

export type ProfileData = PublicProfileData | PrivateProfileData;
