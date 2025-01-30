import {
  listColourPresets,
  maxUsernameLength,
  minUsernameLength,
} from "@/constants";
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

export const usernameSchema = z
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
  colour: z
    .string()
    .min(1, "Colour is required")
    .regex(
      /^(#[0-9A-Fa-f]{6}|oklch\(\s*[0-9.]+\s+[0-9.]+\s+[0-9.]+\s*\)|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\))$/,
      "Invalid color format. Must be hex, OKLCH, RGB, or HSL",
    )
    .default(listColourPresets[0]),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
