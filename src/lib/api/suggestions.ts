import type { CategoryGroup } from "@/types/categories";
import { SuggestionsContext } from "../suggestions";
import { validateSuggestions } from "@/utils/suggestions";

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

interface GetPersonalizedSuggestionsOptions {
  context?: SuggestionsContext;
}

/**
 * Fetch personalized suggestions from the server
 * @returns Object with suggestions array and metadata
 */
export const getPersonalizedSuggestions = async (
  options: GetPersonalizedSuggestionsOptions = {},
): Promise<PersonalizedSuggestionsResponse> => {
  try {
    const timezoneOffset = new Date().getTimezoneOffset();
    const clientHour = new Date().getHours();

    const response = await fetch(
      `/api/suggestions?context=${options.context}`,
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
