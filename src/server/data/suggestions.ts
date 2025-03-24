import "server-only";

import { userTypePreferences } from "./userTypePreferences";
import {
  getCategoryGroupsFromTypes,
  type CategoryGroup,
  getSpecificTypeSuggestions,
  getCategoryExplorationSuggestions,
} from "@/constants/categoryGroups";
import {
  getTimeBasedSuggestions,
  getExplorationSuggestions,
  PERSONALIZATION_CONFIG,
  type SuggestionsWithMeta,
  type SuggestionSource,
} from "@/lib/suggestions";

interface ClientTimeInfo {
  timezoneOffset: number;
  clientHour: number;
}

/**
 * Data access methods for handling user suggestions
 */
export const suggestions = {
  queries: {
    /**
     * Get personalized category suggestions for a user
     * @param userId The user ID to get suggestions for, or null for non-authenticated users
     * @param timeInfo Client's time information for contextual suggestions
     * @returns Object containing suggestions array and metadata
     */
    async getPersonalizedSuggestions(
      userId: string | null,
      timeInfo?: ClientTimeInfo,
    ): Promise<{
      suggestions: CategoryGroup[];
      metadata: {
        source: SuggestionSource;
        hasPreferences: boolean;
        userPreferencesCount?: number;
        explorationUsed?: boolean;
        exploitationSuggestions?: CategoryGroup[];
        explorationSuggestions?: CategoryGroup[];
      };
    }> {
      const { MAX_SUGGESTIONS } = PERSONALIZATION_CONFIG;

      // For metadata tracking
      let result: SuggestionsWithMeta;

      // Get the client's hour if provided, otherwise use server time
      const clientHour =
        timeInfo?.clientHour !== undefined && timeInfo.clientHour >= 0
          ? timeInfo.clientHour
          : new Date().getHours();

      // If user is not logged in, return time-based suggestions
      if (!userId) {
        const timeBasedSuggestions = getTimeBasedSuggestions(clientHour);

        result = {
          suggestions: timeBasedSuggestions.slice(0, MAX_SUGGESTIONS),
          source: "default",
          hasPreferences: false,
          explorationUsed: true,
        };

        console.log("[SERVER INFO] Using time-based suggestions (no session)");

        return {
          suggestions: result.suggestions,
          metadata: {
            source: result.source,
            hasPreferences: result.hasPreferences,
            explorationUsed: result.explorationUsed,
          },
        };
      }

      try {
        // Get user type preferences from database
        const userPrefs =
          await userTypePreferences.queries.getUserTypePreferences(userId);

        // If user has no preferences, return time-based suggestions
        if (
          (!userPrefs.primaryTypes || userPrefs.primaryTypes.length === 0) &&
          (!userPrefs.allTypes || userPrefs.allTypes.length === 0)
        ) {
          const timeBasedSuggestions = getTimeBasedSuggestions(clientHour);

          result = {
            suggestions: timeBasedSuggestions.slice(0, MAX_SUGGESTIONS),
            source: "default",
            hasPreferences: false,
            explorationUsed: true,
          };

          console.log(
            "[SERVER INFO] Using time-based suggestions (no preferences)",
          );
          return {
            suggestions: result.suggestions,
            metadata: {
              source: result.source,
              hasPreferences: result.hasPreferences,
              explorationUsed: result.explorationUsed,
            },
          };
        }

        // Get the top types from user preferences (prioritize primaryTypes)
        const topTypes = [
          ...userPrefs.primaryTypes.slice(0, 10).map((pref) => pref.placeType),
          ...userPrefs.allTypes.slice(0, 15).map((pref) => pref.placeType),
        ];

        // Convert types to category groups
        const userCategoryGroups = getCategoryGroupsFromTypes(topTypes);

        // Calculate user preference count for dynamic ratio adjustment
        const userPreferencesCount =
          userPrefs.primaryTypes.length + userPrefs.allTypes.length;

        // Get dynamic exploitation ratio based on user preference count
        // More preferences = more exploitation, but with reasonable bounds
        const minExploitationRatio = 0.5; // At least 50% personal suggestions
        const maxExploitationRatio = 0.8; // At most 80% personal suggestions
        const exploitationRatio = Math.min(
          maxExploitationRatio,
          Math.max(minExploitationRatio, 0.5 + userPreferencesCount * 0.01),
        );

        console.log(
          `[SERVER INFO] Using exploitation ratio: ${exploitationRatio.toFixed(2)} for user with ${userPreferencesCount} preferences`,
        );

        // Calculate exploitation vs exploration counts
        const exploitationCount = Math.ceil(
          MAX_SUGGESTIONS * exploitationRatio,
        );
        const explorationCount = MAX_SUGGESTIONS - exploitationCount;

        // Get specific type suggestions based on user preferences
        const specificTypeSuggestions = getSpecificTypeSuggestions(
          [...userPrefs.primaryTypes, ...userPrefs.allTypes],
          exploitationCount,
        );

        // Randomize the order of specific type suggestions while respecting weights
        const randomizedSpecificSuggestions = specificTypeSuggestions
          .sort(() => Math.random() - 0.5)
          .sort((a, b) => (b.weight || 0) - (a.weight || 0));

        // Get category group suggestions
        const categoryGroupSuggestions = userCategoryGroups
          .filter(
            (group) =>
              !randomizedSpecificSuggestions.some((s) =>
                s.id.startsWith(group.id),
              ),
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, exploitationCount - randomizedSpecificSuggestions.length);

        // Combine specific type and category group suggestions
        const exploitationSuggestions = [
          ...randomizedSpecificSuggestions,
          ...categoryGroupSuggestions,
        ];

        // Create a set of already selected category IDs to avoid duplicates
        const selectedIds = new Set<string>(
          exploitationSuggestions.map((g: CategoryGroup) => g.id),
        );

        // Get exploration suggestions within categories the user likes
        const categoryExplorationSuggestions =
          getCategoryExplorationSuggestions(
            [...userPrefs.primaryTypes, ...userPrefs.allTypes],
            selectedIds,
            explorationCount,
          );

        // If we don't have enough category exploration suggestions, fill with general exploration
        const remainingExplorationCount =
          explorationCount - categoryExplorationSuggestions.length;
        const generalExplorationSuggestions =
          remainingExplorationCount > 0
            ? getExplorationSuggestions(
                selectedIds,
                remainingExplorationCount,
                clientHour,
              )
            : [];

        // Combine all suggestions
        const combinedSuggestions = [
          ...exploitationSuggestions,
          ...categoryExplorationSuggestions,
          ...generalExplorationSuggestions,
        ];

        // Fill up to MAX_SUGGESTIONS if we don't have enough
        if (combinedSuggestions.length < MAX_SUGGESTIONS) {
          const additionalNeeded = MAX_SUGGESTIONS - combinedSuggestions.length;

          if (additionalNeeded > 0) {
            console.log(
              `[SERVER INFO] Adding ${additionalNeeded} additional exploration suggestions to fill quota`,
            );

            // Get additional exploration suggestions, excluding all current ones
            const currentIds = new Set(combinedSuggestions.map((g) => g.id));
            const additionalSuggestions = getExplorationSuggestions(
              currentIds,
              additionalNeeded,
              clientHour,
            );

            // Add the additional suggestions to the combined list
            combinedSuggestions.push(...additionalSuggestions);

            // IMPORTANT: Also add them to the exploration suggestions list for proper tracking
            generalExplorationSuggestions.push(...additionalSuggestions);

            console.log("[SERVER INFO] Updated exploration suggestions:", {
              original:
                generalExplorationSuggestions.length -
                additionalSuggestions.length,
              additional: additionalSuggestions.length,
              total: generalExplorationSuggestions.length,
            });
          }
        }

        // Ensure we don't exceed MAX_SUGGESTIONS
        const finalSuggestions = combinedSuggestions.slice(0, MAX_SUGGESTIONS);

        // Determine source based on what was used
        const source: SuggestionSource = "user_preferences";

        result = {
          suggestions: finalSuggestions,
          source,
          hasPreferences: true,
          userPreferencesCount:
            userPrefs.primaryTypes.length + userPrefs.allTypes.length,
          defaultsUsed: generalExplorationSuggestions.length > 0,
          explorationUsed:
            categoryExplorationSuggestions.length > 0 ||
            generalExplorationSuggestions.length > 0,
          exploitationSuggestions,
          explorationSuggestions: [
            ...categoryExplorationSuggestions,
            ...generalExplorationSuggestions,
          ],
        };

        console.log(
          `[SERVER INFO] Generated ${source} suggestions for user ${userId.slice(0, 8)}...`,
        );

        return {
          suggestions: result.suggestions,
          metadata: {
            source: result.source,
            hasPreferences: result.hasPreferences,
            userPreferencesCount: result.userPreferencesCount,
            explorationUsed: result.explorationUsed,
            exploitationSuggestions: result.exploitationSuggestions,
            explorationSuggestions: result.explorationSuggestions,
          },
        };
      } catch (error) {
        console.error("Error fetching personalized suggestions:", error);

        // Fallback to time-based suggestions on error
        const timeBasedSuggestions = getTimeBasedSuggestions(clientHour);

        result = {
          suggestions: timeBasedSuggestions.slice(0, MAX_SUGGESTIONS),
          source: "default",
          hasPreferences: false,
          explorationUsed: true,
        };

        console.log("[SERVER INFO] Error fallback to time-based suggestions");
        return {
          suggestions: result.suggestions,
          metadata: {
            source: result.source,
            hasPreferences: result.hasPreferences,
            explorationUsed: result.explorationUsed,
          },
        };
      }
    },
  },
} as const;
