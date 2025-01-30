import slugify from "slugify";
import { lists } from "@/server/data/lists";

export const generateSlug = (title: string) => {
  return slugify(title, {
    replacement: "-",
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Generate a unique slug for a list
 * This function will generate a base slug and then check if it already exists
 * If it does, it will increment the slug by 1 until it finds a unique slug
 * @param name - The title of the list
 * @param userId - The ID of the user
 * @param existingSlug - The existing slug to check against
 * @returns The unique slug
 */
export const generateUniqueSlug = async (
  name: string,
  userId: string,
  existingSlug?: string,
) => {
  const baseSlug = generateSlug(name);

  if (existingSlug && baseSlug === existingSlug) {
    return existingSlug;
  }

  const existingSlugs = await lists.queries.getSlugsStartingWith(
    userId,
    baseSlug,
  );

  if (existingSlugs.length === 0) {
    return baseSlug;
  }

  const slugs = new Set(existingSlugs);
  let counter = 1;
  let newSlug = baseSlug;

  while (slugs.has(newSlug)) {
    newSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return newSlug;
};
