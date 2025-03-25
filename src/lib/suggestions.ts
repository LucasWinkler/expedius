import type { CategoryGroup } from "@/types/categories";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";
import { weightedRandomSelection } from "@/lib/utils/math";
import { getSpecificTypeSuggestions } from "@/utils/categories";

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
    // Take top 5
    .slice(0, 5);

  // Fallback if not enough categories have metadata
  if (lateNightAppropriate.length < 5) {
    // Ensure we only include categories that make sense for late-night Google Places results
    return [
      CATEGORY_GROUPS.restaurants, // 24-hour restaurants, late-night food
      CATEGORY_GROUPS.bars, // Bars and nightlife
      CATEGORY_GROUPS.entertainment, // Entertainment options like movie theaters, arcades
      CATEGORY_GROUPS.desserts, // Late night dessert spots
      CATEGORY_GROUPS.markets, // 24-hour convenience stores
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

type TimeOfDay = "morning" | "lunch" | "afternoon" | "evening" | "lateNight";

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
  const suggestions: CategoryGroup[] = [];

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

  // Add appropriate categories based on time
  Object.values(CATEGORY_GROUPS).forEach((group) => {
    if (isTimeAppropriate(group)) {
      // Create a new category group with the same properties but with imageUrl
      suggestions.push({
        ...group,
        imageUrl: group.imageUrl || "/place-image-fallback.webp",
      });
    }
  });

  return suggestions;
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
    return getTimeBasedSuggestions(new Date().getHours()).slice(0, targetCount);
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

  // Fill up to targetCount if we don't have enough
  if (combinedSuggestions.length < targetCount) {
    const additionalNeeded = targetCount - combinedSuggestions.length;

    if (additionalNeeded > 0) {
      const currentIds = new Set(combinedSuggestions.map((g) => g.id));
      const additionalSuggestions = getExplorationSuggestions(
        currentIds,
        additionalNeeded,
        new Date().getHours(),
      );

      // Add the additional suggestions to the combined list
      combinedSuggestions.push(...additionalSuggestions);
    }
  }

  // Ensure we don't exceed maxSuggestions
  return combinedSuggestions.slice(0, targetCount);
}

export function getDefaultSuggestions(): SuggestionsWithMeta {
  const suggestions = getTimeBasedSuggestions(new Date().getHours());
  return {
    suggestions,
    source: "default",
    hasPreferences: false,
    explorationUsed: true,
  };
}
