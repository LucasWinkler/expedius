import { text, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { timestamps, primaryKey } from "./common";
import { user } from "./user";

export const like = pgTable(
  "like",
  {
    id: primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    placeId: text("place_id").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("like_user_place_idx").on(table.userId, table.placeId),
    index("like_user_idx").on(table.userId),
  ],
);
