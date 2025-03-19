"server-only";

import type { DbUser } from "@/server/types/db";
import { getServerSession } from "@/server/auth/session";

export const canViewProfile = async (profileUser: DbUser) => {
  const session = await getServerSession();
  const isOwner = session?.user.id === profileUser.id;

  return {
    canView: isOwner || profileUser.isPublic,
    isOwner,
  };
};
