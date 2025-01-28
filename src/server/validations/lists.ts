import { z } from "zod";
import { createListSchema, updateListSchema } from "@/lib/validations/list";

export const createListServerSchema = createListSchema
  .omit({ image: true })
  .extend({
    image: z.string().optional(),
  });
export const updateListServerSchema = updateListSchema
  .omit({ image: true })
  .extend({
    image: z.string().optional().nullable(),
  });

export type CreateListRequest = z.infer<typeof createListServerSchema>;
export type UpdateListRequest = z.infer<typeof updateListServerSchema>;
