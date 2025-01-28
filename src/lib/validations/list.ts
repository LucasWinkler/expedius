import { maxNameLength } from "@/constants";
import { minNameLength } from "@/constants";
import { z } from "zod";

export const listImageSchema = z
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

export const listSchema = z.object({
  name: z
    .string()
    .min(minNameLength, `Name must be at least ${minNameLength} characters`)
    .max(maxNameLength, `Name must be less than ${maxNameLength} characters`),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional().default(false),
  colour: z
    .string()
    .min(1, "Color is required")
    .regex(
      /^(#[0-9A-Fa-f]{6}|oklch\(\s*[0-9.]+\s+[0-9.]+\s+[0-9.]+\s*\)|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\))$/,
      "Invalid color format. Must be hex, OKLCH, RGB, or HSL",
    ),
  image: listImageSchema,
});

export const createListSchema = listSchema;
export const updateListSchema = createListSchema.partial();

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
