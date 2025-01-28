import { PAGINATION } from "@/constants";
import { z } from "zod";

export const profileParamsSchema = z.object({
  username: z.string().min(1).max(50),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(PAGINATION.ITEMS_PER_PAGE),
});

export type ProfileParams = z.infer<typeof profileParamsSchema>;
