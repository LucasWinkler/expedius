import type { DbUser } from "@/server/db/schema";
import type { lists } from "@/server/data/lists";

export interface PublicProfileData {
  user: DbUser & { type: "public" };
  lists: Awaited<ReturnType<typeof lists.queries.getAllByUserId>>;
  isOwnProfile: boolean;
  totalLikes: number;
}

export interface PrivateProfileData {
  username: string;
  type: "private";
}

export type ProfileData = PublicProfileData | PrivateProfileData;
