import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
  colour: z
    .string()
    .min(1, "Color is required")
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  image: z.union([z.custom<File[]>(), z.string(), z.null()]).optional(),
});

export type CreateListInput = z.infer<typeof createListSchema>;
