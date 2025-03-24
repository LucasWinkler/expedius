import { text, uuid, integer, index, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { timestamps, primaryKey } from "./common";
import { user } from "./user";

export const userPrimaryTypePreference = pgTable(
  "user_primary_type_preference",
  {
    id: primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    placeType: text("place_type").notNull(),
    count: integer("count").notNull().default(1),
    ...timestamps,
  },
  (table) => [
    index("primary_type_user_idx").on(table.userId),
    uniqueIndex("primary_type_user_place_type_idx").on(
      table.userId,
      table.placeType,
    ),
  ],
);

export const userTypePreference = pgTable(
  "user_type_preference",
  {
    id: primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    placeType: text("place_type").notNull(),
    count: integer("count").notNull().default(1),
    ...timestamps,
  },
  (table) => [
    index("type_user_idx").on(table.userId),
    uniqueIndex("type_user_place_type_idx").on(table.userId, table.placeType),
  ],
);
