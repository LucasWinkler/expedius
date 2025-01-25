import { z } from "zod";

const baseListSchema = {
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
  colour: z
    .string()
    .min(1, "Color is required")
    .regex(
      /^oklch\(\s*[0-9.]+\s+[0-9.]+\s+[0-9.]+\s*\)$/,
      "Invalid OKLCH color",
    ),
};

export const createListSchema = z.object({
  ...baseListSchema,
  image: z
    .union([z.custom<File[]>(), z.undefined()])
    .optional()
    .refine(
      (files) => {
        if (!files?.[0]) return true;
        return files[0].size <= 4 * 1024 * 1024;
      },
      {
        message: "Image must be less than 4MB",
      },
    ),
});

export const editListSchema = z.object({
  ...baseListSchema,
  image: z
    .union([z.custom<File[]>(), z.string(), z.null(), z.undefined()])
    .optional()
    .refine(
      (files) => {
        if (!files || typeof files === "string" || files === null) return true;
        if (!files[0]) return true;
        return files[0].size <= 4 * 1024 * 1024;
      },
      {
        message: "Image must be less than 4MB",
      },
    ),
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type EditListInput = z.infer<typeof editListSchema>;
