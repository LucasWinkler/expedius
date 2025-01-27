import { z } from "zod";

export const saveToListSchema = z.object({
  placeId: z.string().min(1, "Place ID is required"),
});

export const updateSavedPlacesSchema = z.object({
  placeId: z.string().min(1, "Place ID is required"),
  selectedLists: z.array(z.string().min(1, "List ID is required")),
});

export type SaveToListRequest = z.infer<typeof saveToListSchema>;
export type UpdateSavedPlacesRequest = z.infer<typeof updateSavedPlacesSchema>;
