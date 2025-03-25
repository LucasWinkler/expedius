"use client";

import { cn } from "@/lib/utils";
import { CategoryCard } from "./CategoryCard";
import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import { Sparkles, ArrowRight } from "lucide-react";
import { ExploreCategoriesSkeleton } from "./ExploreCategoriesSkeleton";
import type { SuggestionsContext } from "@/lib/suggestions";
import Link from "next/link";
import { TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Tooltip } from "../ui/tooltip";
import {
  getSuggestionTooltipText,
  isNightSuggestionForDisplay,
  isExplorationSuggestion,
} from "@/lib/suggestions/utils";
import { SUGGESTION_COUNTS, SUGGESTION_CONTEXTS } from "@/lib/suggestions";

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
          {metadata.hasPreferences
            ? "Recommended for You"
            : "Recommended at This Time"}
        </h2>
        {metadata.hasPreferences ? (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex shrink-0 items-center gap-1.5 text-sm text-primary">
                <Sparkles className="size-3.5 shrink-0 text-primary" />
                Personalized
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[16rem] text-sm">
              All recommendations are based on your interests. Look for sparkles
              ✨ to discover new places, and moon 🌙 for nightlife activities
              during late hours.
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent className="max-w-[16rem] text-sm">
              Sign up to receive personalized suggestions based on your
              interests. For now, we're showing suggestions based on the time of
              day - look for moon 🌙 for nightlife activities during late hours.
            </TooltipContent>
          </Tooltip>
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

          return (
            <Tooltip key={suggestion.id}>
              <TooltipTrigger asChild>
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
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[16rem] text-sm">
                {getSuggestionTooltipText(isExploration, suggestion, metadata)}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
