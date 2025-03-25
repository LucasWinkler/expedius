import type { CategoryGroup, PlaceType } from "@/types/categories";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";
import { isTypeAppropriateForTime } from "@/utils/timeAppropriate";
import type { TimeOfDay } from "@/lib/suggestions";
import { RANDOM_EXPLORATION_PROBABILITY } from "@/lib/suggestions/constants";
import { weightedRandomSelection } from "@/lib/utils/math";
import { deduplicateSuggestions } from "@/utils/suggestions";

// Helper function to find which category group a type belongs to
export function findCategoryGroupForType(typeId: string): CategoryGroup | null {
  // If this is already a category ID, return it directly
  if (typeId in CATEGORY_GROUPS) {
    return CATEGORY_GROUPS[typeId];
  }

  // First check if this is a full category_type format
  if (typeId.includes("_")) {
    const parts = typeId.split("_");
    const categoryId = parts[0];

    // Check if the first part is a valid category
    if (categoryId in CATEGORY_GROUPS) {
      return CATEGORY_GROUPS[categoryId];
    }
  }

  // Search through all categories to find which one contains this type
  for (const categoryId in CATEGORY_GROUPS) {
    const category = CATEGORY_GROUPS[categoryId];

    // Check if this type is in the category's types list
    if (category.types.some((type) => type.id === typeId)) {
      return category;
    }

    // Also check if this might be in categoryId_typeId format
    if (category.types.some((type) => `${categoryId}_${type.id}` === typeId)) {
      return category;
    }
  }

  return null;
}

// Helper function to get primary category groups
export function getPrimaryCategoryGroups(): CategoryGroup[] {
  return Object.values(CATEGORY_GROUPS).filter(
    (group) => group.purpose === "primary",
  );
}

// Helper function to get contextual category groups
export function getContextualCategoryGroups(): CategoryGroup[] {
  return Object.values(CATEGORY_GROUPS).filter(
    (group) => group.purpose === "contextual",
  );
}

// Helper function to get related types within a category
export function getRelatedTypesInCategory(
  categoryGroup: CategoryGroup,
  userPreferences: { placeType: string; count: number }[],
): PlaceType[] {
  // Get types the user has interacted with in this category
  const userTypes = new Set(
    userPreferences
      .filter((pref) =>
        categoryGroup.types.some((t) => t.id === pref.placeType),
      )
      .map((pref) => pref.placeType),
  );

  // If user has interacted with any type in this category,
  // suggest other types from the same category
  if (userTypes.size > 0) {
    return categoryGroup.types.filter((type) => !userTypes.has(type.id));
  }

  return [];
}

// Helper function to get specific type suggestions based on user preferences
export function getSpecificTypeSuggestions(
  userPreferences: { placeType: string; count: number }[],
  maxSuggestions: number = 5,
  timeOfDay?: TimeOfDay,
): CategoryGroup[] {
  const suggestions: CategoryGroup[] = [];
  const typeCounts = new Map<string, number>();
  const categoryInteractions = new Map<string, number>();

  // Filter user preferences by time appropriateness at the type level
  const timeAppropriatePreferences = timeOfDay
    ? userPreferences.filter((pref) =>
        isTypeAppropriateForTime(pref.placeType, timeOfDay),
      )
    : userPreferences;

  // Count occurrences of each type and category
  timeAppropriatePreferences.forEach((pref) => {
    typeCounts.set(
      pref.placeType,
      (typeCounts.get(pref.placeType) || 0) + pref.count,
    );

    const group = findCategoryGroupForType(pref.placeType);
    if (group) {
      categoryInteractions.set(
        group.id,
        (categoryInteractions.get(group.id) || 0) + pref.count,
      );
    }
  });

  // First, add specific type suggestions for highly interacted types
  for (const [type, count] of typeCounts.entries()) {
    const group = findCategoryGroupForType(type);
    if (group && count >= (group.metadata?.minimumInteractionCount || 0)) {
      const typeInfo = group.types.find((t) => t.id === type);
      if (typeInfo) {
        suggestions.push({
          id: `${group.id}_${type}`,
          title: typeInfo.name,
          query: typeInfo.name.toLowerCase(),
          purpose: "primary",
          types: [typeInfo],
          weight: typeInfo.baseWeight || group.weight || 10,
          imageUrl: typeInfo.imageUrl || group.imageUrl,
        });
      }
    }
  }

  // Then, add related type suggestions for categories with high interaction
  for (const [categoryId, count] of categoryInteractions.entries()) {
    const group = CATEGORY_GROUPS[categoryId];
    if (group && count >= 2) {
      // Lower threshold to 2 interactions
      const relatedTypes = getRelatedTypesInCategory(
        group,
        timeAppropriatePreferences,
      );

      // Filter related types by time appropriateness
      const appropriateRelatedTypes = timeOfDay
        ? relatedTypes.filter((type) =>
            isTypeAppropriateForTime(type.id, timeOfDay),
          )
        : relatedTypes;

      if (appropriateRelatedTypes.length > 0) {
        // Create a suggestion for each related type
        appropriateRelatedTypes.forEach((type) => {
          suggestions.push({
            id: `${group.id}_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary",
            types: [type],
            weight: type.baseWeight || group.weight || 10,
            imageUrl: type.imageUrl || group.imageUrl,
          });
        });
      }
    }
  }

  // Sort by weight and take top suggestions
  return suggestions
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, maxSuggestions);
}

// Helper function to check if current time is critical
// function isTimeCritical(hour: number): boolean {
//   // Critical times: 7-10am (breakfast), 11:30am-2pm (lunch), 5-8pm (dinner)
//   return (
//     (hour >= 7 && hour < 10) ||
//     (hour >= 11.5 && hour < 15) ||
//     (hour >= 17 && hour < 20)
//   );
// }

/**
 * Get exploration suggestions that balance between:
 * 1. Suggesting new types within categories the user has shown interest in
 * 2. Introducing entirely new categories the user hasn't explored
 */
export function getCategoryExplorationSuggestions(
  userPreferences: { placeType: string; count: number }[],
  excludeIds: Set<string>,
  maxSuggestions: number,
): CategoryGroup[] {
  // Extract the user's preferred types
  const userTypes = new Set<string>();
  const userCategories = new Set<string>();
  const categoryInteractions = new Map<string, number>();

  // Map for translating database types to category system
  const typeToParentCategory = new Map<string, string>();

  // Build a mapping from type IDs to parent categories
  Object.entries(CATEGORY_GROUPS).forEach(([categoryId, category]) => {
    category.types.forEach((type) => {
      typeToParentCategory.set(type.id, categoryId);
      // Also map the full format with parent_type
      typeToParentCategory.set(`${categoryId}_${type.id}`, categoryId);
    });
  });

  // Extract information about user preferences
  userPreferences.forEach((pref) => {
    // Add the exact preference to userTypes
    userTypes.add(pref.placeType);

    let categoryId: string | undefined;

    // Handle both direct category IDs and specific type IDs
    if (pref.placeType.includes("_")) {
      // This is a specific type ID (e.g., "restaurants_thai_restaurant" or "thai_restaurant")
      const parts = pref.placeType.split("_");
      const potentialType = parts[parts.length - 1];

      // Try to find the parent category based on the full preference
      categoryId = typeToParentCategory.get(pref.placeType);

      // If not found, try to find the category based on just the type
      if (!categoryId) {
        // Try to extract the type from the end
        categoryId = typeToParentCategory.get(potentialType);
      }

      // Direct mapping attempt if the first part matches a category
      if (!categoryId && parts[0] in CATEGORY_GROUPS) {
        categoryId = parts[0];
      }
    } else {
      // Direct category ID (e.g., "restaurants") or a type without parent info
      if (pref.placeType in CATEGORY_GROUPS) {
        // This is a direct category
        categoryId = pref.placeType;
      } else {
        // Try to find the parent category for this type
        categoryId = typeToParentCategory.get(pref.placeType);
      }
    }

    // Only add to userCategories if we found a valid category
    if (categoryId && categoryId in CATEGORY_GROUPS) {
      userCategories.add(categoryId);

      // Increment category interaction count
      const currentCount = categoryInteractions.get(categoryId) || 0;
      categoryInteractions.set(categoryId, currentCount + pref.count);
    }
  });

  // For debugging
  console.log("[DEBUG] User categories:", Array.from(userCategories));
  console.log("[DEBUG] User types:", Array.from(userTypes));
  console.log("[DEBUG] Initial excluded IDs:", Array.from(excludeIds));
  console.log(
    "[DEBUG] Category interactions:",
    Object.fromEntries(categoryInteractions),
  );

  // Store suggestions
  const suggestions: CategoryGroup[] = [];

  // PART 1: WITHIN-CATEGORY EXPLORATION (70% of slots)
  const withinCategorySlots = Math.ceil(maxSuggestions * 0.7);
  const withinCategorySuggestions: CategoryGroup[] = [];

  // Sort categories by interaction count (most interacted first)
  const sortedCategories = Array.from(userCategories).sort(
    (a, b) =>
      (categoryInteractions.get(b) || 0) - (categoryInteractions.get(a) || 0),
  );

  // For each category the user has interacted with
  for (const categoryId of sortedCategories) {
    const group = CATEGORY_GROUPS[categoryId];
    if (!group || excludeIds.has(group.id)) continue;

    // Get subtypes the user hasn't interacted with
    const unexploredTypes = group.types.filter((type) => {
      const fullTypeId = `${group.id}_${type.id}`;

      // Make sure type hasn't been excluded
      if (excludeIds.has(fullTypeId)) {
        console.log(`[DEBUG] Skipping ${fullTypeId} - already in excludeIds`);
        return false;
      }

      // Check if user has interacted with this type in any format
      if (userTypes.has(type.id)) {
        console.log(
          `[DEBUG] Skipping ${fullTypeId} - user has interacted with type ${type.id}`,
        );
        return false;
      }

      if (userTypes.has(fullTypeId)) {
        console.log(
          `[DEBUG] Skipping ${fullTypeId} - user has interacted with full ID`,
        );
        return false;
      }

      // Check for related types that might be duplicates
      // For example, restaurants_korean_restaurant should not be shown if korean_restaurant exists
      if (type.id.includes("_")) {
        // For composite types like bar_and_grill
        const typeParts = type.id.split("_");
        for (const part of typeParts) {
          // Don't exclude generic terms like "restaurant", only specific ones
          if (
            userTypes.has(part) &&
            !["restaurant", "shop", "store", "park"].includes(part)
          ) {
            console.log(
              `[DEBUG] Skipping ${fullTypeId} - user has interacted with specific part ${part}`,
            );
            return false;
          }
        }
      }

      // Check if this subtype has already been added from another category
      // This prevents showing "Korean Restaurant" in multiple categories
      for (const userType of userTypes) {
        // If userType looks like "something_restaurant" and our type is "korean_restaurant"
        // or vice versa, we might want to consider them related
        if (userType.includes("_") && type.id.includes("_")) {
          const userTypeParts = userType.split("_");
          const typeParts = type.id.split("_");

          // Extract the distinctive parts (ignoring common descriptors)
          const userDistinctiveParts = userTypeParts.filter(
            (part) => !["restaurant", "shop", "store", "park"].includes(part),
          );
          const typeDistinctiveParts = typeParts.filter(
            (part) => !["restaurant", "shop", "store", "park"].includes(part),
          );

          // If they share significant distinctive parts, consider them related
          const hasCommonSignificantPart = userDistinctiveParts.some((up) =>
            typeDistinctiveParts.includes(up),
          );

          if (hasCommonSignificantPart) {
            console.log(
              `[DEBUG] Skipping ${fullTypeId} - shares significant distinctive part with ${userType}`,
            );
            return false;
          }
        }
      }

      console.log(`[DEBUG] Including ${fullTypeId} as unexplored type`);
      return true;
    });

    // Determine how many types to pick from this category based on interaction level
    const interactionCount = categoryInteractions.get(categoryId) || 0;
    const normalizedInteractionLevel = Math.min(1, interactionCount / 10); // Cap at 10 interactions

    // Pick more types based on interaction level (increased from 1-3 to 1-5)
    const MAX_TYPES_PER_CATEGORY = 5;
    const maxTypesToPickFromCategory = Math.max(
      1,
      Math.ceil(MAX_TYPES_PER_CATEGORY * normalizedInteractionLevel),
    );

    // Debug output for unexplored types
    console.log(
      `[DEBUG] Category ${categoryId} unexplored types:`,
      unexploredTypes.map((t) => `${group.id}_${t.id}`),
    );

    if (unexploredTypes.length > 0) {
      // Sort by baseWeight to prefer more popular types first
      const weightSortedTypes = [...unexploredTypes].sort(
        (a, b) => (b.baseWeight || 10) - (a.baseWeight || 10),
      );

      // Pick random selection from weight-sorted types
      const selectedTypes = weightSortedTypes
        .sort(() => Math.random() - 0.5)
        .slice(
          0,
          Math.min(maxTypesToPickFromCategory, weightSortedTypes.length),
        );

      for (const type of selectedTypes) {
        // Create a suggestion for this unexplored type
        const suggestion = {
          id: `${group.id}_${type.id}`,
          title: type.name,
          query: type.name.toLowerCase(),
          purpose: "primary" as const,
          types: [type],
          weight: type.baseWeight || group.weight || 10,
          imageUrl: type.imageUrl || group.imageUrl,
          metadata: {
            ...group.metadata,
            isCategoryExploration: true,
          },
        };

        // Ensure we're not duplicating
        if (!excludeIds.has(suggestion.id)) {
          withinCategorySuggestions.push(suggestion);
        }
      }
    }
  }

  // If we couldn't find any within-category suggestions, we'll allocate more to across-category
  const finalWithinCategorySlots =
    withinCategorySuggestions.length > 0
      ? withinCategorySlots
      : Math.ceil(maxSuggestions * 0.3);

  // Take a random selection up to our slot limit, ensuring variety
  if (withinCategorySuggestions.length > 0) {
    // Group suggestions by category to ensure variety
    const groupedByCategory = new Map<string, CategoryGroup[]>();

    withinCategorySuggestions.forEach((suggestion) => {
      const categoryId = suggestion.id.split("_")[0];
      if (!groupedByCategory.has(categoryId)) {
        groupedByCategory.set(categoryId, []);
      }
      groupedByCategory.get(categoryId)!.push(suggestion);
    });

    // Take at most 3 suggestions from each category (increased from 2)
    const selected: CategoryGroup[] = [];

    // First pass: take 1 from each category
    for (const [, categorySuggestions] of groupedByCategory) {
      // Sort by weight
      const sorted = [...categorySuggestions].sort(
        (a, b) => (b.weight || 0) - (a.weight || 0),
      );

      // Take one with some randomness (80% chance of taking the highest weight)
      const pick =
        Math.random() < 0.8
          ? sorted[0]
          : sorted[Math.floor(Math.random() * sorted.length)];
      selected.push(pick);

      if (selected.length >= finalWithinCategorySlots) break;
    }

    // Second pass: take additional ones if we still have slots
    if (selected.length < finalWithinCategorySlots) {
      for (const [categoryId, categorySuggestions] of groupedByCategory) {
        // Skip if we already have 3 from this category
        if (
          selected.filter((s) => s.id.startsWith(categoryId + "_")).length >= 3
        )
          continue;

        // Find suggestions we haven't selected yet
        const remaining = categorySuggestions.filter(
          (s) => !selected.includes(s),
        );
        if (remaining.length > 0) {
          selected.push(
            remaining[Math.floor(Math.random() * remaining.length)],
          );
        }

        if (selected.length >= finalWithinCategorySlots) break;
      }
    }

    // Third pass: Take even more if we have slots and really good categories
    if (selected.length < finalWithinCategorySlots) {
      for (const [categoryId, categorySuggestions] of groupedByCategory) {
        // Only consider top categories with high interaction counts
        const interactionCount = categoryInteractions.get(categoryId) || 0;
        if (interactionCount < 5) continue; // Skip categories with low interaction

        // Skip if we already have 3 from this category
        if (
          selected.filter((s) => s.id.startsWith(categoryId + "_")).length >= 3
        )
          continue;

        // Find suggestions we haven't selected yet
        const remaining = categorySuggestions.filter(
          (s) => !selected.includes(s),
        );
        if (remaining.length > 0) {
          selected.push(
            remaining[Math.floor(Math.random() * remaining.length)],
          );
        }

        if (selected.length >= finalWithinCategorySlots) break;
      }
    }

    suggestions.push(...selected);

    // Update excludeIds with these selections
    selected.forEach((s) => {
      // Always exclude the specific suggestion
      excludeIds.add(s.id);

      // If this is a subtype (like "restaurants_thai_restaurant")
      if (s.id.includes("_")) {
        const categoryId = s.id.split("_")[0];
        const specificType = s.id.split("_")[1];

        // Here's the fix: Only exclude the parent category if this is the default type
        // e.g., if "restaurants_restaurant", exclude "restaurants"
        // but if "restaurants_thai_restaurant", don't exclude "restaurants"
        //
        // We need to make sure the comparison correctly identifies default types
        // where the specificType is just the singular of the category
        if (specificType === categoryId.replace(/s$/, "")) {
          excludeIds.add(categoryId);
          console.log(
            `[DEBUG] Excluding parent category ${categoryId} for ${s.id} (default type)`,
          );
        } else {
          console.log(
            `[DEBUG] Not excluding parent category ${categoryId} for ${s.id} (specific subtype)`,
          );
        }
      }
    });
  }

  console.log(
    "[DEBUG] Within-category exploration suggestions:",
    suggestions.map((s) => s.id),
  );

  // PART 2: ACROSS-CATEGORY EXPLORATION (remaining slots)
  const acrossCategorySlots = maxSuggestions - suggestions.length;

  if (acrossCategorySlots > 0) {
    // Check if we should include completely random suggestions based on probability
    const randomSuggestionCount = Array.from({
      length: acrossCategorySlots,
    }).filter(() => Math.random() < RANDOM_EXPLORATION_PROBABILITY).length;

    // Calculate remaining slots for regular across-category suggestions
    const regularAcrossCategorySlots =
      acrossCategorySlots - randomSuggestionCount;

    if (regularAcrossCategorySlots > 0) {
      // Find categories the user hasn't interacted with
      const newCategories = Object.values(CATEGORY_GROUPS).filter(
        (category) => {
          // Skip if already excluded or user has interacted with it
          if (excludeIds.has(category.id) || userCategories.has(category.id))
            return false;

          // Skip if this is a subtype of an excluded category
          for (const excludeId of excludeIds) {
            if (category.id.startsWith(excludeId + "_")) return false;

            // Check root category matches
            const categoryRoot = category.id.includes("_")
              ? category.id.split("_")[0]
              : category.id;

            const excludeRoot = excludeId.includes("_")
              ? excludeId.split("_")[0]
              : excludeId;

            if (categoryRoot === excludeRoot) return false;
          }

          // Skip contextual categories unless user has expressed interest
          if (
            category.purpose === "contextual" &&
            category.metadata?.requiresUserIntent === true
          ) {
            return false;
          }

          return true;
        },
      );

      console.log(
        "[DEBUG] New categories for across-category exploration:",
        newCategories.map((c) => c.id),
      );

      // Add these new categories to our suggestions
      if (newCategories.length > 0) {
        // Use weighted selection to get the best options
        const acrossCategorySuggestions = weightedRandomSelection(
          newCategories,
          Math.min(regularAcrossCategorySlots, newCategories.length),
        );

        suggestions.push(...acrossCategorySuggestions);

        // Update excludeIds
        acrossCategorySuggestions.forEach((s) => excludeIds.add(s.id));
      }
    }

    // Add completely random suggestions if needed
    if (randomSuggestionCount > 0) {
      const allCategories = Object.values(CATEGORY_GROUPS);

      // Try to find categories not already included
      const eligibleCategories = allCategories.filter((category) => {
        // Skip if already excluded
        if (excludeIds.has(category.id)) return false;

        // Skip contextual categories that require user intent
        if (
          category.purpose === "contextual" &&
          category.metadata?.requiresUserIntent === true
        ) {
          return false;
        }

        return true;
      });

      if (eligibleCategories.length > 0) {
        const randomCategories = weightedRandomSelection(
          eligibleCategories,
          randomSuggestionCount,
        ).map((category) => ({
          ...category,
          metadata: {
            ...category.metadata,
            isRandomExploration: true,
          },
        }));

        suggestions.push(...randomCategories);
      }
    }
  }

  // Deduplicate and return final suggestions
  return deduplicateSuggestions(suggestions);
}

// Helper function to get category groups from a list of types
export function getCategoryGroupsFromTypes(types: string[]): CategoryGroup[] {
  const groups = new Set<CategoryGroup>();

  types.forEach((type) => {
    const group = findCategoryGroupForType(type);
    if (group) {
      groups.add(group);
    }
  });

  return Array.from(groups);
}
