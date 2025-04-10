"use client";

import { cn } from "@/lib/utils";
import { CategoryCard } from "./CategoryCard";
import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import { Sparkles, ArrowRight, Moon, Dices } from "lucide-react";
import { ExploreCategoriesSkeleton } from "./ExploreCategoriesSkeleton";
import type { SuggestionsContext } from "@/lib/suggestions";
import Link from "next/link";
import {
  getSuggestionTooltipText,
  isNightSuggestionForDisplay,
  isExplorationSuggestion,
} from "@/lib/suggestions/utils";
import { SUGGESTION_COUNTS, SUGGESTION_CONTEXTS } from "@/lib/suggestions";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from "@/components/ui/hybrid-tooltip";

interface ExploreEmptyStateProps {
  className?: string;
  context: SuggestionsContext;
}

export const ExploreEmptyState = ({
  className,
  context,
}: ExploreEmptyStateProps) => {
  const { suggestions, isLoading, metadata } = usePersonalizedSuggestions({
    context,
  });

  if (isLoading) {
    return (
      <ExploreCategoriesSkeleton context={context} className={className} />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="min-w-0 text-2xl font-semibold tracking-tight">
          {metadata.hasPreferences ? "Recommended for You" : "Popular Places"}
        </h2>
        {metadata.hasPreferences ? (
          <div className="flex shrink-0 items-center gap-3">
            {suggestions.some((s) =>
              isExplorationSuggestion(
                s,
                metadata,
                suggestions,
                SUGGESTION_COUNTS[SUGGESTION_CONTEXTS.EXPLORE],
              ),
            ) && (
              <HybridTooltip disableHoverableContent>
                <HybridTooltipTrigger>
                  <Sparkles className="size-[18px] shrink-0 text-blue-500" />
                </HybridTooltipTrigger>
                <HybridTooltipContent className="max-w-[16rem] text-sm">
                  Look for sparkles ✨ to discover new places similar to your
                  interests
                </HybridTooltipContent>
              </HybridTooltip>
            )}
            {suggestions.some(
              (s) => s.metadata?.isRandomExploration === true,
            ) && (
              <HybridTooltip disableHoverableContent>
                <HybridTooltipTrigger>
                  <Dices className="size-[18px] shrink-0 text-blue-500" />
                </HybridTooltipTrigger>
                <HybridTooltipContent className="max-w-[16rem] text-sm">
                  Look for dice 🎲 to discover completely random categories
                  outside your usual preferences
                </HybridTooltipContent>
              </HybridTooltip>
            )}
            {suggestions.some((s) =>
              isNightSuggestionForDisplay(s, metadata),
            ) && (
              <HybridTooltip disableHoverableContent>
                <HybridTooltipTrigger>
                  <Moon
                    className="size-[18px] shrink-0 text-indigo-400"
                    strokeWidth={2.5}
                  />
                </HybridTooltipTrigger>
                <HybridTooltipContent className="max-w-[16rem] text-sm">
                  Look for moon 🌙 to find nightlife activities during late
                  hours
                </HybridTooltipContent>
              </HybridTooltip>
            )}
          </div>
        ) : (
          <Link
            href="/auth/sign-up"
            className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Sparkles className="size-3.5 shrink-0" />
            <span className="flex items-center gap-1.5">
              Get recommendations
              <ArrowRight className="size-3.5 shrink-0" />
            </span>
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {suggestions.map((suggestion, index) => {
          const isExploration = isExplorationSuggestion(
            suggestion,
            metadata,
            suggestions,
            SUGGESTION_COUNTS[SUGGESTION_CONTEXTS.EXPLORE],
          );

          const isNightSuggestion = isNightSuggestionForDisplay(
            suggestion,
            metadata,
          );

          const isRandomExploration =
            suggestion.metadata?.isRandomExploration === true;

          return (
            <HybridTooltip key={suggestion.id}>
              <HybridTooltipTrigger asChild>
                <div>
                  <CategoryCard
                    title={suggestion.title}
                    query={suggestion.query}
                    imageUrl={
                      suggestion.imageUrl || "/place-image-fallback.webp"
                    }
                    index={index}
                    isExploration={isExploration}
                    isNightSuggestion={isNightSuggestion}
                    isRandomExploration={isRandomExploration}
                  />
                </div>
              </HybridTooltipTrigger>
              <HybridTooltipContent className="max-w-[16rem] text-sm">
                {getSuggestionTooltipText(isExploration, suggestion, metadata)}
              </HybridTooltipContent>
            </HybridTooltip>
          );
        })}
      </div>
    </div>
  );
};
