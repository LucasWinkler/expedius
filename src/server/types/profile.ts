import type { DbUser } from "@/server/types/db";
import type { lists } from "@/server/data/lists";

export type PublicProfileData = {
  user: DbUser & { type: "public" };
  lists: Awaited<ReturnType<typeof lists.queries.getAllByUserId>>;
  isOwnProfile: boolean;
  totalLikes: number;
};

export type PrivateProfileData = {
  username: string;
  type: "private";
};

export type ProfileData = PublicProfileData | PrivateProfileData;
