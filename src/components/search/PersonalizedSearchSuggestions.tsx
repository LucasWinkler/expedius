"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SEARCH_SUGGESTIONS } from "@/constants";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import { type CategoryGroup } from "@/constants/categoryGroups";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPersonalizedSuggestions } from "@/lib/api/suggestions";
import { cn } from "@/lib/utils";

type SuggestionMeta = {
  source: string;
  hasPreferences: boolean;
  explorationUsed?: boolean;
  exploitationSuggestions?: CategoryGroup[];
  explorationSuggestions?: CategoryGroup[];
  userPreferencesCount?: number;
};

export const PersonalizedSearchSuggestions = () => {
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

        console.log("[DEBUG] Raw suggestion response:", response);

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
          types: [],
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const isExplorationSuggestion = (suggestion: CategoryGroup): boolean => {
    console.debug(`[DEBUG] Checking if ${suggestion.title} is exploration:`, {
      suggestionId: suggestion.id,
      hasExplorationSuggestions: !!metadata.explorationSuggestions,
      explorationSuggestionsCount: metadata.explorationSuggestions?.length || 0,
      explorationSuggestionIds:
        metadata.explorationSuggestions?.map((s) => s.id) || [],
    });

    // If no explorationSuggestions in metadata, fall back to position-based detection
    if (!metadata.explorationSuggestions) {
      if (!metadata.hasPreferences || !metadata.explorationUsed) {
        console.log(
          `[DEBUG] No preferences or explorationUsed=false, not exploration`,
        );
        return false;
      }

      // Default to standard ratio if we can't determine dynamically
      const defaultRatio = PERSONALIZATION_CONFIG.DEFAULT_EXPLOITATION_RATIO;
      const userPrefCount = metadata.userPreferencesCount || 0;

      // Use dynamic ratio calculation if available
      const dynamicRatio = PERSONALIZATION_CONFIG.getDynamicExploitationRatio
        ? PERSONALIZATION_CONFIG.getDynamicExploitationRatio(userPrefCount)
        : defaultRatio;

      const exploitationCount = Math.ceil(
        PERSONALIZATION_CONFIG.MAX_SUGGESTIONS * dynamicRatio,
      );

      const index = suggestions.findIndex((s) => s.id === suggestion.id);
      const isExploration = index >= exploitationCount;

      console.debug(`[DEBUG] Using position-based detection:`, {
        index,
        exploitationCount,
        isExploration,
      });

      return isExploration;
    }

    // If we have explicit exploration suggestions, use that
    const isExploration = metadata.explorationSuggestions.some(
      (s) => s.id === suggestion.id,
    );
    console.debug(
      `[DEBUG] Using explorationSuggestions array, isExploration:`,
      isExploration,
    );
    return isExploration;
  };

  // Helper function for determining tooltip text
  const getTooltipText = (
    isExploration: boolean,
    suggestion: CategoryGroup,
  ): string => {
    const isPersonalized =
      metadata.hasPreferences &&
      (metadata.source === "user_preferences" || metadata.source === "mixed");

    console.debug(`[DEBUG] Tooltip for ${suggestion.title}:`, {
      isExploration,
      suggestionId: suggestion.id,
      metadata: {
        hasPreferences: metadata.hasPreferences,
        source: metadata.source,
      },
      isPersonalized,
      result: isExploration
        ? "Discover something new"
        : isPersonalized
          ? "Based on your interactions"
          : "Popular suggestion",
    });

    if (isExploration) {
      return "Discover something new";
    } else if (isPersonalized) {
      return "Based on your interactions";
    } else {
      return "Popular suggestion";
    }
  };

  return (
    <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
      {suggestions.map((suggestion) => {
        const isExploration = isExplorationSuggestion(suggestion);

        return (
          <TooltipProvider key={suggestion.id} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/discover?q=${encodeURIComponent(suggestion.query)}`}
                  className={cn(
                    "group inline-flex items-center rounded-full border shadow-sm backdrop-blur-sm transition-all hover:bg-background/80 hover:text-foreground hover:shadow",
                    "px-3.5 py-1.5 text-sm sm:px-4 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-sm",
                    "lg:px-4 lg:py-2 lg:text-sm xl:px-4 xl:py-2 xl:text-sm 2xl:px-4 2xl:py-2 2xl:text-base",
                    isExploration ? "text-foreground" : "text-foreground/90",
                    isExploration
                      ? "border-primary/30 bg-background/65 hover:border-primary/50"
                      : "border-border/40 bg-background/75 shadow hover:border-border/60",
                  )}
                  aria-label={`Search for ${suggestion.title}`}
                  data-personalized={metadata.hasPreferences}
                  data-exploration={isExploration}
                >
                  {isExploration && (
                    <Sparkles className="mr-1.5 size-3.5 text-primary/70 sm:size-3.5 md:size-4 lg:size-3.5 xl:size-3.5 2xl:size-4" />
                  )}
                  {suggestion.title}
                  <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-3.5 md:size-4 lg:size-3.5 xl:size-3.5 2xl:size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {getTooltipText(isExploration, suggestion)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

const LoadingSkeleton = () => {
  // Simple set of widths to ensure proper wrapping (first item short to guarantee 3+2 layout)
  const widthVariations = [
    "w-20", // Extra short (first item - helps ensure 3+2 layout)
    "w-32", // Medium
    "w-28", // Medium-short
    "w-40", // Extra long
    "w-36", // Long
  ];

  return (
    <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
      {Array.from({ length: PERSONALIZATION_CONFIG.MAX_SUGGESTIONS }).map(
        (_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-7 rounded-full sm:h-8 md:h-9 lg:h-9 xl:h-9 2xl:h-10",
              widthVariations[i % widthVariations.length],
            )}
          />
        ),
      )}
    </div>
  );
};
