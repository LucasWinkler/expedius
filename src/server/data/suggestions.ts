import "server-only";

import { userTypePreferences } from "./userTypePreferences";
import {
  getCategoryGroupsFromTypes,
  getSpecificTypeSuggestions,
  getCategoryExplorationSuggestions,
} from "@/utils/categories";
import type { CategoryGroup } from "@/types/categories";
import {
  getTimeBasedSuggestions,
  getExplorationSuggestions,
  type SuggestionsWithMeta,
  type SuggestionSource,
  SuggestionsContext,
  SUGGESTION_COUNTS,
  SUGGESTION_CONTEXTS,
} from "@/lib/suggestions";
import { CATEGORY_GROUPS } from "@/constants/categoryGroups";
import { weightedRandomSelection } from "@/lib/utils/math";
import { deduplicateSuggestions } from "@/utils/suggestions";

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
      context: SuggestionsContext,
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
      let result: SuggestionsWithMeta;

      // Get the client's hour if provided, otherwise use server time
      const clientHour =
        timeInfo?.clientHour !== undefined && timeInfo.clientHour >= 0
          ? timeInfo.clientHour
          : new Date().getHours();

      const maxSuggestions = SUGGESTION_COUNTS[context];
      const isLateNight = clientHour < 5 || clientHour >= 22;

      // Special handling for explore page during late night
      const isExploreContext = context === SUGGESTION_CONTEXTS.EXPLORE;

      // If user is not logged in, return time-based suggestions
      if (!userId) {
        let timeBasedSuggestions = getTimeBasedSuggestions(clientHour);

        // For explore page at night, ensure we have more variety
        if (
          isExploreContext &&
          isLateNight &&
          timeBasedSuggestions.length < maxSuggestions
        ) {
          // Add some exploration suggestions to compensate
          const selectedIds = new Set(timeBasedSuggestions.map((s) => s.id));
          const additionalSuggestions = getExplorationSuggestions(
            selectedIds,
            maxSuggestions - timeBasedSuggestions.length,
            clientHour,
          );

          timeBasedSuggestions = [
            ...timeBasedSuggestions,
            ...additionalSuggestions,
          ];
        }

        // Deduplicate suggestions before returning
        const dedupedSuggestions = deduplicateSuggestions(
          timeBasedSuggestions,
        ).slice(0, maxSuggestions);

        result = {
          suggestions: dedupedSuggestions,
          source: "default",
          hasPreferences: false,
          explorationUsed: true,
        };

        console.log(
          `[SERVER INFO] Using time-based suggestions (no session, count: ${dedupedSuggestions.length})`,
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

          // Deduplicate suggestions before returning
          const dedupedSuggestions = deduplicateSuggestions(
            timeBasedSuggestions,
          ).slice(0, maxSuggestions);

          result = {
            suggestions: dedupedSuggestions,
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
        // Less exploitation = more exploration
        const minExploitationRatio = 0.2;
        const maxExploitationRatio = 0.6;
        const exploitationRatio = Math.min(
          maxExploitationRatio,
          Math.max(minExploitationRatio, 0.3 + userPreferencesCount * 0.01),
        );

        console.log(
          `[SERVER INFO] Using exploitation ratio: ${exploitationRatio.toFixed(2)} for user with ${userPreferencesCount} preferences`,
        );

        // Determine time of day for time-appropriate filtering
        const timeOfDay =
          clientHour >= 5 && clientHour < 11
            ? "morning"
            : clientHour >= 11 && clientHour < 15
              ? "lunch"
              : clientHour >= 15 && clientHour < 17
                ? "afternoon"
                : clientHour >= 17 && clientHour < 22
                  ? "evening"
                  : "lateNight";

        // Filter user preferences by time-appropriate categories
        // This ensures that categories like cafes don't appear at late night hours
        // even if they're in the user's preferences
        const timeAppropriatePreferences = [
          ...userPrefs.primaryTypes,
          ...userPrefs.allTypes,
        ].filter((pref) => {
          const categoryGroup = getCategoryGroupsFromTypes([pref.placeType])[0];
          return (
            !categoryGroup ||
            categoryGroup.metadata?.timeAppropriate?.[timeOfDay] !== false
          );
        });

        // Log time filtering info
        console.log(
          `[SERVER INFO] Time-based filtering for ${timeOfDay}: ${timeAppropriatePreferences.length} of ${userPreferencesCount} preferences are appropriate`,
        );

        // Adjust exploitation ratio based on how many preferences are appropriate for current time
        const timeAppropriateRatio = Math.min(
          1,
          timeAppropriatePreferences.length / userPreferencesCount,
        );

        // Only adjust ratio if we have a significant number of time-inappropriate preferences
        // This dynamically increases exploration and reduces exploitation when most user preferences
        // are inappropriate for the current time (e.g., cafes at night)
        const timeAdjustedExploitationRatio =
          timeAppropriateRatio < 0.8
            ? Math.max(
                minExploitationRatio,
                exploitationRatio * timeAppropriateRatio,
              )
            : exploitationRatio;

        // Recalculate counts with adjusted ratio
        const timeAdjustedExploitationCount = Math.ceil(
          maxSuggestions * timeAdjustedExploitationRatio,
        );
        const timeAdjustedExplorationCount =
          maxSuggestions - timeAdjustedExploitationCount;

        console.log(
          `[SERVER INFO] Time-adjusted exploitation ratio: ${timeAdjustedExploitationRatio.toFixed(2)} (original: ${exploitationRatio.toFixed(2)}, appropriate ratio: ${timeAppropriateRatio.toFixed(2)})`,
        );

        // Get specific type suggestions based on time-appropriate user preferences
        const specificTypeSuggestions = getSpecificTypeSuggestions(
          timeAppropriatePreferences,
          timeAdjustedExploitationCount,
          timeOfDay,
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
              ) && group.metadata?.timeAppropriate?.[timeOfDay] !== false,
          )
          .sort(() => Math.random() - 0.5)
          .slice(
            0,
            timeAdjustedExploitationCount -
              randomizedSpecificSuggestions.length,
          );

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
            timeAdjustedExplorationCount,
          );

        // If we're in late night hours, ensure some night-appropriate exploration
        let nightSpecificSuggestions: CategoryGroup[] = [];

        if (isLateNight && timeAdjustedExplorationCount > 0) {
          // Identify strong night categories that user might not have interacted with
          const nightCategories = ["bars", "entertainment", "arts"];
          const userCategoryIds = new Set([
            ...userPrefs.primaryTypes.map(
              (p) => getCategoryGroupsFromTypes([p.placeType])?.[0]?.id || "",
            ),
            ...userPrefs.allTypes.map(
              (p) => getCategoryGroupsFromTypes([p.placeType])?.[0]?.id || "",
            ),
          ]);

          // Find night categories the user hasn't engaged with much
          const unexploredNightCategories = nightCategories.filter(
            (id) =>
              !selectedIds.has(id) &&
              (!userCategoryIds.has(id) || Math.random() < 0.3), // Allow small chance even if they've engaged
          );

          if (unexploredNightCategories.length > 0) {
            // Add 1-2 night-specific categories if available
            const potentialNightSuggestions = unexploredNightCategories
              .map((id) => CATEGORY_GROUPS[id])
              .filter(Boolean);

            // For bar category, sometimes show specific subtypes instead
            const useBarsSubtypes =
              unexploredNightCategories.includes("bars") && Math.random() < 0.4;

            if (useBarsSubtypes) {
              // Replace 'bars' with specific bar subtypes
              const barsGroup = CATEGORY_GROUPS.bars;
              const barSubtypes: CategoryGroup[] = barsGroup.types
                .filter((type) =>
                  ["bar", "wine_bar", "pub", "night_club"].includes(type.id),
                )
                .map((type) => ({
                  id: `bars_${type.id}`,
                  title: type.name,
                  query: type.name.toLowerCase(),
                  purpose: "primary" as const,
                  imageUrl: type.imageUrl || barsGroup.imageUrl,
                  types: [type],
                  weight: 15,
                }));

              // Select one random bar subtype
              const selectedBarSubtype = weightedRandomSelection(
                barSubtypes,
                1,
              );

              // Filter out the general bars category and add the specific subtype
              const filteredNightSuggestions = potentialNightSuggestions.filter(
                (g) => g.id !== "bars",
              );

              // Take 1 night category, or 2 if we have enough exploration slots
              const nightCategoriesCount = Math.min(
                timeAdjustedExplorationCount > 1 ? 2 : 1,
                filteredNightSuggestions.length,
              );

              // Select from other night categories
              const otherNightCategories = weightedRandomSelection(
                filteredNightSuggestions,
                nightCategoriesCount,
              );

              nightSpecificSuggestions = [
                ...selectedBarSubtype,
                ...otherNightCategories,
              ];
            } else {
              // Regular selection of night categories
              // Take 1 night category, or 2 if we have enough exploration slots
              const nightCategoriesCount = Math.min(
                timeAdjustedExplorationCount > 1 ? 2 : 1,
                potentialNightSuggestions.length,
              );

              nightSpecificSuggestions = weightedRandomSelection(
                potentialNightSuggestions,
                nightCategoriesCount,
              );
            }

            // Add selected night categories to the selectedIds set
            nightSpecificSuggestions.forEach((cat) => selectedIds.add(cat.id));

            // Either use these as part of exploration or add them directly
            if (nightSpecificSuggestions.length > 0) {
              console.log(
                `[SERVER INFO] Added ${nightSpecificSuggestions.length} night-specific exploration options`,
              );
            }
          }
        }

        // If we don't have enough category exploration suggestions, fill with general exploration
        const remainingExplorationCount =
          timeAdjustedExplorationCount -
          categoryExplorationSuggestions.length -
          nightSpecificSuggestions.length;
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
          ...nightSpecificSuggestions, // Add night categories with priority
          ...categoryExplorationSuggestions,
          ...generalExplorationSuggestions,
        ];

        // For metadata tracking, ensure night suggestions are properly marked as exploration
        const allExplorationSuggestions = [
          ...nightSpecificSuggestions,
          ...categoryExplorationSuggestions,
          ...generalExplorationSuggestions,
        ];

        // Fill up to MAX_SUGGESTIONS if we don't have enough
        if (combinedSuggestions.length < maxSuggestions) {
          const additionalNeeded = maxSuggestions - combinedSuggestions.length;

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
            allExplorationSuggestions.push(...additionalSuggestions);

            console.log("[SERVER INFO] Updated exploration suggestions:", {
              original:
                allExplorationSuggestions.length - additionalSuggestions.length,
              additional: additionalSuggestions.length,
              total: allExplorationSuggestions.length,
            });
          }
        }

        // Final deduplication step to ensure no duplicates
        const dedupedSuggestions = deduplicateSuggestions(combinedSuggestions);

        // If deduplication reduced suggestions below maxSuggestions, add additional ones
        if (dedupedSuggestions.length < maxSuggestions) {
          const currentIds = new Set(dedupedSuggestions.map((g) => g.id));
          const additionalNeeded = maxSuggestions - dedupedSuggestions.length;

          console.log(
            `[SERVER INFO] After deduplication, need ${additionalNeeded} more suggestions`,
          );

          const extraSuggestions = getExplorationSuggestions(
            currentIds,
            additionalNeeded,
            clientHour,
          );

          dedupedSuggestions.push(...extraSuggestions);

          // Update exploration suggestions list for tracking
          allExplorationSuggestions.push(...extraSuggestions);
        }

        // Ensure we don't exceed MAX_SUGGESTIONS
        const finalSuggestions = dedupedSuggestions.slice(0, maxSuggestions);

        // Determine source based on what was used
        const source: SuggestionSource = "user_preferences";

        // Deduplicate metadata suggestions as well
        const dedupedExploitationSuggestions = deduplicateSuggestions(
          exploitationSuggestions,
        );
        const dedupedExplorationSuggestions = deduplicateSuggestions(
          allExplorationSuggestions,
        );

        result = {
          suggestions: finalSuggestions,
          source,
          hasPreferences: true,
          userPreferencesCount:
            userPrefs.primaryTypes.length + userPrefs.allTypes.length,
          defaultsUsed: generalExplorationSuggestions.length > 0,
          explorationUsed:
            nightSpecificSuggestions.length > 0 ||
            categoryExplorationSuggestions.length > 0 ||
            generalExplorationSuggestions.length > 0,
          exploitationSuggestions: dedupedExploitationSuggestions,
          explorationSuggestions: dedupedExplorationSuggestions,
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

        // Deduplicate suggestions before returning
        const dedupedSuggestions = deduplicateSuggestions(
          timeBasedSuggestions,
        ).slice(0, maxSuggestions);

        result = {
          suggestions: dedupedSuggestions,
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
