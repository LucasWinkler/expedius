import type { CategoryGroup } from "@/types/categories";

/**
 * Removes duplicate suggestions based on suggestion ID
 * @param suggestions Array of suggestions to deduplicate
 * @returns Array of deduplicated suggestions
 */
export function deduplicateSuggestions(
  suggestions: CategoryGroup[],
): CategoryGroup[] {
  const uniqueIds = new Set<string>();
  return suggestions.filter((suggestion) => {
    if (uniqueIds.has(suggestion.id)) {
      return false;
    }
    uniqueIds.add(suggestion.id);
    return true;
  });
}

/**
 * Checks if an array of suggestions contains any duplicates by ID
 * @param suggestions Array of suggestions to check
 * @returns true if duplicates exist, false otherwise
 */
export function hasDuplicateSuggestions(suggestions: CategoryGroup[]): boolean {
  const ids = new Set<string>();
  for (const suggestion of suggestions) {
    if (ids.has(suggestion.id)) {
      return true;
    }
    ids.add(suggestion.id);
  }
  return false;
}

/**
 * Logs warning if duplicates are found in suggestion arrays
 * @param suggestions Main suggestions array to check
 * @param meta Optional metadata containing additional suggestion arrays to check
 */
export function validateSuggestions(
  suggestions: CategoryGroup[],
  meta?: {
    exploitationSuggestions?: CategoryGroup[];
    explorationSuggestions?: CategoryGroup[];
  },
): void {
  if (hasDuplicateSuggestions(suggestions)) {
    console.warn(
      "[WARN] Duplicate suggestions detected in main suggestions array",
    );
  }

  if (
    meta?.exploitationSuggestions &&
    hasDuplicateSuggestions(meta.exploitationSuggestions)
  ) {
    console.warn(
      "[WARN] Duplicate suggestions detected in exploitationSuggestions",
    );
  }

  if (
    meta?.explorationSuggestions &&
    hasDuplicateSuggestions(meta.explorationSuggestions)
  ) {
    console.warn(
      "[WARN] Duplicate suggestions detected in explorationSuggestions",
    );
  }
}
