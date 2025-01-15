import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  username: z.string().min(3).max(30),
  bio: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
  image: z.union([z.custom<File[]>(), z.string(), z.null()]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
