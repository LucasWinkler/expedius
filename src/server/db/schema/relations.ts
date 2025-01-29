import { relations } from "drizzle-orm";
import { user } from "./user";
import { list } from "./list";
import { like } from "./like";
import { savedPlace } from "./saved-place";

export const userRelations = relations(user, ({ many }) => ({
  lists: many(list),
  likes: many(like),
}));

export const listRelations = relations(list, ({ one, many }) => ({
  user: one(user, {
    fields: [list.userId],
    references: [user.id],
  }),
  savedPlaces: many(savedPlace),
}));

export const likeRelations = relations(like, ({ one }) => ({
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
}));

export const savedPlaceRelations = relations(savedPlace, ({ one }) => ({
  list: one(list, {
    fields: [savedPlace.listId],
    references: [list.id],
  }),
}));
