import type { CategoryGroup } from "@/types/categories";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import type { SuggestionMeta } from "@/hooks/usePersonalizedSuggestions";

/**
 * Check if current time is late night (10pm-5am)
 */
export function isLateNightHour(): boolean {
  const currentHour = new Date().getHours();
  return currentHour < 5 || currentHour >= 22;
}

/**
 * Check if it's very late (past typical closing hours)
 */
export function isVeryLateHour(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 2 && currentHour < 5;
}

/**
 * Check if a suggestion should be suppressed based on operating hours
 */
function isOutsideOperatingHours(suggestion: CategoryGroup): boolean {
  const currentHour = new Date().getHours();
  const isSports =
    suggestion.id.includes("sports") || suggestion.id.includes("skating");
  const isIndoorSports =
    suggestion.id.includes("indoor") || suggestion.id.includes("gym");

  // Most sports venues close by 10-11 PM
  if (isSports && !isIndoorSports && currentHour >= 22) {
    return true;
  }

  // Indoor sports/gyms might close later
  if (isIndoorSports && currentHour >= 23) {
    return true;
  }

  // Very late hour checks (2 AM - 5 AM)
  if (isVeryLateHour()) {
    return (
      suggestion.id === "entertainment_bowling_alley" ||
      suggestion.id === "entertainment_arcade" ||
      suggestion.id === "entertainment_movie_theater" ||
      suggestion.id === "arts_movie_theater" ||
      suggestion.id.includes("skating") ||
      suggestion.id.includes("sports") ||
      (suggestion.id.includes("restaurant") &&
        !suggestion.id.includes("24_hour"))
    );
  }

  return false;
}

/**
 * Check if a suggestion is a night-specific activity by its inherent nature
 * This only checks the category/type, not the time of day
 */
export function isNightSpecificSuggestion(suggestion: CategoryGroup): boolean {
  // Check if the suggestion has isNightSuggestion metadata property
  if (suggestion.metadata?.isNightSuggestion) {
    return true;
  }

  // Check specific subtypes that are inherently night-oriented
  return (
    // Bar and nightlife categories
    (suggestion.id.startsWith("bars_") &&
      suggestion.id !== "restaurants_bar_and_grill") ||
    suggestion.id === "bars" ||
    suggestion.id === "night_club" ||
    suggestion.id === "nightlife" ||
    // Entertainment subtypes that are typically open late
    suggestion.id === "entertainment_karaoke" ||
    suggestion.id === "entertainment_pool_hall" ||
    suggestion.id === "entertainment_billiards" ||
    suggestion.id === "entertainment_arcade" ||
    suggestion.id === "entertainment_nightclub" ||
    // Late night movie showings (but not all movie theaters)
    (suggestion.id === "entertainment_movie_theater" && isLateNightHour()) ||
    (suggestion.id === "arts_movie_theater" && isLateNightHour()) ||
    // Performance venues during show times
    ((suggestion.id === "arts_concert_hall" ||
      suggestion.id === "arts_theater" ||
      suggestion.id === "arts_performing_arts_theater") &&
      isLateNightHour())
  );
}

export function isExplorationSuggestion(
  suggestion: CategoryGroup,
  metadata: SuggestionMeta,
  suggestions: CategoryGroup[],
  maxSuggestions: number,
): boolean {
  // Check if this is explicitly marked as a random exploration suggestion
  if (suggestion.metadata?.isRandomExploration) {
    return true;
  }

  // First check if this is explicitly marked as an exploitation suggestion
  if (
    metadata?.exploitationSuggestions?.some((s) => {
      // Check exact ID match
      if (s.id === suggestion.id) return true;
      // Check if this is a subtype of an exploitation category
      // e.g. if "restaurants" is in exploitation, "restaurants_bar_and_grill" should also be exploitation
      if (suggestion.id.startsWith(s.id + "_")) return true;
      return false;
    })
  ) {
    return false;
  }

  // If we have explicit exploration suggestions, use that
  if (metadata.explorationSuggestions?.length) {
    return metadata.explorationSuggestions.some((s) => s.id === suggestion.id);
  }

  // If no explorationSuggestions in metadata, fall back to position-based detection
  if (!metadata.hasPreferences || !metadata.explorationUsed) {
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

  // Check if this is a random exploration suggestion
  const isRandomExploration = suggestion.metadata?.isRandomExploration === true;

  // Check if this should display with night styling (regardless of whether it's an "exploration" suggestion)
  const shouldUseNightStyling =
    isNightSpecificSuggestion(suggestion) && isLateNightHour();

  console.log(`[DEBUG] Tooltip for ${suggestion.title}:`, {
    isExploration,
    isNightSpecific,
    isLateNight,
    isNightSuggestion: isExploration && isNightSpecific && isLateNight,
    shouldUseNightStyling,
    isRandomExploration,
    suggestionId: suggestion.id,
    metadata: {
      hasPreferences: metadata.hasPreferences,
      source: metadata.source,
    },
    isPersonalized,
    result: shouldUseNightStyling
      ? "Popular nightlife activity"
      : isRandomExploration
        ? "Completely random category to try"
        : isExploration
          ? "Discover something new"
          : isPersonalized
            ? "Based on your interactions"
            : "Based on the time of day",
  });

  // First check if this should use night styling, regardless of exploration status
  if (shouldUseNightStyling) {
    return "Popular nightlife activity";
  } else if (isRandomExploration) {
    return "Completely random category to try";
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
 * This is the main function that should be used for UI decisions
 */
export function isNightSuggestionForDisplay(
  suggestion: CategoryGroup,
  metadata?: SuggestionMeta,
): boolean {
  // If this is an exploitation suggestion, never show night styling
  if (metadata?.exploitationSuggestions?.some((s) => s.id === suggestion.id)) {
    return false;
  }

  // First check if it's outside operating hours
  if (isOutsideOperatingHours(suggestion)) {
    return false;
  }

  // Then check if it's late night hours
  if (!isLateNightHour()) {
    return false;
  }

  return isNightSpecificSuggestion(suggestion);
}
