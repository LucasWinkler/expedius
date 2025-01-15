import { and, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { userList } from "@/server/db/schema";
import type { User } from "@/server/db/schema";
import { getServerSession } from "@/lib/auth/session";

export const userListQueries = {
  getListsByUserId: async (userId: User["id"]) => {
    try {
      const session = await getServerSession();
      const isOwnProfile = session?.user.id === userId;

      const lists = await db.query.userList.findMany({
        where: isOwnProfile
          ? eq(userList.userId, userId)
          : and(eq(userList.userId, userId), eq(userList.isPublic, true)),
        orderBy: (lists, { desc }) => [desc(lists.createdAt)],
      });
      return lists;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch lists");
    }
  },

  getListsCount: async (userId: User["id"]) => {
    try {
      const session = await getServerSession();
      const isOwnProfile = session?.user.id === userId;

      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(userList)
        .where(
          isOwnProfile
            ? eq(userList.userId, userId)
            : and(eq(userList.userId, userId), eq(userList.isPublic, true)),
        );

      return Number(result[0]?.count) || 0;
    } catch (error) {
      console.error("Database error:", error);
      return 0;
    }
  },

  getById: async (id: string) => {
    try {
      const list = await db.query.userList.findFirst({
        where: eq(userList.id, id),
      });
      return list;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch list");
    }
  },
};

export default userListQueries;
