import type { CategoryGroup } from "@/types/categories";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import type { SuggestionMeta } from "@/hooks/usePersonalizedSuggestions";

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

  console.log(`[DEBUG] Tooltip for ${suggestion.title}:`, {
    isExploration,
    suggestionId: suggestion.id,
    metadata: {
      hasPreferences: metadata.hasPreferences,
      source: metadata.source,
    },
    isPersonalized,
    result: isExploration
      ? "Discover something new"
      : isPersonalized
        ? "Based on your interactions"
        : "Based on the time of day",
  });

  if (isExploration) {
    return "Discover something new";
  } else if (isPersonalized) {
    return "Based on your interactions";
  } else {
    return "Based on the time of day";
  }
}
