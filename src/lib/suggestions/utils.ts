import type { CategoryGroup } from "@/types/categories";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import type { SuggestionMeta } from "@/hooks/usePersonalizedSuggestions";

/**
 * Check if a suggestion is a night-specific activity
 */
export function isNightSpecificSuggestion(suggestion: CategoryGroup): boolean {
  // Check direct subtypes and bar subtypes with prefix
  const isSubtypeNight =
    // Bar subtypes
    suggestion.id.startsWith("bars_") ||
    suggestion.id === "bars_bar" ||
    suggestion.id === "bars_wine_bar" ||
    suggestion.id === "bars_pub" ||
    suggestion.id === "bars_night_club" ||
    // Entertainment subtypes
    suggestion.id === "bowling_alley" ||
    suggestion.id === "karaoke" ||
    suggestion.id === "pool_hall" ||
    suggestion.id === "arcade" ||
    suggestion.id === "movie_theater" ||
    suggestion.id === "billiards";

  // Check if it's a general nightlife category (these are only considered night-specific at night)
  const isNightlifeCategory =
    suggestion.id === "entertainment" ||
    suggestion.id === "bars" ||
    suggestion.id === "arts";

  // Either it's a specific night subtype, or it's a nightlife category that's being shown at night
  const isNight = isSubtypeNight || isNightlifeCategory;

  // Log the check details to debug
  console.log(`[DEBUG] Night suggestion check for ${suggestion.title}:`, {
    id: suggestion.id,
    isNight,
    isSubtypeNight,
    isNightlifeCategory,
    title: suggestion.title,
    query: suggestion.query,
  });

  return isNight;
}

/**
 * Check if current time is late night (10pm-5am)
 */
export function isLateNightHour(): boolean {
  const currentHour = new Date().getHours();
  return currentHour < 5 || currentHour >= 22;
}

export function isExplorationSuggestion(
  suggestion: CategoryGroup,
  metadata: SuggestionMeta,
  suggestions: CategoryGroup[],
  maxSuggestions: number,
): boolean {
  console.log(`[DEBUG] Checking if ${suggestion.title} is exploration:`, {
    suggestionId: suggestion.id,
    hasExplorationSuggestions: !!metadata.explorationSuggestions,
    explorationSuggestionsCount: metadata.explorationSuggestions?.length || 0,
    explorationSuggestionIds:
      metadata.explorationSuggestions?.map((s) => s.id) || [],
  });

  // If no explorationSuggestions in metadata, fall back to position-based detection
  if (!metadata.explorationSuggestions) {
    if (!metadata.hasPreferences || !metadata.explorationUsed) {
      console.log(
        `[DEBUG] No preferences or explorationUsed=false, not exploration`,
      );
      return false;
    }

    // Default to standard ratio if we can't determine dynamically
    const defaultRatio = PERSONALIZATION_CONFIG.DEFAULT_EXPLOITATION_RATIO;
    const userPrefCount = metadata.userPreferencesCount || 0;

    // Use dynamic ratio calculation if available
    const dynamicRatio = PERSONALIZATION_CONFIG.getDynamicExploitationRatio
      ? PERSONALIZATION_CONFIG.getDynamicExploitationRatio(userPrefCount)
      : defaultRatio;

    const exploitationCount = Math.ceil(maxSuggestions * dynamicRatio);

    const index = suggestions.findIndex((s) => s.id === suggestion.id);
    const isExploration = index >= exploitationCount;

    console.log(`[DEBUG] Using position-based detection:`, {
      index,
      exploitationCount,
      isExploration,
    });

    return isExploration;
  }

  // If we have explicit exploration suggestions, use that
  const isExploration = metadata.explorationSuggestions.some(
    (s) => s.id === suggestion.id,
  );
  console.log(
    `[DEBUG] Using explorationSuggestions array, isExploration:`,
    isExploration,
  );
  return isExploration;
}

export function getSuggestionTooltipText(
  isExploration: boolean,
  suggestion: CategoryGroup,
  metadata: SuggestionMeta,
): string {
  const isPersonalized =
    metadata.hasPreferences &&
    (metadata.source === "user_preferences" || metadata.source === "mixed");

  // Check if this is a night-specific suggestion
  const isNightSpecific = isNightSpecificSuggestion(suggestion);

  // Check if it's late night hours
  const isLateNight = isLateNightHour();

  // Night suggestion requires both conditions
  const isNightSuggestion = isExploration && isNightSpecific && isLateNight;

  console.log(`[DEBUG] Tooltip for ${suggestion.title}:`, {
    isExploration,
    isNightSpecific,
    isLateNight,
    isNightSuggestion,
    suggestionId: suggestion.id,
    metadata: {
      hasPreferences: metadata.hasPreferences,
      source: metadata.source,
    },
    isPersonalized,
    result: isNightSuggestion
      ? "Popular night activity to explore"
      : isExploration
        ? "Discover something new"
        : isPersonalized
          ? "Based on your interactions"
          : "Based on the time of day",
  });

  if (isNightSuggestion) {
    return "Popular night activity to explore";
  } else if (isExploration) {
    return "Discover something new";
  } else if (isPersonalized) {
    return "Based on your interactions";
  } else {
    return "Based on the time of day";
  }
}

/**
 * Determines if a suggestion should be displayed with night styling
 * This combines several checks to ensure consistent handling
 */
export function isNightSuggestionForDisplay(
  suggestion: CategoryGroup,
  isExploration: boolean,
): boolean {
  const isNightSpecific = isNightSpecificSuggestion(suggestion);
  const isLateNight = isLateNightHour();

  // Special handling for entertainment, arts, and bars categories at night
  const isNightlifeCategoryAtNight =
    isLateNight &&
    (suggestion.id === "entertainment" ||
      suggestion.id === "bars" ||
      suggestion.id === "arts");

  // For exploration suggestions, apply night styling to:
  // 1. Night-specific subtypes (bowling, karaoke, etc.) at night
  // 2. General nightlife categories (entertainment, bars, arts) at night
  return (
    isExploration &&
    ((isNightSpecific && isLateNight) || isNightlifeCategoryAtNight)
  );
}
