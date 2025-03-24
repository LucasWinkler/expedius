"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { SuggestionSkeleton } from "./SuggestionSkeleton";
import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import {
  isExplorationSuggestion,
  getSuggestionTooltipText,
} from "@/lib/suggestions/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SUGGESTION_CONTEXTS } from "@/lib/suggestions";

export const PersonalizedSearchSuggestions = () => {
  const { suggestions, isLoading, metadata, suggestionsCount } =
    usePersonalizedSuggestions({
      context: SUGGESTION_CONTEXTS.HOME,
    });

  if (isLoading) {
    return <SuggestionSkeleton context={SUGGESTION_CONTEXTS.HOME} />;
  }

  return (
    <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
      {suggestions.map((suggestion) => {
        const isExploration = isExplorationSuggestion(
          suggestion,
          metadata,
          suggestions,
          suggestionsCount,
        );

        return (
          <Tooltip disableHoverableContent key={suggestion.id}>
            <TooltipTrigger asChild>
              <Link
                href={`/explore?q=${encodeURIComponent(suggestion.query)}`}
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
            <TooltipContent side="bottom" className="mt-2 text-xs">
              {getSuggestionTooltipText(isExploration, suggestion, metadata)}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
