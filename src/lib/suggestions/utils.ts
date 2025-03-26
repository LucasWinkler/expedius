import type { CategoryGroup } from "@/types/categories";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import type { SuggestionMeta } from "@/lib/api/suggestions";

/**
 * Check if current time is late night (10pm-5am)
 */
export function isLateNightHour(): boolean {
  const currentHour = new Date().getHours();
  return currentHour < 5 || currentHour >= 22;
}

/**
 * Check if it's very late (2am-5am)
 * Useful for prioritizing night suggestions during these hours
 */
export function isVeryLateHour(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 2 && currentHour < 5;
}

/**
 * Check if a suggestion is a night-specific activity
 * This is a simplified approach that clearly defines what's considered nightlife
 */
export function isNightSpecificSuggestion(suggestion: CategoryGroup): boolean {
  // Check if it has explicit night metadata
  if (suggestion.metadata?.isNightSuggestion) {
    return true;
  }

  // Define clear categories that are always considered nightlife
  const nightlifeCategories = [
    // Direct nightlife
    "bars",
    "night_club",
    "nightlife",

    // Nightlife entertainment
    "entertainment_bowling",
    "entertainment_bowling_alley",
    "entertainment_billiards",
    "entertainment_pool_hall",
    "entertainment_arcade",
    "entertainment_karaoke",
    "entertainment_nightclub",
  ];

  // For direct matches (e.g., "bars")
  if (nightlifeCategories.includes(suggestion.id)) {
    return true;
  }

  // For subtypes of bars (e.g., "bars_sports_bar", "bars_wine_bar")
  if (suggestion.id.startsWith("bars_")) {
    return true;
  }

  return false;
}

/**
 * Determines if a suggestion should be displayed with night styling
 * This is the main function that should be used for UI decisions
 */
export function isNightSuggestionForDisplay(
  suggestion: CategoryGroup,
  metadata?: SuggestionMeta,
): boolean {
  // Only show night styling during late night hours
  if (!isLateNightHour()) {
    return false;
  }

  // If this is an exploitation suggestion, never show night styling
  if (metadata?.exploitationSuggestions?.some((s) => s.id === suggestion.id)) {
    return false;
  }

  // Use our simplified night activity definition
  return isNightSpecificSuggestion(suggestion);
}

/**
 * Gets the tooltip text for a suggestion
 */
export function getSuggestionTooltipText(
  isExploration: boolean,
  suggestion: CategoryGroup,
  metadata: SuggestionMeta,
): string {
  const isPersonalized =
    metadata.hasPreferences &&
    (metadata.source === "user_preferences" || metadata.source === "mixed");

  const isRandomExploration = suggestion.metadata?.isRandomExploration === true;

  // If it's a night suggestion during late night hours, show nightlife tooltip
  const isNightSuggestion =
    isLateNightHour() && isNightSpecificSuggestion(suggestion);

  if (isNightSuggestion) {
    return "Popular nightlife activity";
  } else if (isRandomExploration) {
    return "Completely random category to try";
  } else if (isExploration) {
    return "Discover something new";
  } else if (isPersonalized) {
    return "Based on your interactions";
  } else {
    return "Popular suggestion";
  }
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
