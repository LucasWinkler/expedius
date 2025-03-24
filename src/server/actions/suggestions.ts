"use server";

import { cache } from "react";
import { getServerSession } from "../auth/session";
import { userTypePreferences } from "../data/userTypePreferences";
import {
  getCategoryGroupsFromTypes,
  DEFAULT_CATEGORY_GROUPS,
  type CategoryGroup,
} from "@/constants/categoryGroups";

const MAX_SUGGESTIONS = 5;

type SuggestionsWithSource = {
  suggestions: CategoryGroup[];
  source: "default" | "user_preferences" | "mixed";
  hasPreferences: boolean;
  userPreferencesCount?: number;
  defaultsUsed?: boolean;
};

export const getPersonalizedSuggestions = cache(
  async (): Promise<CategoryGroup[]> => {
    const session = await getServerSession();

    let result: SuggestionsWithSource;

    if (!session?.user?.id) {
      result = {
        suggestions: DEFAULT_CATEGORY_GROUPS.slice(0, MAX_SUGGESTIONS),
        source: "default",
        hasPreferences: false,
      };

      console.debug(
        "[SERVER DEBUG] Using default suggestions (no session):",
        result,
      );

      return enhanceSuggestionsWithMetadata(result.suggestions, result);
    }

    try {
      const userPrefs =
        await userTypePreferences.queries.getUserTypePreferences(
          session.user.id,
        );

      if (
        (!userPrefs.primaryTypes || userPrefs.primaryTypes.length === 0) &&
        (!userPrefs.allTypes || userPrefs.allTypes.length === 0)
      ) {
        result = {
          suggestions: DEFAULT_CATEGORY_GROUPS.slice(0, MAX_SUGGESTIONS),
          source: "default",
          hasPreferences: false,
        };

        console.debug(
          "[SERVER DEBUG] Using default suggestions (no preferences):",
          result,
        );

        return enhanceSuggestionsWithMetadata(result.suggestions, result);
      }

      // Get the top types from user preferences (prioritize primaryTypes)
      const topTypes = [
        ...userPrefs.primaryTypes.slice(0, 10).map((pref) => pref.placeType),
        ...userPrefs.allTypes.slice(0, 15).map((pref) => pref.placeType),
      ];

      // Convert types to category groups
      let categoryGroups = getCategoryGroupsFromTypes(topTypes);
      let source: SuggestionsWithSource["source"] = "user_preferences";

      // If we don't have enough groups, add defaults to fill up to MAX_SUGGESTIONS
      if (categoryGroups.length < MAX_SUGGESTIONS) {
        const existingGroupIds = new Set(categoryGroups.map((g) => g.id));
        const additionalGroups = DEFAULT_CATEGORY_GROUPS.filter(
          (group) => !existingGroupIds.has(group.id),
        ).slice(0, MAX_SUGGESTIONS - categoryGroups.length);

        categoryGroups = [...categoryGroups, ...additionalGroups];
        source = additionalGroups.length > 0 ? "mixed" : "user_preferences";
      }

      result = {
        suggestions: categoryGroups.slice(0, MAX_SUGGESTIONS),
        source,
        hasPreferences: true,
        userPreferencesCount:
          userPrefs.primaryTypes.length + userPrefs.allTypes.length,
        defaultsUsed: source === "mixed",
      };

      console.debug(
        "[SERVER DEBUG] Generated personalized suggestions:",
        result,
      );

      return enhanceSuggestionsWithMetadata(result.suggestions, result);
    } catch (error) {
      console.error("Error fetching personalized suggestions:", error);

      result = {
        suggestions: DEFAULT_CATEGORY_GROUPS.slice(0, MAX_SUGGESTIONS),
        source: "default",
        hasPreferences: false,
      };

      console.debug(
        "[SERVER DEBUG] Error fallback to default suggestions:",
        result,
      );

      return enhanceSuggestionsWithMetadata(result.suggestions, result);
    }
  },
);

const enhanceSuggestionsWithMetadata = (
  suggestions: CategoryGroup[],
  metadata: SuggestionsWithSource,
): CategoryGroup[] => {
  return Object.assign([...suggestions], {
    source: metadata.source,
    hasPreferences: metadata.hasPreferences,
    userPreferencesCount: metadata.userPreferencesCount,
    defaultsUsed: metadata.defaultsUsed,
  });
};
