import type { CategoryGroup } from "@/types/categories";
import { SuggestionsContext } from "../suggestions";
import { validateSuggestions } from "@/utils/suggestions";
import { SEARCH_SUGGESTIONS } from "@/constants";
import { deduplicateSuggestions } from "@/utils/suggestions";

// Response type for personalized suggestions
export interface PersonalizedSuggestionsResponse {
  suggestions: CategoryGroup[];
  metadata: {
    source: string;
    hasPreferences: boolean;
    userPreferencesCount?: number;
    explorationUsed?: boolean;
    exploitationSuggestions?: CategoryGroup[];
    explorationSuggestions?: CategoryGroup[];
  };
}

export type SuggestionMeta = {
  source: string;
  hasPreferences: boolean;
  explorationUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
  userPreferencesCount?: number;
};

export interface SuggestionsWithMeta {
  suggestions: CategoryGroup[];
  metadata: SuggestionMeta;
}

interface GetPersonalizedSuggestionsOptions {
  context?: SuggestionsContext;
  timezoneOffset?: number;
  clientHour?: number;
}

/**
 * Fetch personalized suggestions from the server
 * @returns Object with suggestions array and metadata
 */
export const getPersonalizedSuggestions = async (
  options: GetPersonalizedSuggestionsOptions = {},
): Promise<PersonalizedSuggestionsResponse> => {
  try {
    // Use provided time data or get fresh data
    const timezoneOffset =
      options.timezoneOffset ?? new Date().getTimezoneOffset();
    const clientHour = options.clientHour ?? new Date().getHours();

    const response = await fetch(
      `/api/suggestions?context=${options.context || ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Timezone-Offset": timezoneOffset.toString(),
          "X-Client-Hour": clientHour.toString(),
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.status}`);
    }

    const data = await response.json();

    // Validate response for duplicates (this is just for debugging)
    if (data.suggestions && Array.isArray(data.suggestions)) {
      validateSuggestions(data.suggestions, {
        exploitationSuggestions: data.metadata?.exploitationSuggestions,
        explorationSuggestions: data.metadata?.explorationSuggestions,
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching personalized suggestions:", error);
    throw error;
  }
};

/**
 * Fetch personalized suggestions with fallback support
 * Handles API request, response processing, and client-side fallbacks
 */
export const fetchSuggestionsWithFallback = async (
  options: GetPersonalizedSuggestionsOptions = {},
): Promise<SuggestionsWithMeta> => {
  try {
    // Always get fresh time information when making the request
    // This ensures we're using the most current time data
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const clientHour = now.getHours();

    console.log(`[INFO] Fetching suggestions at hour ${clientHour}`);

    const response = await getPersonalizedSuggestions({
      context: options.context,
      timezoneOffset,
      clientHour,
    });

    console.log("[DEBUG] Raw suggestion response:", response);

    if (response && response.suggestions && response.metadata) {
      const suggestionsArray = deduplicateSuggestions(response.suggestions);

      const meta: SuggestionMeta = {
        source: response.metadata.source || "default",
        hasPreferences: response.metadata.hasPreferences || false,
        explorationUsed: response.metadata.explorationUsed || false,
        exploitationSuggestions: response.metadata.exploitationSuggestions
          ? deduplicateSuggestions(response.metadata.exploitationSuggestions)
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
        clientHour,
      });

      return {
        suggestions: suggestionsArray,
        metadata: meta,
      };
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

      return {
        suggestions: uniqueSuggestions,
        metadata: {
          source: "default",
          hasPreferences: false,
        },
      };
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
    return {
      suggestions: deduplicateSuggestions(fallbackSuggestions),
      metadata: {
        source: "default",
        hasPreferences: false,
      },
    };
  }
};
