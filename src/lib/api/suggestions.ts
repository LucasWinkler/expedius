import type { CategoryGroup } from "@/types/categories";
import { SuggestionsContext } from "../suggestions";

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

    return response.json();
  } catch (error) {
    console.error("Error fetching personalized suggestions:", error);
    throw error;
  }
};
