import {
  CATEGORY_GROUPS,
  DEFAULT_CATEGORY_GROUPS,
  MORNING_CATEGORY_GROUPS,
  LUNCH_CATEGORY_GROUPS,
  EVENING_CATEGORY_GROUPS,
  type CategoryGroup,
} from "@/constants/categoryGroups";
import { weightedRandomSelection } from "@/lib/utils/math";

export const PERSONALIZATION_CONFIG = {
  MAX_SUGGESTIONS: 5,
  DEFAULT_EXPLOITATION_RATIO: 0.7, // 70% familiar, 30% exploration as default

  // Get dynamic exploitation ratio based on user preference count
  // - New users (few preferences): More exploration
  // - Experienced users (many preferences): More exploitation
  getDynamicExploitationRatio(userPreferencesCount: number = 0): number {
    if (userPreferencesCount <= 3) {
      // New users: 60% exploitation / 40% exploration
      return 0.6;
    } else if (userPreferencesCount >= 15) {
      // Experienced users: 80% exploitation / 20% exploration
      return 0.8;
    } else {
      // Scale between 60-80% based on preference count
      // Linear interpolation between 0.6 and 0.8
      return 0.6 + (userPreferencesCount - 3) * (0.2 / 12);
    }
  },
};

// Late night category groups that make sense for after-hours browsing (10pm-6am)
// Now using metadata to determine appropriateness
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

/**
 * Types of suggestion sources
 */
export type SuggestionSource =
  | "default"
  | "user_preferences"
  | "mixed"
  | "exploration";

/**
 * Metadata about suggestions for debugging and client rendering
 */
export type SuggestionsWithMeta = {
  suggestions: CategoryGroup[];
  source: SuggestionSource;
  hasPreferences: boolean;
  userPreferencesCount?: number;
  defaultsUsed?: boolean;
  explorationUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
};

/**
 * Get time-appropriate default suggestions based on the provided hour
 * @param clientHour The hour (0-23) to use for time-based suggestions, defaults to current server hour
 */
export function getTimeBasedSuggestions(clientHour?: number): CategoryGroup[] {
  // Use provided hour or current hour if not provided
  const hour = clientHour !== undefined ? clientHour : new Date().getHours();

  if (hour >= 6 && hour < 11) {
    // Morning (6am-11am)
    return MORNING_CATEGORY_GROUPS;
  } else if (hour >= 11 && hour < 15) {
    // Lunch time (11am-3pm)
    return LUNCH_CATEGORY_GROUPS;
  } else if (hour >= 17 && hour < 22) {
    // Evening (5pm-10pm)
    return EVENING_CATEGORY_GROUPS;
  } else if (hour >= 22 || hour < 6) {
    // Late Night (10pm-6am)
    return getLateNightCategoryGroups();
  } else {
    // Default time
    return DEFAULT_CATEGORY_GROUPS;
  }
}

/**
 * Select categories for exploration based on weighted random selection
 * @param excludedIds Set of category IDs to exclude from selection
 * @param count Number of categories to select
 * @param clientHour Optional client hour (0-23) to influence time-appropriate suggestions
 */
export function getExplorationSuggestions(
  excludedIds: Set<string>,
  count: number,
  clientHour?: number,
): CategoryGroup[] {
  // Filter out excluded categories and get all categories with weights
  const availableCategories = Object.values(CATEGORY_GROUPS).filter(
    (category) => !excludedIds.has(category.id),
  );

  // If client hour is provided, adjust weights based on time appropriateness
  if (clientHour !== undefined) {
    const timeBasedSuggestions = getTimeBasedSuggestions(clientHour);
    const timeBasedIds = new Set(timeBasedSuggestions.map((group) => group.id));

    // Determine current time period
    const isLateNight = clientHour >= 22 || clientHour < 6;
    const isMorning = clientHour >= 6 && clientHour < 11;
    const isLunch = clientHour >= 11 && clientHour < 15;
    const isAfternoon = clientHour >= 15 && clientHour < 17;
    const isEvening = clientHour >= 17 && clientHour < 22;

    // Determine time period explicitly using all variables
    let currentTimePeriod:
      | "morning"
      | "lunch"
      | "afternoon"
      | "evening"
      | "lateNight";

    if (isLateNight) {
      currentTimePeriod = "lateNight";
    } else if (isMorning) {
      currentTimePeriod = "morning";
    } else if (isLunch) {
      currentTimePeriod = "lunch";
    } else if (isAfternoon) {
      currentTimePeriod = "afternoon";
    } else if (isEvening) {
      currentTimePeriod = "evening";
    } else {
      // This should never happen if our time periods are exhaustive,
      // but we'll default to evening as a fallback
      console.warn(`Unhandled time period for hour: ${clientHour}`);
      currentTimePeriod = "evening";
    }

    // Create a copy of available categories with boosted or reduced weights based on time appropriateness
    const boostedCategories = availableCategories.map((category) => {
      // First, check if this category is in the time-based suggestions
      // If it is, boost its weight significantly (3x)
      if (timeBasedIds.has(category.id)) {
        return {
          ...category,
          weight: (category.weight || 1) * 3,
        };
      }

      // Check time appropriateness from category metadata
      const timeAppropriate = category.metadata?.timeAppropriate;

      if (timeAppropriate) {
        // If the category is explicitly marked as not appropriate for current time
        // Reduce its weight significantly
        if (timeAppropriate[currentTimePeriod] === false) {
          return {
            ...category,
            weight: (category.weight || 1) * 0.2, // 80% reduction
          };
        }

        // If time appropriate, give it a slight boost
        if (timeAppropriate[currentTimePeriod] === true) {
          return {
            ...category,
            weight: (category.weight || 1) * 1.2, // 20% boost
          };
        }
      }

      // Default case - no change to weight
      return category;
    });

    // Apply weighted random selection with adjusted weights
    return weightedRandomSelection(boostedCategories, count);
  }

  // Apply regular weighted random selection
  return weightedRandomSelection(availableCategories, count);
}

/**
 * Add metadata to suggestions for client-side usage
 */
export function enhanceSuggestionsWithMetadata(
  suggestions: CategoryGroup[],
  metadata: SuggestionsWithMeta,
): CategoryGroup[] {
  return Object.assign([...suggestions], {
    source: metadata.source,
    hasPreferences: metadata.hasPreferences,
    userPreferencesCount: metadata.userPreferencesCount,
    defaultsUsed: metadata.defaultsUsed,
    explorationUsed: metadata.explorationUsed,
    exploitationSuggestions: metadata.exploitationSuggestions,
    explorationSuggestions: metadata.explorationSuggestions,
  });
}
