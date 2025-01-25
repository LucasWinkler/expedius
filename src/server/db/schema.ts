import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { listColourPresets } from "@/constants";
import { relations } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const rolesEnum = pgEnum("roles", ["user", "admin"]);
export type Role = (typeof rolesEnum.enumValues)[number];

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

export type User = typeof user.$inferSelect;

export const userList = pgTable("user_list", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  colour: text("colour").notNull().default(listColourPresets[0]),
  isPublic: boolean("is_public").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false),
  ...timestamps,
});

export type UserList = typeof userList.$inferSelect;

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

export type Session = typeof session.$inferSelect;

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

export type Account = typeof account.$inferSelect;

export const verification = pgTable("verification", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});

export type Verification = typeof verification.$inferSelect;

export const listPlace = pgTable("list_place", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  listId: uuid("list_id")
    .notNull()
    .references(() => userList.id, { onDelete: "cascade" }),
  placeId: text("place_id").notNull(),
  ...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
  lists: many(userList),
}));

export const userListRelations = relations(userList, ({ one, many }) => ({
  user: one(user, {
    fields: [userList.userId],
    references: [user.id],
  }),
  places: many(listPlace),
}));

export const listPlaceRelations = relations(listPlace, ({ one }) => ({
  list: one(userList, {
    fields: [listPlace.listId],
    references: [userList.id],
  }),
}));

export type ListPlace = typeof listPlace.$inferSelect;
