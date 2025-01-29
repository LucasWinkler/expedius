import { maxUsernameLength, minUsernameLength } from "@/constants";
import { z } from "zod";

const profileImageSchema = z
  .union([z.custom<File>(), z.null(), z.undefined()])
  .optional()
  .refine(
    (file) => {
      if (!file || file === null) return true;
      return file.size <= 4 * 1024 * 1024;
    },
    {
      message: "Image must be less than 4MB",
    },
  );

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
  image: profileImageSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
