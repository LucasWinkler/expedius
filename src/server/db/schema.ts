import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";
import { listColourPresets } from "@/constants";

// Types

export type DbUser = InferSelectModel<typeof user>;
export type DbList = InferSelectModel<typeof list>;
export type DbLike = InferSelectModel<typeof like>;
export type DbSavedPlace = InferSelectModel<typeof savedPlace>;
export type DbSession = InferSelectModel<typeof session>;
export type DbAccount = InferSelectModel<typeof account>;
export type DbVerification = InferSelectModel<typeof verification>;

export type DbListWithPlacesCount = DbList & {
  _count: {
    savedPlaces: number;
  };
};

// Enums

export const rolesEnum = pgEnum("roles", ["user", "admin"]);
export type Role = (typeof rolesEnum.enumValues)[number];

// Timestamps

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// Tables

export const user = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  bio: text("bio"),
  role: rolesEnum("role").notNull().default("user"),
  usernameUpdatedAt: timestamp("username_updated_at", {
    withTimezone: true,
  }),
  isPublic: boolean("is_public").notNull().default(false),
  ...timestamps,
});

export const list = pgTable(
  "list",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    image: text("image"),
    colour: text("colour").notNull().default(listColourPresets[0]),
    isPublic: boolean("is_public").notNull().default(false),
    ...timestamps,
  },
  (table) => [index("list_user_idx").on(table.userId)],
);

export const savedPlace = pgTable(
  "saved_place",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
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

export const session = pgTable("session", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const account = pgTable("account", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
});

export const verification = pgTable("verification", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});

export const like = pgTable(
  "like",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
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

// Relations

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
