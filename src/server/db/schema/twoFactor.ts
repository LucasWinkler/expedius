import { text, uuid, boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./user";
import { primaryKey, timestamps } from "./common";

export const twoFactorEnabledField = {
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
};

export const twoFactor = pgTable("two_factor", {
  id: primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  ...timestamps,
});
