import type { CategoryGroup } from "@/constants/categoryGroups";

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

/**
 * Fetch personalized suggestions from the server
 * @returns Object with suggestions array and metadata
 */
export const getPersonalizedSuggestions =
  async (): Promise<PersonalizedSuggestionsResponse> => {
    try {
      // Get client's timezone offset in minutes
      const timezoneOffset = new Date().getTimezoneOffset();

      // Get current client-side hour (0-23)
      const clientHour = new Date().getHours();

      const response = await fetch("/api/suggestions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Timezone-Offset": timezoneOffset.toString(),
          "X-Client-Hour": clientHour.toString(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching personalized suggestions:", error);
      throw error;
    }
  };
