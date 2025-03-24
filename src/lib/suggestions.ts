import type { CategoryGroup } from "@/types/categories";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";
import { weightedRandomSelection } from "@/lib/utils/math";
import { getSpecificTypeSuggestions } from "@/utils/categories";

export const PERSONALIZATION_CONFIG = {
  MAX_SUGGESTIONS: 5,
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
    return [
      CATEGORY_GROUPS.restaurants, // 24-hour restaurants, late-night food
      CATEGORY_GROUPS.bars, // Bars and nightlife
      CATEGORY_GROUPS.entertainment, // Entertainment options
      CATEGORY_GROUPS.cafes, // 24-hour cafes
      CATEGORY_GROUPS.desserts, // Late night dessert cravings
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

    if (hour >= 5 && hour < 12) return timeAppropriate.morning;
    if (hour >= 12 && hour < 15) return timeAppropriate.lunch;
    if (hour >= 15 && hour < 18) return timeAppropriate.afternoon;
    if (hour >= 18 && hour < 22) return timeAppropriate.evening;
    return timeAppropriate.lateNight;
  };

  // Add appropriate categories based on time
  Object.values(CATEGORY_GROUPS).forEach((group) => {
    if (isTimeAppropriate(group)) {
      suggestions.push(group);
    }
  });

  return suggestions;
}

export function getExplorationSuggestions(
  excludeIds: Set<string>,
  count: number,
  hour: number,
): CategoryGroup[] {
  const timeOfDay: TimeOfDay =
    hour >= 5 && hour < 11
      ? "morning"
      : hour >= 11 && hour < 14
        ? "lunch"
        : hour >= 14 && hour < 17
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
): CategoryGroup[] {
  const { MAX_SUGGESTIONS, getDynamicExploitationRatio } =
    PERSONALIZATION_CONFIG;

  // If no user preferences, return time-based suggestions
  if (userPreferences.length === 0) {
    return getTimeBasedSuggestions(new Date().getHours());
  }

  // Get specific type suggestions based on user preferences
  const specificSuggestions = getSpecificTypeSuggestions(
    userPreferences,
    MAX_SUGGESTIONS,
  );

  // Calculate user preference count for dynamic ratio adjustment
  const userPreferencesCount = userPreferences.length;

  // Get dynamic exploitation ratio based on user preference count
  const exploitationRatio = getDynamicExploitationRatio(userPreferencesCount);

  // Calculate exploitation vs exploration counts
  const exploitationCount = Math.ceil(MAX_SUGGESTIONS * exploitationRatio);
  const explorationCount = MAX_SUGGESTIONS - exploitationCount;

  // Get user's most engaged categories (exploitation)
  const exploitationSuggestions = specificSuggestions.slice(
    0,
    exploitationCount,
  );

  // Create a set of already selected category IDs to avoid duplicates
  const selectedIds = new Set(exploitationSuggestions.map((g) => g.id));

  // Get exploration suggestions (categories user hasn't engaged with much)
  // Use time-based recommendations to influence exploration
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

  // Fill up to MAX_SUGGESTIONS if we don't have enough
  if (combinedSuggestions.length < MAX_SUGGESTIONS) {
    const additionalNeeded = MAX_SUGGESTIONS - combinedSuggestions.length;

    if (additionalNeeded > 0) {
      // Get additional exploration suggestions, excluding all current ones
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

  // Ensure we don't exceed MAX_SUGGESTIONS
  return combinedSuggestions.slice(0, MAX_SUGGESTIONS);
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
