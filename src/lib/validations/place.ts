import { z } from "zod";

export const placePhotoSchema = z.object({
  name: z.string(),
  widthPx: z.number(),
  heightPx: z.number(),
});

export const placeSchema = z.object({
  id: z.string(),
  formattedAddress: z.string(),
  rating: z.number().optional(),
  priceLevel: z.string().optional(),
  userRatingCount: z.number().optional(),
  displayName: z.object({
    text: z.string(),
    languageCode: z.string(),
  }),
  photos: z.array(placePhotoSchema).optional(),
  image: z
    .object({
      url: z.string(),
      blurDataURL: z.string(),
      height: z.number(),
      width: z.number(),
    })
    .optional(),
});

export const placeSearchResponseSchema = z.object({
  places: z.array(placeSchema).optional(),
});
