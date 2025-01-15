import type { User } from "@/server/db/schema";
import { db } from "@/server/db";

export const userQueries = {
  getByUsername: async (username: User["username"]) => {
    try {
      return await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch user");
    }
  },
  getById: async (id: User["id"]) => {
    try {
      return await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch user");
    }
  },
};

export default userQueries;
