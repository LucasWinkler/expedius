import type { InferSelectModel } from "drizzle-orm";
import type {
  user,
  list,
  like,
  savedPlace,
  session,
  account,
  verification,
  userRole,
} from "../db/schema";

export type DbUser = InferSelectModel<typeof user>;

export type DbList = InferSelectModel<typeof list>;

export type DbLike = InferSelectModel<typeof like>;

export type DbSavedPlace = InferSelectModel<typeof savedPlace>;

export type DbSession = InferSelectModel<typeof session>;

export type DbAccount = InferSelectModel<typeof account>;

export type DbVerification = InferSelectModel<typeof verification>;

export type DbRole = (typeof userRole.enumValues)[number];

export type DbListWithPlacesCount = DbList & {
  _count: {
    savedPlaces: number;
  };
  savedPlaces?: {
    placeId: string;
  }[];
};
