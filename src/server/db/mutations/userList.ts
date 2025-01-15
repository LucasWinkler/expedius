import type { User, UserList } from "@/server/db/schema";
import { db } from "@/server/db";
import { userList } from "@/server/db/schema";

export const userListMutations = {
  create: async (data: {
    name: UserList["name"];
    description?: UserList["description"];
    userId: User["id"];
    isPublic?: UserList["isPublic"];
    colour?: UserList["colour"];
    image?: UserList["image"];
    isDefault?: UserList["isDefault"];
  }) => {
    try {
      const [list] = await db
        .insert(userList)
        .values({
          ...data,
          isDefault: data.isDefault ?? false,
        })
        .returning();

      return list;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to create list");
    }
  },

  createDefault: async (userId: User["id"]) => {
    try {
      return userListMutations.create({
        name: "Quick Saves",
        description: "Your default collection for quickly saving places",
        userId,
        isDefault: true,
      });
    } catch (error) {
      console.error("Failed to create default list:", error);
    }
  },
};

export default userListMutations;
