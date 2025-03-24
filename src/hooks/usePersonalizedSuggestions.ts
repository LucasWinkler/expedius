import { useState, useEffect } from "react";
import { type CategoryGroup } from "@/constants/categoryGroups";
import { SEARCH_SUGGESTIONS } from "@/constants";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import { getPersonalizedSuggestions } from "@/lib/api/suggestions";

export type SuggestionMeta = {
  source: string;
  hasPreferences: boolean;
  explorationUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
  userPreferencesCount?: number;
};

export function usePersonalizedSuggestions() {
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
        const response = await getPersonalizedSuggestions();

        console.debug("[DEBUG] Raw suggestion response:", response);

        if (response && response.suggestions && response.metadata) {
          const suggestionsArray = response.suggestions;

          const meta: SuggestionMeta = {
            source: response.metadata.source || "default",
            hasPreferences: response.metadata.hasPreferences || false,
            explorationUsed: response.metadata.explorationUsed || false,
            exploitationSuggestions: response.metadata.exploitationSuggestions,
            explorationSuggestions: response.metadata.explorationSuggestions,
            userPreferencesCount: response.metadata.userPreferencesCount,
          };

          console.debug("[DEBUG] Extracted metadata:", {
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
          setSuggestions(
            Array.isArray(response)
              ? response
              : (response as unknown as { suggestions?: CategoryGroup[] })
                  .suggestions || [],
          );
          setMetadata({
            source: "default",
            hasPreferences: false,
          });
        }
      } catch (error) {
        console.error("Failed to load personalized suggestions:", error);
        const fallbackSuggestions = SEARCH_SUGGESTIONS.slice(
          0,
          PERSONALIZATION_CONFIG.MAX_SUGGESTIONS,
        ).map((suggestion) => ({
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
        }));

        console.log("[INFO] Using client fallback suggestions");
        setSuggestions(fallbackSuggestions);
        setMetadata({
          source: "default",
          hasPreferences: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  return { suggestions, isLoading, metadata };
}
