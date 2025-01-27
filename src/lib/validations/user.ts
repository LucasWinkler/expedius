import { maxUsernameLength, minUsernameLength } from "@/constants";
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  username: z
    .string()
    .trim()
    .min(
      minUsernameLength,
      `Username must be at least ${minUsernameLength} characters`,
    )
    .max(
      maxUsernameLength,
      `Username must be less than ${maxUsernameLength} characters`,
    )
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores and dashes",
    ),
  bio: z.string().trim().max(500).optional(),
  isPublic: z.boolean().optional(),
  image: z.union([z.custom<File[]>(), z.string(), z.null()]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
