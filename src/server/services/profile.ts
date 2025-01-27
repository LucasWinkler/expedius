"server-only";

import { cache } from "react";
import { getServerSession } from "@/server/auth/session";
import { users } from "@/server/data/users";
import type { DbUser } from "@/server/db/schema";

export interface PublicProfile extends DbUser {
  type: "public";
}

export interface PrivateProfile {
  username: string;
  type: "private";
}

export type ProfileResponse = PublicProfile | PrivateProfile;

export const getUser = cache(
  async (username: string): Promise<ProfileResponse | null> => {
    if (!username) return null;

    const user = await users.queries.getByUsername(username);
    if (!user) return null;

    const session = await getServerSession();
    const isOwnProfile = session?.user.id === user.id;

    if (!isOwnProfile && !user.isPublic) {
      return {
        username: user.username,
        type: "private",
      };
    }

    return {
      ...user,
      type: "public",
    };
  },
);
