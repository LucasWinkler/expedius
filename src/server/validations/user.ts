import { z } from "zod";
import { updateProfileSchema } from "@/lib/validations/user";

export const updateProfileServerSchema = updateProfileSchema
  .omit({ image: true })
  .extend({
    image: z.string().optional().nullable(),
  });

export type UpdateProfileRequest = z.infer<typeof updateProfileServerSchema>;
