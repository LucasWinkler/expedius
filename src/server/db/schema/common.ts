import { pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";
import { listColourPresets } from "@/constants";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const defaultColor = listColourPresets[0];

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
} as const;

export const primaryKey = () =>
  uuid("id").notNull().primaryKey().defaultRandom().unique();
