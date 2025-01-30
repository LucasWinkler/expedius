import { text, uuid, index, boolean, unique } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { defaultColor, timestamps, primaryKey } from "./common";
import { user } from "./user";

export const list = pgTable(
  "list",
  {
    id: primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    image: text("image"),
    colour: text("colour").notNull().default(defaultColor),
    isPublic: boolean("is_public").notNull().default(false),
    ...timestamps,
  },
  (table) => [
    index("list_user_idx").on(table.userId),
    unique("list_user_slug_idx").on(table.userId, table.slug),
  ],
);
