import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  colour: z.string().min(1, "Colour is required"),
  isPublic: z.boolean().default(false),
});

export const updateListSchema = createListSchema.partial();

export type CreateListRequest = z.infer<typeof createListSchema>;
export type UpdateListRequest = z.infer<typeof updateListSchema>;
