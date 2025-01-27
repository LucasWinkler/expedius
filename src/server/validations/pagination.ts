import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be greater than 0")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit cannot exceed 100")
    .default(20),
});

export type PaginationRequest = z.infer<typeof paginationSchema>; 