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
import { RANDOM_EXPLORATION_PROBABILITY } from "@/lib/suggestions/constants";

interface ClientTimeInfo {
  timezoneOffset: number;
  clientHour: number;
}

// Updated metadata interface to match what's expected by the return type
interface SuggestionMetadata {
  source: SuggestionSource;
  hasPreferences: boolean;
  userPreferencesCount?: number;
  explorationUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
  exploitationIds: string[];
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
      metadata: SuggestionMetadata;
    }> {
      let result: SuggestionsWithMeta;

      // Get the client's hour if provided, otherwise use server time
      const clientHour =
        timeInfo?.clientHour !== undefined && timeInfo.clientHour >= 0
          ? timeInfo.clientHour
          : new Date().getHours();

      const maxSuggestions = SUGGESTION_COUNTS[context];
      const isLateNight = clientHour < 5 || clientHour >= 22;
      const isVeryLate = clientHour >= 2 && clientHour < 5;

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

          // Create expanded set to avoid duplicates by category root
          const expandedSelectedIds = new Set(selectedIds);

          // Also add root categories to prevent duplication
          selectedIds.forEach((id) => {
            if (id.includes("_")) {
              const rootCategory = id.split("_")[0];
              expandedSelectedIds.add(rootCategory);
            }
          });

          const additionalSuggestions = getExplorationSuggestions(
            expandedSelectedIds, // Use expanded set here
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
            exploitationIds: [], // Add empty array for non-logged in users
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
              exploitationIds: [], // Add empty array for no preferences
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

        // Create a more robust set of excluded IDs to avoid duplicates between exploitation and exploration
        const expandedSelectedIds = new Set<string>(selectedIds);

        // Modified deduplication logic to allow different subtypes from the same category
        selectedIds.forEach((id) => {
          // If this is a parent category (like "restaurants"), add it to expanded set
          // This prevents showing both "restaurants" and "restaurants_X" together
          if (!id.includes("_")) {
            expandedSelectedIds.add(id);
          }
          // If this is a subtype (like "restaurants_restaurant")
          else {
            const rootCategory = id.split("_")[0];
            const specificType = id.split("_")[1];

            // Add the specific subtype to exclusion set
            expandedSelectedIds.add(id);

            // Add the root category only if the subtype is the default type
            // e.g., if "restaurants_restaurant" is selected, exclude "restaurants"
            // but if "restaurants_thai_restaurant" is selected, don't exclude "restaurants"
            if (specificType === rootCategory) {
              expandedSelectedIds.add(rootCategory);
              console.log(
                `[SERVER INFO] Added root category ${rootCategory} to expanded exclusion set for ${id} (default type)`,
              );
            } else {
              console.log(
                `[SERVER INFO] Not excluding root category ${rootCategory} for ${id} (specific subtype)`,
              );
            }
          }
        });

        // First, try to add within-category exploration (from categories user likes but types they haven't tried)
        // Increasing the percentage for within-category exploration to 80% (up from 60%)
        const withinCategorySlots = Math.ceil(
          timeAdjustedExplorationCount * 0.8,
        );
        const categoryExplorationSuggestions =
          getCategoryExplorationSuggestions(
            [...userPrefs.primaryTypes, ...userPrefs.allTypes],
            selectedIds,
            withinCategorySlots,
          );

        // Add some logging to show the exploration suggestions
        console.log(
          "[SERVER INFO] Within-category exploration suggestions:",
          categoryExplorationSuggestions.map((s) => s.id),
        );

        // Update selected IDs with category exploration suggestions
        categoryExplorationSuggestions.forEach((s) => selectedIds.add(s.id));

        // If we're in late night hours, ensure some night-appropriate exploration
        const nightSpecificSuggestions: CategoryGroup[] = [];

        if (isLateNight && timeAdjustedExplorationCount > 0) {
          // Calculate minimum night suggestions based on total count
          // Base ratio: 1/5 = 0.2 (ensures 1 night suggestion for 5 total)
          const baseNightRatio = 0.2;

          // For very late hours (2am-5am), increase the ratio
          const timeMultiplier = isLateNight ? 1.5 : 1;
          const nightSuggestionRatio = baseNightRatio * timeMultiplier;

          // Calculate minimum night suggestions, ensuring at least 1
          const minNightSuggestions = Math.max(
            1,
            Math.min(
              Math.ceil(maxSuggestions * nightSuggestionRatio),
              Math.floor(timeAdjustedExplorationCount * 0.75), // Cap at 75% of exploration slots
            ),
          );

          // This will result in:
          // Regular late night (10pm-2am):
          //   - 5 suggestions: ceil(5 * 0.2) = 1 night suggestion
          //   - 6 suggestions: ceil(6 * 0.2) = 2 night suggestions
          //   - 8 suggestions: ceil(8 * 0.2) = 2 night suggestions
          // Very late (2am-5am):
          //   - 5 suggestions: ceil(5 * 0.2 * 1.5) = 2 night suggestions
          //   - 6 suggestions: ceil(6 * 0.2 * 1.5) = 2 night suggestions
          //   - 8 suggestions: ceil(8 * 0.2 * 1.5) = 3 night suggestions

          // Identify strong night categories that user might not have interacted with
          const nightCategories = [
            "bars",
            "entertainment",
            "arts",
            "restaurants",
            "desserts",
            "sports",
            "markets",
          ];

          // Ensure we have enough night suggestions by trying multiple categories
          let attempts = 0;
          const maxAttempts = nightCategories.length;

          while (
            nightSpecificSuggestions.length < minNightSuggestions &&
            attempts < maxAttempts
          ) {
            // Try each category type until we have enough suggestions
            const categoryToTry =
              nightCategories[attempts % nightCategories.length];

            if (!selectedIds.has(categoryToTry)) {
              const group = CATEGORY_GROUPS[categoryToTry];
              if (group) {
                // Get appropriate subtypes for the time of day
                let subtypes: CategoryGroup[] = [];

                if (categoryToTry === "bars") {
                  subtypes = group.types
                    .filter((type) =>
                      ["bar", "wine_bar", "pub", "night_club"].includes(
                        type.id,
                      ),
                    )
                    .map((type) => ({
                      id: `bars_${type.id}`,
                      title: type.name,
                      query: type.name.toLowerCase(),
                      purpose: "primary" as const,
                      imageUrl: type.imageUrl || group.imageUrl,
                      types: [type],
                      weight: 15,
                      metadata: {
                        isNightSuggestion: true,
                        timeAppropriate: {
                          ...(group.metadata?.timeAppropriate || {}),
                          lateNight: true,
                        },
                      },
                    }));
                } else if (categoryToTry === "entertainment") {
                  subtypes = group.types
                    .filter(
                      (type) =>
                        [
                          "karaoke",
                          "pool_hall",
                          "billiards",
                          "nightclub",
                        ].includes(type.id) ||
                        (type.id === "movie_theater" && !isLateNight), // Only include movie theaters if not late night
                    )
                    .map((type) => ({
                      id: `entertainment_${type.id}`,
                      title: type.name,
                      query: type.name.toLowerCase(),
                      purpose: "primary" as const,
                      imageUrl: type.imageUrl || group.imageUrl,
                      types: [type],
                      weight: 15,
                      metadata: {
                        isNightSuggestion: true,
                        timeAppropriate: {
                          ...(group.metadata?.timeAppropriate || {}),
                          lateNight: true,
                        },
                      },
                    }));
                } else if (categoryToTry === "restaurants") {
                  // Focus on late-night appropriate restaurants
                  subtypes = group.types
                    .filter((type) => ["bar_and_grill"].includes(type.id))
                    .map((type) => ({
                      id: `restaurants_${type.id}`,
                      title: type.name,
                      query: type.name.toLowerCase(),
                      purpose: "primary" as const,
                      imageUrl: type.imageUrl || group.imageUrl,
                      types: [type],
                      weight: 14,
                      metadata: {
                        isNightSuggestion: true,
                        timeAppropriate: {
                          ...(group.metadata?.timeAppropriate || {}),
                          lateNight: true,
                        },
                      },
                    }));
                }

                if (subtypes.length > 0) {
                  const selectedSubtype = weightedRandomSelection(
                    subtypes,
                    1,
                  )[0];
                  if (selectedSubtype && !selectedIds.has(selectedSubtype.id)) {
                    nightSpecificSuggestions.push(selectedSubtype);
                    selectedIds.add(selectedSubtype.id);
                    selectedIds.add(categoryToTry); // Prevent using this category again
                  }
                }
              }
            }
            attempts++;
          }

          // If we still don't have enough night suggestions, add some general night categories
          if (nightSpecificSuggestions.length < minNightSuggestions) {
            const generalNightCategories = nightCategories
              .filter((id) => !selectedIds.has(id))
              .map((id) => CATEGORY_GROUPS[id])
              .filter(Boolean)
              .map((group) => ({
                ...group,
                metadata: {
                  ...group.metadata,
                  isNightSuggestion: true,
                },
              }));

            const selectedGeneralCategories = weightedRandomSelection(
              generalNightCategories,
              minNightSuggestions - nightSpecificSuggestions.length,
            );

            nightSpecificSuggestions.push(...selectedGeneralCategories);
          }
        }

        // If we don't have enough category exploration suggestions, fill with general exploration
        const totalExplorationCount = timeAdjustedExplorationCount;

        // Always reserve at least 1 slot for random exploration
        // regardless of how many other suggestions we have
        const randomExplorationSlots = 1;

        console.log(
          `[SERVER INFO] Reserving ${randomExplorationSlots} slot for random exploration out of ${totalExplorationCount} total exploration slots`,
        );

        // Now calculate how many slots we have left for category exploration
        // We want to prioritize category exploration over general exploration
        const availableForCategoryExploration = Math.max(
          0,
          totalExplorationCount -
            randomExplorationSlots -
            nightSpecificSuggestions.length,
        );

        // Make sure we allocate sufficient slots for category exploration (at least 1 if available)
        const maxCategoryExplorationSlots = Math.min(
          categoryExplorationSuggestions.length,
          availableForCategoryExploration,
        );

        // Always reserve at least 1 slot for random, with a 5% chance of showing it
        const randomExplorationSuggestions: CategoryGroup[] = [];

        // Roll once to decide if we include a random suggestion
        // This ensures we stick to the 5% probability strictly
        const randomRoll = Math.random();
        const includeRandomSuggestion =
          randomRoll < RANDOM_EXPLORATION_PROBABILITY;

        console.log(
          `[SERVER INFO] Random roll: ${randomRoll.toFixed(3)}, threshold: ${RANDOM_EXPLORATION_PROBABILITY}, include random: ${includeRandomSuggestion}`,
        );

        // If we want to include random exploration and have slots for it, get a random suggestion
        if (includeRandomSuggestion) {
          // Get candidates from all categories except what's excluded
          const allCategoryIds = Object.keys(CATEGORY_GROUPS);

          // Try to find categories not already included
          const eligibleCategoryIds = allCategoryIds.filter((id) => {
            const category = CATEGORY_GROUPS[id];

            // Skip if already selected
            if (selectedIds.has(id)) return false;

            // Skip subtypes of selected categories
            for (const selectedId of selectedIds) {
              if (id.startsWith(selectedId + "_")) return false;
            }

            // Skip categories that require explicit user intent
            if (category.metadata?.requiresUserIntent) return false;

            // Skip categories that aren't appropriate for the current time
            if (category.metadata?.timeAppropriate) {
              if (
                isVeryLate &&
                category.metadata.timeAppropriate.lateNight === false
              )
                return false;

              if (
                isLateNight &&
                category.metadata.timeAppropriate.lateNight === false
              )
                return false;

              // Apply more specific time filtering based on timeOfDay
              if (category.metadata.timeAppropriate[timeOfDay] === false)
                return false;
            }

            return true;
          });

          console.log(
            `[SERVER INFO] Found ${eligibleCategoryIds.length} eligible categories for random exploration`,
          );

          if (eligibleCategoryIds.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * eligibleCategoryIds.length,
            );
            const randomCategoryId = eligibleCategoryIds[randomIndex];
            const randomCategory = CATEGORY_GROUPS[randomCategoryId];

            // Add metadata to mark this as a random exploration
            const enhancedRandomCategory = {
              ...randomCategory,
              metadata: {
                ...randomCategory.metadata,
                isRandomExploration: true,
              },
            };

            randomExplorationSuggestions.push(enhancedRandomCategory);
            selectedIds.add(randomCategory.id);

            console.log(
              `[SERVER INFO] Added random exploration suggestion: ${randomCategory.id}`,
            );
          }
        }

        // Calculate how many regular general exploration suggestions we still need
        const generalExplorationNeeded = includeRandomSuggestion ? 0 : 1;

        // Ensure we're using the expanded selected IDs to avoid duplicates
        const generalExplorationSuggestions =
          generalExplorationNeeded > 0
            ? getExplorationSuggestions(
                expandedSelectedIds,
                generalExplorationNeeded,
                clientHour,
              )
            : [];

        // Make sure we're including our category exploration suggestions even if no random ones
        const finalCategoryExplorationSuggestions =
          maxCategoryExplorationSlots > 0
            ? categoryExplorationSuggestions.slice(
                0,
                maxCategoryExplorationSlots,
              )
            : [];

        // During very late hours, ensure night suggestions appear first and limit other exploration
        const orderedExplorationSuggestions = isVeryLate
          ? [
              ...nightSpecificSuggestions,
              ...randomExplorationSuggestions,
              ...finalCategoryExplorationSuggestions.slice(0, 1),
              ...generalExplorationSuggestions.slice(0, 1),
            ]
          : isLateNight
            ? [
                ...nightSpecificSuggestions,
                ...randomExplorationSuggestions,
                ...finalCategoryExplorationSuggestions.slice(0, 2),
                ...generalExplorationSuggestions.slice(0, 1),
              ]
            : [
                ...nightSpecificSuggestions,
                ...randomExplorationSuggestions,
                ...finalCategoryExplorationSuggestions,
                ...generalExplorationSuggestions,
              ];

        // Combine all suggestions with exploitation first, ensuring we have at least 6 total
        const combinedSuggestions = [
          ...exploitationSuggestions,
          ...orderedExplorationSuggestions,
        ];

        // For metadata tracking, ensure night suggestions are properly marked as exploration
        const allExplorationSuggestions = orderedExplorationSuggestions;

        // Deduplicate metadata suggestions as well
        const dedupedExploitationSuggestions = deduplicateSuggestions(
          exploitationSuggestions,
        );
        const dedupedExplorationSuggestions = deduplicateSuggestions(
          allExplorationSuggestions,
        );

        // Make sure exploitation suggestions are properly tracked for duplicate prevention
        const exploitationIds = Array.from(
          new Set(
            exploitationSuggestions.map((s) => {
              return s.id.includes("_") ? s.id.split("_")[0] : s.id;
            }),
          ),
        );

        // Log the final counts to debug
        const finalExploitationCount = dedupedExploitationSuggestions.length;
        const finalExplorationCount = dedupedExplorationSuggestions.length;
        const finalTotalCount =
          deduplicateSuggestions(combinedSuggestions).length;

        console.log(
          `[SERVER INFO] Final suggestion counts: ${finalExploitationCount} exploitation, ${finalExplorationCount} exploration, ${finalTotalCount} total`,
        );

        // Ensure we're returning all suggestions without over-deduplication
        result = {
          suggestions: combinedSuggestions, // Use combined before deduplication to preserve all types
          source: "user_preferences",
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
          // Store the exploitationIds in a property that's compatible with SuggestionsWithMeta
          metadata: {
            // We don't need to reference result.metadata here since we haven't assigned it yet
            timeInfo: timeInfo
              ? {
                  clientHour: timeInfo.clientHour,
                  timezoneOffset: timeInfo.timezoneOffset,
                }
              : undefined,
            userPreferences: {
              primaryTypes: userPrefs.primaryTypes,
              allTypes: userPrefs.allTypes,
            },
          },
        };

        console.log(
          `[SERVER INFO] Generated ${result.source} suggestions for user ${userId.slice(0, 8)}...`,
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
            exploitationIds: exploitationIds, // Use the calculated value
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
            exploitationIds: [], // Add empty array for fallback
          },
        };
      }
    },
  },
} as const;
