import { useState, useEffect } from "react";
import type { CategoryGroup } from "@/types/categories";
import { SEARCH_SUGGESTIONS } from "@/constants";
import { SuggestionsContext } from "@/lib/suggestions";
import { getPersonalizedSuggestions } from "@/lib/api/suggestions";
import { deduplicateSuggestions } from "@/utils/suggestions";

export type SuggestionMeta = {
  source: string;
  hasPreferences: boolean;
  explorationUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
  userPreferencesCount?: number;
};

interface UsePersonalizedSuggestionsOptions {
  context?: SuggestionsContext;
}

export function usePersonalizedSuggestions(
  options: UsePersonalizedSuggestionsOptions = {},
) {
  const [suggestions, setSuggestions] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<SuggestionMeta>({
    source: "default",
    hasPreferences: false,
  });

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        const response = await getPersonalizedSuggestions({
          context: options.context,
        });

        console.log("[DEBUG] Raw suggestion response:", response);

        if (response && response.suggestions && response.metadata) {
          const suggestionsArray = deduplicateSuggestions(response.suggestions);

          const meta: SuggestionMeta = {
            source: response.metadata.source || "default",
            hasPreferences: response.metadata.hasPreferences || false,
            explorationUsed: response.metadata.explorationUsed || false,
            exploitationSuggestions: response.metadata.exploitationSuggestions
              ? deduplicateSuggestions(
                  response.metadata.exploitationSuggestions,
                )
              : undefined,
            explorationSuggestions: response.metadata.explorationSuggestions
              ? deduplicateSuggestions(response.metadata.explorationSuggestions)
              : undefined,
            userPreferencesCount: response.metadata.userPreferencesCount,
          };

          console.log("[DEBUG] Extracted metadata:", {
            source: meta.source,
            hasPreferences: meta.hasPreferences,
            explorationUsed: meta.explorationUsed,
            userPreferencesCount: meta.userPreferencesCount,
          });

          setMetadata(meta);
          setSuggestions(suggestionsArray);
        } else {
          console.warn(
            "[WARN] Unexpected response format from suggestions API:",
            response,
          );
          const rawSuggestions = Array.isArray(response)
            ? response
            : (response as unknown as { suggestions?: CategoryGroup[] })
                .suggestions || [];

          const uniqueSuggestions = deduplicateSuggestions(rawSuggestions);

          setSuggestions(uniqueSuggestions);
          setMetadata({
            source: "default",
            hasPreferences: false,
          });
        }
      } catch (error) {
        console.error("Failed to load personalized suggestions:", error);
        const fallbackSuggestions = SEARCH_SUGGESTIONS.slice(0).map(
          (suggestion) => ({
            id: suggestion.query,
            title: suggestion.title,
            query: suggestion.query,
            purpose: "primary" as const,
            types: [
              {
                id: suggestion.query,
                name: suggestion.title,
                baseWeight: 10,
              },
            ],
          }),
        );

        console.log("[INFO] Using client fallback suggestions");
        setSuggestions(deduplicateSuggestions(fallbackSuggestions));
        setMetadata({
          source: "default",
          hasPreferences: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [options.context]);

  return {
    suggestions,
    isLoading,
    metadata,
    suggestionsCount: suggestions.length,
  };
}
