import type { SQL } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const lower = (email: AnyPgColumn): SQL => {
  return sql`lower(${email})`;
};
