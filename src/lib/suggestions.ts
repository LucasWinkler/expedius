import type { CategoryGroup } from "@/types/categories";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";
import { weightedRandomSelection } from "@/lib/utils/math";
import { getSpecificTypeSuggestions } from "@/utils/categories";
import { deduplicateSuggestions } from "@/utils/suggestions";

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
  if (isLateNight) {
    // Random chance of using subtypes (higher probability than before)
    const useSubtypes = Math.random() < 0.7;

    if (useSubtypes) {
      const nightSubtypes: CategoryGroup[] = [];
      const selectedMainCategories: CategoryGroup[] = [];
      const usedCategoryIds = new Set<string>();

      // Use entertainment subtypes
      const useEntertainmentSubtypes = Math.random() < 0.8;
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

        // Add 1-2 entertainment subtypes
        const selectedEntertainmentSubtypes = weightedRandomSelection(
          entertainmentNightSubtypes,
          Math.min(2, entertainmentNightSubtypes.length),
        );

        nightSubtypes.push(...selectedEntertainmentSubtypes);
        usedCategoryIds.add("entertainment");
      }

      // Use bars subtypes
      const useBarsSubtypes = Math.random() < 0.7;
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

        // Add 1 bar subtype
        const selectedBarsSubtypes = weightedRandomSelection(
          barsNightSubtypes,
          1,
        );

        nightSubtypes.push(...selectedBarsSubtypes);
        usedCategoryIds.add("bars");
      }

      // Use arts subtypes
      const useArtsSubtypes = Math.random() < 0.6;
      if (useArtsSubtypes) {
        const artsGroup = CATEGORY_GROUPS.arts;

        // Create night-appropriate arts subtypes
        const artsNightSubtypes: CategoryGroup[] = artsGroup.types
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

        // Add 1 arts subtype
        const selectedArtsSubtypes = weightedRandomSelection(
          artsNightSubtypes,
          1,
        );

        nightSubtypes.push(...selectedArtsSubtypes);
        usedCategoryIds.add("arts");
      }

      // Use restaurant subtypes
      const useRestaurantSubtypes = Math.random() < 0.5;
      if (useRestaurantSubtypes) {
        const restaurantsGroup = CATEGORY_GROUPS.restaurants;

        // Create night-appropriate restaurant subtypes
        const restaurantsNightSubtypes: CategoryGroup[] = restaurantsGroup.types
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

        // Add 1 restaurant subtype
        const selectedRestaurantSubtypes = weightedRandomSelection(
          restaurantsNightSubtypes,
          1,
        );

        nightSubtypes.push(...selectedRestaurantSubtypes);
        usedCategoryIds.add("restaurants");
      }

      // Use dessert subtypes
      const useDessertSubtypes = Math.random() < 0.4;
      if (useDessertSubtypes) {
        const dessertsGroup = CATEGORY_GROUPS.desserts;

        // Create night-appropriate dessert subtypes
        const dessertsNightSubtypes: CategoryGroup[] = dessertsGroup.types
          .filter((type) =>
            [
              "dessert_shop",
              "ice_cream_shop",
              "bakery",
              "dessert_restaurant",
            ].includes(type.id),
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

      // Select from main categories to fill the remaining spots (up to 6 total suggestions)
      const remainingCount = Math.max(0, 6 - nightSubtypes.length);
      if (remainingCount > 0 && highRelevanceWithoutSubtypes.length > 0) {
        selectedMainCategories.push(
          ...weightedRandomSelection(
            highRelevanceWithoutSubtypes,
            Math.min(remainingCount, highRelevanceWithoutSubtypes.length),
          ),
        );
      }

      // Combine and return
      return deduplicateSuggestions([
        ...nightSubtypes,
        ...selectedMainCategories,
      ]);
    }

    // Regular behavior (30% of the time) - uses the original approach
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

    // Ensure we return a mix of both groups with weighted random selection
    // This ensures variety but still prioritizes nighttime-appropriate categories
    return deduplicateSuggestions([
      ...weightedRandomSelection(
        highRelevance,
        Math.min(highRelevance.length, 5),
      ),
      ...weightedRandomSelection(
        otherRelevant,
        Math.max(0, 6 - Math.min(highRelevance.length, 5)),
      ),
    ]);
  }

  // For daytime, just use weighted random selection directly
  return weightedRandomSelection(
    timeAppropriateGroups,
    timeAppropriateGroups.length,
  );
}

export function getExplorationSuggestions(
  excludeIds: Set<string>,
  count: number,
  hour: number,
): CategoryGroup[] {
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
    (group) =>
      !excludeIds.has(group.id) &&
      group.metadata?.timeAppropriate?.[timeOfDay] !== false,
  );

  // Use weighted random selection to get suggestions
  return weightedRandomSelection(timeAppropriateGroups, count);
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
  const selectedIds = new Set(exploitationSuggestions.map((g) => g.id));

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
