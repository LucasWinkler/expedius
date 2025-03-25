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
    // Create entertainment subtype direct categories (50% chance of using these)
    const useEntertainmentSubtypes = Math.random() < 0.5;

    if (useEntertainmentSubtypes) {
      // Use subtypes directly from entertainment category
      const entertainmentGroup = CATEGORY_GROUPS.entertainment;

      // Create night-appropriate entertainment subtypes as standalone categories
      const nightSubtypes: CategoryGroup[] = entertainmentGroup.types
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
          id: type.id,
          title: type.name,
          query: type.name.toLowerCase(),
          purpose: "primary" as const,
          imageUrl: type.imageUrl || entertainmentGroup.imageUrl,
          types: [type],
          weight: 12,
        }));

      // Remove "entertainment" from the main categories to avoid duplication
      const highRelevanceWithoutEntertainment = timeAppropriateGroups.filter(
        (group) =>
          [
            "restaurants",
            "bars",
            "desserts",
            "arts",
            "sports",
            "markets",
          ].includes(group.id),
      );

      // Randomly select 1-3 entertainment subtypes to showcase specific night activities
      const selectedSubtypes = weightedRandomSelection(
        nightSubtypes,
        Math.min(3, nightSubtypes.length),
      );

      // Select from main categories to fill the remaining spots
      const mainCategoriesCount = 6 - selectedSubtypes.length;
      const selectedMainCategories = weightedRandomSelection(
        highRelevanceWithoutEntertainment,
        Math.min(mainCategoriesCount, highRelevanceWithoutEntertainment.length),
      );

      return [...selectedMainCategories, ...selectedSubtypes];
    }

    // Regular behavior (50% of the time)
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
    return [
      ...weightedRandomSelection(
        highRelevance,
        Math.min(highRelevance.length, 5),
      ),
      ...weightedRandomSelection(
        otherRelevant,
        Math.max(0, 6 - Math.min(highRelevance.length, 5)),
      ),
    ];
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
