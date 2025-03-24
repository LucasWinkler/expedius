import type { CategoryGroup, PlaceType } from "@/types/categories";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";

// Helper function to find which category group a place type belongs to
export function findCategoryGroupForType(
  placeType: string,
): CategoryGroup | null {
  for (const [, group] of Object.entries(CATEGORY_GROUPS)) {
    for (const type of group.types) {
      if (type.id === placeType) {
        return group;
      }
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
): CategoryGroup[] {
  const suggestions: CategoryGroup[] = [];
  const typeCounts = new Map<string, number>();
  const categoryInteractions = new Map<string, number>();

  // Count occurrences of each type and category
  userPreferences.forEach((pref) => {
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
        });
      }
    }
  }

  // Then, add related type suggestions for categories with high interaction
  for (const [categoryId, count] of categoryInteractions.entries()) {
    const group = CATEGORY_GROUPS[categoryId];
    if (group && count >= 2) {
      // Lower threshold to 2 interactions
      const relatedTypes = getRelatedTypesInCategory(group, userPreferences);
      if (relatedTypes.length > 0) {
        // Create a suggestion for each related type
        relatedTypes.forEach((type) => {
          suggestions.push({
            id: `${group.id}_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary",
            types: [type],
            weight: type.baseWeight || group.weight || 10,
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
function isTimeCritical(hour: number): boolean {
  // Critical times: 7-10am (breakfast), 11:30am-2pm (lunch), 6-8pm (dinner)
  return (
    (hour >= 7 && hour < 10) ||
    (hour >= 11.5 && hour < 14) ||
    (hour >= 18 && hour < 20)
  );
}

// Helper function to get exploration suggestions within categories
export function getCategoryExplorationSuggestions(
  userPreferences: { placeType: string; count: number }[],
  excludeIds: Set<string>,
  maxSuggestions: number = 5,
  currentHour: number = new Date().getHours(),
): CategoryGroup[] {
  const suggestions: CategoryGroup[] = [];
  const userTypes = new Set(userPreferences.map((pref) => pref.placeType));
  const userCategories = new Set(
    userPreferences
      .map((pref) => findCategoryGroupForType(pref.placeType)?.id)
      .filter((id): id is string => id !== null),
  );

  // Check if we should include random exploration (10% chance during non-critical times)
  const shouldIncludeRandom =
    !isTimeCritical(currentHour) &&
    Math.random() < 0.1 &&
    userPreferences.length >= 10; // Only after user has established preferences

  // For each category the user has interacted with
  for (const categoryId of userCategories) {
    const group = CATEGORY_GROUPS[categoryId];
    if (!group || excludeIds.has(group.id)) continue;

    // Get types the user hasn't interacted with in this category
    const unexploredTypes = group.types.filter(
      (type) => !userTypes.has(type.id),
    );

    if (unexploredTypes.length > 0) {
      // Randomly select up to 2 types from this category
      const selectedTypes = unexploredTypes
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      selectedTypes.forEach((type) => {
        suggestions.push({
          id: `${group.id}_${type.id}`,
          title: type.name,
          query: type.name.toLowerCase(),
          purpose: "primary",
          types: [type],
          weight: type.baseWeight || group.weight || 10,
        });
      });
    }
  }

  // If we should include random exploration, add one random category
  if (shouldIncludeRandom) {
    const allCategories = Object.values(CATEGORY_GROUPS).filter(
      (group) => !excludeIds.has(group.id) && !userCategories.has(group.id),
    );

    if (allCategories.length > 0) {
      const randomCategory =
        allCategories[Math.floor(Math.random() * allCategories.length)];
      const randomType =
        randomCategory.types[
          Math.floor(Math.random() * randomCategory.types.length)
        ];

      suggestions.push({
        id: `${randomCategory.id}_${randomType.id}`,
        title: randomType.name,
        query: randomType.name.toLowerCase(),
        purpose: "primary",
        types: [randomType],
        weight: randomType.baseWeight || randomCategory.weight || 10,
      });
    }
  }

  return suggestions.slice(0, maxSuggestions);
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
