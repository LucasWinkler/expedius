"server-only";

import type { DbUser } from "@/server/types/db";
import { getServerSession } from "@/server/auth/session";

export const canViewProfile = async (profileUser: DbUser) => {
  const session = await getServerSession();
  const isOwnProfile = session?.user.id === profileUser.id;

  return {
    canView: isOwnProfile || profileUser.isPublic,
    isOwnProfile,
  };
};
