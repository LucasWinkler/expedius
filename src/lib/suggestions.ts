import type { CategoryGroup } from "@/types/categories";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";
import { weightedRandomSelection } from "@/lib/utils/math";
import { getSpecificTypeSuggestions } from "@/utils/categories";
import { deduplicateSuggestions } from "@/utils/suggestions";
import { RANDOM_EXPLORATION_PROBABILITY } from "@/lib/suggestions/constants";

export const SUGGESTION_CONTEXTS = {
  HOME: "home",
  EXPLORE: "explore",
} as const;

export type SuggestionsContext =
  (typeof SUGGESTION_CONTEXTS)[keyof typeof SUGGESTION_CONTEXTS];

export const SUGGESTION_COUNTS = {
  [SUGGESTION_CONTEXTS.HOME]: 5,
  [SUGGESTION_CONTEXTS.EXPLORE]: 6,
} as const;

export const PERSONALIZATION_CONFIG = {
  DEFAULT_EXPLOITATION_RATIO: 0.7,
  MIN_EXPLOITATION_RATIO: 0.5,
  MAX_EXPLOITATION_RATIO: 0.8,

  getDynamicExploitationRatio: (userPreferencesCount: number): number => {
    // As user preferences increase, we gradually increase exploitation ratio
    const baseRatio = 0.7;
    const maxIncrease = 0.1;
    const increaseRate = 0.01;
    const increase = Math.min(userPreferencesCount * increaseRate, maxIncrease);

    return Math.min(
      baseRatio + increase,
      PERSONALIZATION_CONFIG.MAX_EXPLOITATION_RATIO,
    );
  },
};

// Late night category groups that make sense for after-hours browsing (10pm-6am)
export const getLateNightCategoryGroups = (): CategoryGroup[] => {
  // Filter categories that are explicitly marked as appropriate for late night
  const lateNightAppropriate = Object.values(CATEGORY_GROUPS)
    .filter(
      (category) => category.metadata?.timeAppropriate?.lateNight === true,
    )
    // Sort by weight descending to prioritize most relevant categories
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    // Take top 8 instead of 5 to ensure we have more options
    .slice(0, 8);

  // Fallback if not enough categories have metadata
  if (lateNightAppropriate.length < 5) {
    // Ensure we only include categories that make sense for late-night Google Places results
    return [
      CATEGORY_GROUPS.restaurants, // 24-hour restaurants, late-night food
      CATEGORY_GROUPS.bars, // Bars and nightlife
      CATEGORY_GROUPS.entertainment, // Entertainment options like movie theaters, arcades
      CATEGORY_GROUPS.desserts, // Late night dessert spots
      CATEGORY_GROUPS.markets, // 24-hour convenience stores
      CATEGORY_GROUPS.arts, // Late night shows
    ];
  }

  return lateNightAppropriate;
};

export type SuggestionSource =
  | "default"
  | "user_preferences"
  | "mixed"
  | "exploration"
  | "time_based";

export type TimeOfDay =
  | "morning"
  | "lunch"
  | "afternoon"
  | "evening"
  | "lateNight";

export type SuggestionsWithMeta = {
  suggestions: CategoryGroup[];
  source: SuggestionSource;
  hasPreferences: boolean;
  explorationUsed: boolean;
  userPreferencesCount?: number;
  defaultsUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
  metadata?: {
    timeInfo?: {
      clientHour?: number;
      timezoneOffset?: number;
    };
    userPreferences?: {
      primaryTypes?: { placeType: string; count: number }[];
      allTypes?: { placeType: string; count: number }[];
    };
  };
};

/**
 * Get time-based suggestions based on the current hour
 */
export function getTimeBasedSuggestions(hour: number): CategoryGroup[] {
  // Helper to check if a category is appropriate for the current time
  const isTimeAppropriate = (group: CategoryGroup) => {
    const timeAppropriate = group.metadata?.timeAppropriate;
    if (!timeAppropriate) return true;

    // Align with typical business operating hours
    if (hour >= 5 && hour < 11) return timeAppropriate.morning;
    if (hour >= 11 && hour < 15) return timeAppropriate.lunch;
    if (hour >= 15 && hour < 17) return timeAppropriate.afternoon;
    if (hour >= 17 && hour < 22) return timeAppropriate.evening;
    return timeAppropriate.lateNight; // 10pm-5am
  };

  // Collect all appropriate categories for the current time
  const timeAppropriateGroups = Object.values(CATEGORY_GROUPS)
    .filter(isTimeAppropriate)
    .map((group) => ({
      ...group,
      imageUrl: group.imageUrl || "/place-image-fallback.webp",
    }));

  // For late night, ensure we add some variety through weighted random selection
  const isLateNight = hour < 5 || hour >= 22;
  const isVeryLate = hour >= 2 && hour < 5;

  if (isLateNight) {
    // Higher chance of using subtypes for more specific nightlife suggestions
    // For very late hours, almost always use subtypes
    const useSubtypes = isVeryLate ? Math.random() < 0.85 : Math.random() < 0.6;

    if (useSubtypes) {
      const nightSubtypes: CategoryGroup[] = [];
      const selectedMainCategories: CategoryGroup[] = [];
      const usedCategoryIds = new Set<string>();

      // Use entertainment subtypes - high probability in very late hours
      const useEntertainmentSubtypes = isVeryLate
        ? Math.random() < 0.8
        : Math.random() < 0.7;
      if (useEntertainmentSubtypes) {
        const entertainmentGroup = CATEGORY_GROUPS.entertainment;

        // Create night-appropriate entertainment subtypes
        const entertainmentNightSubtypes: CategoryGroup[] =
          entertainmentGroup.types
            .filter((type) =>
              [
                "bowling_alley",
                "karaoke",
                "arcade",
                "pool_hall",
                "billiards",
                "movie_theater",
              ].includes(type.id),
            )
            .map((type) => ({
              id: `entertainment_${type.id}`,
              title: type.name,
              query: type.name.toLowerCase(),
              purpose: "primary" as const,
              imageUrl: type.imageUrl || entertainmentGroup.imageUrl,
              types: [type],
              weight: 12,
              metadata: {
                isNightSuggestion: true,
                timeAppropriate: {
                  ...(entertainmentGroup.metadata?.timeAppropriate || {}),
                  lateNight: true,
                },
              },
            }));

        // Add 1-2 entertainment subtypes (more for very late hours)
        const entertainmentCount = isVeryLate
          ? Math.min(2, entertainmentNightSubtypes.length)
          : Math.min(1, entertainmentNightSubtypes.length);

        const selectedEntertainmentSubtypes = weightedRandomSelection(
          entertainmentNightSubtypes,
          entertainmentCount,
        );

        nightSubtypes.push(...selectedEntertainmentSubtypes);
        usedCategoryIds.add("entertainment");
      }

      // Use bars subtypes - almost always in very late hours
      const useBarsSubtypes = isVeryLate
        ? Math.random() < 0.8
        : Math.random() < 0.6;
      if (useBarsSubtypes) {
        const barsGroup = CATEGORY_GROUPS.bars;

        // Create night-appropriate bars subtypes
        const barsNightSubtypes: CategoryGroup[] = barsGroup.types
          .filter((type) =>
            ["bar", "wine_bar", "pub", "night_club"].includes(type.id),
          )
          .map((type) => ({
            id: `bars_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary" as const,
            imageUrl: type.imageUrl || barsGroup.imageUrl,
            types: [type],
            weight: 12,
            metadata: {
              isNightSuggestion: true,
              timeAppropriate: {
                ...(barsGroup.metadata?.timeAppropriate || {}),
                lateNight: true,
              },
            },
          }));

        // Add 1-2 bar subtypes (more for very late hours)
        const barsCount = isVeryLate
          ? Math.min(2, barsNightSubtypes.length)
          : Math.min(1, barsNightSubtypes.length);

        const selectedBarsSubtypes = weightedRandomSelection(
          barsNightSubtypes,
          barsCount,
        );

        nightSubtypes.push(...selectedBarsSubtypes);
        usedCategoryIds.add("bars");
      }

      // Use arts subtypes (lower priority during very late hours)
      const useArtsSubtypes = isVeryLate
        ? Math.random() < 0.3
        : Math.random() < 0.6;
      if (useArtsSubtypes) {
        const artsGroup = CATEGORY_GROUPS.arts;

        // Create night-appropriate arts subtypes
        let artsNightSubtypes: CategoryGroup[] = artsGroup.types
          .filter((type) =>
            [
              "movie_theater",
              "concert_hall",
              "theater",
              "performing_arts_theater",
            ].includes(type.id),
          )
          .map((type) => ({
            id: `arts_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary" as const,
            imageUrl: type.imageUrl || artsGroup.imageUrl,
            types: [type],
            weight: 12,
            metadata: {
              isNightSuggestion: true,
              timeAppropriate: {
                ...(artsGroup.metadata?.timeAppropriate || {}),
                lateNight: true,
              },
            },
          }));

        // Lower priority for very late hours
        if (isVeryLate) {
          // Only include movie theaters for very late hours - others would be closed
          artsNightSubtypes = artsNightSubtypes.filter(
            (type) => type.id === "arts_movie_theater",
          );
        }

        // Only add if we have valid subtypes after filtering
        if (artsNightSubtypes.length > 0) {
          // Add 1 arts subtype
          const selectedArtsSubtypes = weightedRandomSelection(
            artsNightSubtypes,
            1,
          );

          nightSubtypes.push(...selectedArtsSubtypes);
          usedCategoryIds.add("arts");
        }
      }

      // Use restaurant subtypes (adjusted priority for very late hours)
      const useRestaurantSubtypes = isVeryLate
        ? Math.random() < 0.7
        : Math.random() < 0.6;
      if (useRestaurantSubtypes) {
        const restaurantsGroup = CATEGORY_GROUPS.restaurants;

        // Create night-appropriate restaurant subtypes
        let restaurantsNightSubtypes: CategoryGroup[] = restaurantsGroup.types
          .filter((type) =>
            [
              "restaurant",
              "fast_food_restaurant",
              "bar_and_grill",
              "japanese_restaurant",
              "chinese_restaurant",
              "thai_restaurant",
              "mexican_restaurant",
            ].includes(type.id),
          )
          .map((type) => ({
            id: `restaurants_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary" as const,
            imageUrl: type.imageUrl || restaurantsGroup.imageUrl,
            types: [type],
            weight: 10,
            metadata: {
              isNightSuggestion: type.id === "bar_and_grill",
              timeAppropriate: {
                ...(restaurantsGroup.metadata?.timeAppropriate || {}),
                lateNight: true,
              },
            },
          }));

        // For very late hours, prioritize 24-hour restaurants and bar & grills
        if (isVeryLate) {
          restaurantsNightSubtypes = restaurantsNightSubtypes.filter((type) =>
            type.id.includes("bar_and_grill"),
          );
        }

        // Only add if we have valid subtypes after filtering
        if (restaurantsNightSubtypes.length > 0) {
          // Add 1 restaurant subtype
          const selectedRestaurantSubtypes = weightedRandomSelection(
            restaurantsNightSubtypes,
            1,
          );

          nightSubtypes.push(...selectedRestaurantSubtypes);
          usedCategoryIds.add("restaurants");
        }
      }

      // Use dessert subtypes (lower priority for very late hours)
      const useDessertSubtypes = isVeryLate
        ? Math.random() < 0.2
        : Math.random() < 0.4;
      if (useDessertSubtypes) {
        const dessertsGroup = CATEGORY_GROUPS.desserts;

        // Create night-appropriate dessert subtypes
        const dessertsNightSubtypes: CategoryGroup[] = dessertsGroup.types
          .filter((type) =>
            ["dessert_shop", "ice_cream_shop", "dessert_restaurant"].includes(
              type.id,
            ),
          )
          .map((type) => ({
            id: `desserts_${type.id}`,
            title: type.name,
            query: type.name.toLowerCase(),
            purpose: "primary" as const,
            imageUrl: type.imageUrl || dessertsGroup.imageUrl,
            types: [type],
            weight: 10,
            metadata: {
              isNightSuggestion: false,
              timeAppropriate: {
                ...(dessertsGroup.metadata?.timeAppropriate || {}),
                lateNight: true,
              },
            },
          }));

        // Add 1 dessert subtype
        const selectedDessertSubtypes = weightedRandomSelection(
          dessertsNightSubtypes,
          1,
        );

        nightSubtypes.push(...selectedDessertSubtypes);
        usedCategoryIds.add("desserts");
      }

      // Filter timeAppropriateGroups to exclude categories we've used subtypes for
      const highRelevanceWithoutSubtypes = timeAppropriateGroups.filter(
        (group) =>
          !usedCategoryIds.has(group.id) &&
          [
            "restaurants",
            "bars",
            "desserts",
            "entertainment",
            "arts",
            "sports",
            "markets",
          ].includes(group.id),
      );

      // Select from main categories to fill the remaining spots
      // (up to 6 total suggestions, or more for very late hours)
      const totalSuggestions = isVeryLate ? 6 : 6;
      const remainingCount = Math.max(
        0,
        totalSuggestions - nightSubtypes.length,
      );

      if (remainingCount > 0 && highRelevanceWithoutSubtypes.length > 0) {
        selectedMainCategories.push(
          ...weightedRandomSelection(
            highRelevanceWithoutSubtypes,
            Math.min(remainingCount, highRelevanceWithoutSubtypes.length),
          ),
        );
      }

      // Add nighttime metadata to ensure styling is applied
      const enhancedNightSubtypes = nightSubtypes.map((subtype) => ({
        ...subtype,
        metadata: {
          ...subtype.metadata,
          isNightSuggestion: true,
        },
      }));

      // Add a random exploration suggestion (10% chance)
      let randomSuggestion: CategoryGroup[] = [];
      if (Math.random() < RANDOM_EXPLORATION_PROBABILITY) {
        // Get all categories excluding those already selected
        const existingIds = new Set([
          ...nightSubtypes.map((s) => s.id),
          ...selectedMainCategories.map((s) => s.id),
        ]);

        const randomSugg = getRandomExplorationSuggestion(existingIds);
        if (randomSugg) {
          randomSuggestion = [randomSugg];

          // Reduce main categories by 1 if we're adding a random one
          if (selectedMainCategories.length > 0) {
            selectedMainCategories.pop();
          }
        }
      }

      // Combine and return
      return deduplicateSuggestions([
        ...enhancedNightSubtypes,
        ...randomSuggestion,
        ...selectedMainCategories,
      ]);
    }

    // Regular behavior - if not using subtypes
    // Split into two groups: highly relevant and somewhat relevant
    const highRelevance = timeAppropriateGroups.filter((group) =>
      [
        "restaurants",
        "bars",
        "entertainment",
        "desserts",
        "arts",
        "sports",
        "markets",
      ].includes(group.id),
    );

    const otherRelevant = timeAppropriateGroups.filter(
      (group) =>
        ![
          "restaurants",
          "bars",
          "entertainment",
          "desserts",
          "arts",
          "sports",
          "markets",
        ].includes(group.id),
    );

    // Enhance night categories with proper metadata
    const enhancedHighRelevance = highRelevance.map((category) => {
      if (["bars", "entertainment"].includes(category.id)) {
        return {
          ...category,
          metadata: {
            ...category.metadata,
            isNightSuggestion: true,
          },
        };
      }
      return category;
    });

    // Check if we should include a random exploration suggestion
    const shouldIncludeRandom = Math.random() < RANDOM_EXPLORATION_PROBABILITY; // 10% chance
    const totalHighRelevance = shouldIncludeRandom
      ? Math.min(enhancedHighRelevance.length, isVeryLate ? 3 : 2) // One less if including random
      : Math.min(enhancedHighRelevance.length, isVeryLate ? 4 : 3);

    const totalOtherRelevant = Math.max(
      0,
      (isVeryLate ? 6 : 6) - totalHighRelevance - (shouldIncludeRandom ? 1 : 0),
    );

    // Get high relevance and other suggestions
    const highRelevanceSelections = weightedRandomSelection(
      enhancedHighRelevance,
      totalHighRelevance,
    );

    const otherRelevantSelections = weightedRandomSelection(
      otherRelevant,
      totalOtherRelevant,
    );

    // Create a random suggestion if needed
    let randomSuggestion: CategoryGroup[] = [];
    if (shouldIncludeRandom) {
      // Get all categories excluding those already chosen
      const existingIds = new Set([
        ...highRelevanceSelections.map((s) => s.id),
        ...otherRelevantSelections.map((s) => s.id),
      ]);

      const randomSugg = getRandomExplorationSuggestion(existingIds);
      if (randomSugg) {
        randomSuggestion = [randomSugg];
      }
    }

    // Ensure we return a mix of all groups with weighted random selection
    return deduplicateSuggestions([
      ...highRelevanceSelections,
      ...randomSuggestion,
      ...otherRelevantSelections,
    ]);
  }

  // For daytime, just use weighted random selection directly
  return weightedRandomSelection(
    timeAppropriateGroups,
    timeAppropriateGroups.length,
  );
}

/**
 * Add a random exploration suggestion to mix things up
 * This has a 10% chance of returning a completely random category
 */
function getRandomExplorationSuggestion(
  excludeIds: Set<string>,
): CategoryGroup | null {
  // 10% chance of including a random suggestion
  if (Math.random() > RANDOM_EXPLORATION_PROBABILITY) {
    return null;
  }

  // For debugging
  console.log(
    "[DEBUG] Getting random exploration suggestion, excluding:",
    Array.from(excludeIds).sort(),
  );

  // Create broader exclusion set that includes parent categories
  const expandedExcludeIds = new Set<string>();

  // Add all original IDs
  excludeIds.forEach((id) => expandedExcludeIds.add(id));

  // For each ID, add the base category and any parent categories
  excludeIds.forEach((id) => {
    // If this is a subtype (has underscore), add the parent category
    if (id.includes("_")) {
      const baseCategory = id.split("_")[0];
      const specificType = id.split("_")[1];

      // Add parent category to exclusion list
      expandedExcludeIds.add(baseCategory);

      // If this is a default subtype (e.g., "restaurants_restaurant"),
      // log this special case for debugging
      if (specificType === baseCategory.replace(/s$/, "")) {
        console.log(`[DEBUG] ${id} is a default subtype of ${baseCategory}`);
      }
    }
  });

  console.log(
    "[DEBUG] Expanded exclusion set:",
    Array.from(expandedExcludeIds).sort(),
  );

  // Get all categories that don't require explicit user intent
  const eligibleCategories = Object.values(CATEGORY_GROUPS).filter(
    (category) => {
      // Skip categories that require explicit user intent/preferences
      if (category.metadata?.requiresUserIntent) return false;

      // Skip categories that are in the expanded exclusion set
      if (expandedExcludeIds.has(category.id)) return false;

      // Skip if this is a subtype of an excluded category
      for (const excludeId of expandedExcludeIds) {
        if (category.id.startsWith(excludeId + "_")) return false;
      }

      // Check root category matches (this is crucial to prevent duplicates)
      // For example, if "restaurants_restaurant" is excluded, don't suggest "restaurants"
      const categoryRoot = category.id.includes("_")
        ? category.id.split("_")[0]
        : category.id;

      for (const excludeId of expandedExcludeIds) {
        const excludeRoot = excludeId.includes("_")
          ? excludeId.split("_")[0]
          : excludeId;

        if (categoryRoot === excludeRoot) {
          console.log(
            `[DEBUG] Filtering out ${category.id} because root category ${categoryRoot} matches excluded root ${excludeRoot}`,
          );
          return false;
        }
      }

      return true;
    },
  );

  if (eligibleCategories.length === 0) {
    console.log("[DEBUG] No eligible categories for random exploration");
    return null;
  }

  console.log(
    "[DEBUG] Eligible categories for random exploration:",
    eligibleCategories.map((c) => c.id).sort(),
  );

  // Get a random category
  const randomIndex = Math.floor(Math.random() * eligibleCategories.length);
  const randomCategory = eligibleCategories[randomIndex];

  console.log("[DEBUG] Selected random category:", randomCategory.id);

  // Mark it as a random exploration
  return {
    ...randomCategory,
    metadata: {
      ...randomCategory.metadata,
      isRandomExploration: true,
    },
  };
}

export function getExplorationSuggestions(
  excludeIds: Set<string>,
  count: number,
  hour: number,
): CategoryGroup[] {
  // Log for debugging exclusions
  console.log(
    "[DEBUG] getExplorationSuggestions called with excludeIds:",
    Array.from(excludeIds).sort(),
  );

  // Try to include a random exploration suggestion first
  const randomSuggestion = getRandomExplorationSuggestion(excludeIds);

  // If we have a random suggestion, we'll need one less from the regular exploration pool
  const adjustedCount = randomSuggestion ? count - 1 : count;

  if (adjustedCount <= 0) {
    return randomSuggestion ? [randomSuggestion] : [];
  }

  // Keep time ranges consistent with getTimeBasedSuggestions
  const timeOfDay: TimeOfDay =
    hour >= 5 && hour < 11
      ? "morning"
      : hour >= 11 && hour < 15
        ? "lunch"
        : hour >= 15 && hour < 17
          ? "afternoon"
          : hour >= 17 && hour < 22
            ? "evening"
            : "lateNight";

  // Get all category groups that are appropriate for the current time
  const timeAppropriateGroups = Object.values(CATEGORY_GROUPS).filter(
    (group) => {
      // Skip if directly excluded
      if (excludeIds.has(group.id)) return false;

      // Skip based on time appropriateness
      if (group.metadata?.timeAppropriate?.[timeOfDay] === false) return false;

      // Skip if this is a subtype of an excluded category
      for (const excludeId of excludeIds) {
        if (group.id.startsWith(excludeId + "_")) return false;
      }

      // Check root category matches to prevent duplicates
      const groupRoot = group.id.includes("_")
        ? group.id.split("_")[0]
        : group.id;

      for (const excludeId of excludeIds) {
        // Skip if this exact ID is excluded
        if (excludeId === group.id) return false;

        // Get the root and type if this is a subtype
        const excludeRoot = excludeId.includes("_")
          ? excludeId.split("_")[0]
          : excludeId;
        const excludeType = excludeId.includes("_")
          ? excludeId.split("_")[1]
          : null;

        // Different rules based on what we're checking:

        // If checking a parent category (e.g., "restaurants")
        if (!group.id.includes("_")) {
          // Skip if we have a default subtype excluded
          // e.g., if "restaurants_restaurant" is excluded, skip "restaurants"
          if (
            excludeId.includes("_") &&
            excludeRoot === group.id &&
            excludeType === excludeRoot.replace(/s$/, "")
          ) {
            console.log(
              `[DEBUG] Skipping parent category ${group.id} because default subtype ${excludeId} is excluded`,
            );
            return false;
          }
        }
        // If checking a subtype (e.g., "restaurants_thai_restaurant")
        else {
          const groupType = group.id.split("_")[1];

          // Skip if this exact subtype is excluded
          if (excludeId === group.id) return false;

          // Skip if this is a default subtype and parent is excluded
          // e.g., if "restaurants" is excluded, skip "restaurants_restaurant"
          if (
            !excludeId.includes("_") &&
            excludeId === groupRoot &&
            groupType === groupRoot.replace("s", "")
          ) {
            return false;
          }
        }
      }

      return true;
    },
  );

  // Use weighted random selection to get suggestions
  const regularSuggestions = weightedRandomSelection(
    timeAppropriateGroups,
    adjustedCount,
  );

  // Combine with random suggestion if we have one
  return randomSuggestion
    ? [randomSuggestion, ...regularSuggestions]
    : regularSuggestions;
}

export function getPersonalizedSuggestions(
  userPreferences: { placeType: string; count: number }[] = [],
  context: SuggestionsContext,
): CategoryGroup[] {
  const targetCount = SUGGESTION_COUNTS[context];
  const { getDynamicExploitationRatio } = PERSONALIZATION_CONFIG;

  // If no user preferences, return time-based suggestions
  if (userPreferences.length === 0) {
    const timeSuggestions = getTimeBasedSuggestions(new Date().getHours());
    return deduplicateSuggestions(timeSuggestions).slice(0, targetCount);
  }

  // Get specific type suggestions based on user preferences
  const specificSuggestions = getSpecificTypeSuggestions(
    userPreferences,
    targetCount,
  );

  // Calculate user preference count for dynamic ratio adjustment
  const userPreferencesCount = userPreferences.length;
  const exploitationRatio = getDynamicExploitationRatio(userPreferencesCount);

  // Calculate exploitation vs exploration counts
  const exploitationCount = Math.ceil(targetCount * exploitationRatio);
  const explorationCount = targetCount - exploitationCount;

  // Get user's most engaged categories (exploitation)
  const exploitationSuggestions = specificSuggestions.slice(
    0,
    exploitationCount,
  );

  // Create a set of already selected category IDs to avoid duplicates
  const selectedIds = new Set<string>();

  // Add all exploitation suggestions to the exclusion set
  exploitationSuggestions.forEach((suggestion) => {
    selectedIds.add(suggestion.id);

    // If this is a subtype, handle parent category appropriately
    if (suggestion.id.includes("_")) {
      const baseCategory = suggestion.id.split("_")[0];
      const specificType = suggestion.id.split("_")[1];

      // Only exclude parent category if this is the default type
      // e.g., if "restaurants_restaurant", exclude "restaurants"
      // but if "restaurants_thai_restaurant", don't exclude "restaurants"
      if (specificType === baseCategory.replace("s", "")) {
        selectedIds.add(baseCategory);
        console.log(
          `[DEBUG] Excluding parent category ${baseCategory} for ${suggestion.id} (default type)`,
        );
      } else {
        console.log(
          `[DEBUG] Not excluding parent category ${baseCategory} for ${suggestion.id} (specific subtype)`,
        );
      }
    }
  });

  // Get exploration suggestions
  const explorationSuggestions =
    explorationCount > 0
      ? getExplorationSuggestions(
          selectedIds,
          explorationCount,
          new Date().getHours(),
        )
      : [];

  // Combine exploitation and exploration suggestions
  const combinedSuggestions = [
    ...exploitationSuggestions,
    ...explorationSuggestions,
  ];

  // Deduplicate to ensure no duplicates across categories
  const dedupedSuggestions = deduplicateSuggestions(combinedSuggestions);

  // Fill up to targetCount if deduplication reduced the count
  if (dedupedSuggestions.length < targetCount) {
    const additionalNeeded = targetCount - dedupedSuggestions.length;

    if (additionalNeeded > 0) {
      const currentIds = new Set(dedupedSuggestions.map((g) => g.id));
      const additionalSuggestions = getExplorationSuggestions(
        currentIds,
        additionalNeeded,
        new Date().getHours(),
      );

      // Add the additional suggestions to the combined list
      dedupedSuggestions.push(...additionalSuggestions);
    }
  }

  // Ensure we don't exceed maxSuggestions
  return dedupedSuggestions.slice(0, targetCount);
}

export function getDefaultSuggestions(): SuggestionsWithMeta {
  const suggestions = getTimeBasedSuggestions(new Date().getHours());
  const dedupedSuggestions = deduplicateSuggestions(suggestions);

  return {
    suggestions: dedupedSuggestions,
    source: "default",
    hasPreferences: false,
    explorationUsed: true,
  };
}
