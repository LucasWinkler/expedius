import { z } from "zod";

export const toggleLikeSchema = z.object({
  placeId: z.string().min(1, "Place ID is required"),
});

export type ToggleLikeRequest = z.infer<typeof toggleLikeSchema>;
