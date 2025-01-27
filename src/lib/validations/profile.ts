import { z } from "zod";

export const profileParamsSchema = z.object({
  username: z.string().min(1).max(50),
  page: z.coerce.number().int().positive().default(1),
});

export type ProfileParams = z.infer<typeof profileParamsSchema>;
