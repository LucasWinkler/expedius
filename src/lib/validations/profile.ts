import { z } from "zod";
import { PAGINATION } from "@/constants";

const usernameSchema = z.string().min(1).max(50).toLowerCase();

export const profileParamsSchema = z.object({
  username: usernameSchema,
});

export type ProfileParams = z.infer<typeof profileParamsSchema>;

export const profileLikesParamsSchema = z.object({
  username: usernameSchema,
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(PAGINATION.ITEMS_PER_PAGE),
});

export type ProfileLikesParams = z.infer<typeof profileLikesParamsSchema>;

export const profileListsParamsSchema = z.object({
  username: usernameSchema,
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(PAGINATION.ITEMS_PER_PAGE),
});

export type ProfileListsParams = z.infer<typeof profileListsParamsSchema>;
