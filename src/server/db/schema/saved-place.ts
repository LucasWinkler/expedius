import { text, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { timestamps, primaryKey } from "./common";
import { list } from "./list";

export const savedPlace = pgTable(
  "saved_place",
  {
    id: primaryKey(),
    listId: uuid("list_id")
      .notNull()
      .references(() => list.id, { onDelete: "cascade" }),
    placeId: text("place_id").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("saved_place_list_place_idx").on(table.listId, table.placeId),
    index("saved_place_list_idx").on(table.listId),
  ],
);
