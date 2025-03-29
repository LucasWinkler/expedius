"use client";

import { ArrowRight, Sparkles, Moon, Dices } from "lucide-react";
import Link from "next/link";
import { SuggestionSkeleton } from "./SuggestionSkeleton";
import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import {
  isExplorationSuggestion,
  getSuggestionTooltipText,
  isNightSuggestionForDisplay,
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

        const isNightSuggestion = isNightSuggestionForDisplay(
          suggestion,
          metadata,
        );

        const isRandomExploration =
          suggestion.metadata?.isRandomExploration === true;

        return (
          <Tooltip disableHoverableContent key={suggestion.id}>
            <TooltipTrigger asChild>
              <Link
                href={`/explore?q=${encodeURIComponent(suggestion.query)}`}
                className={cn(
                  "group relative inline-flex items-center rounded-full shadow-sm backdrop-blur-sm transition-all",
                  "px-3.5 py-1.5 text-sm sm:px-4 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-sm",
                  "lg:px-4 lg:py-2 lg:text-sm xl:px-4 xl:py-2 xl:text-sm 2xl:px-4 2xl:py-2 2xl:text-base",
                  isExploration || isNightSuggestion
                    ? "text-foreground"
                    : "text-foreground/90",
                  isExploration &&
                    !isNightSuggestion &&
                    "bg-background/80 shadow-[0_2px_8px_rgba(59,130,246,0.25)] before:absolute before:inset-0 before:animate-border-shimmer before:rounded-full before:bg-[linear-gradient(90deg,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0.2)_20%,rgba(59,130,246,0.35)_50%,rgba(59,130,246,0.2)_80%,rgba(59,130,246,0.15)_100%)] before:bg-[length:200%_100%] after:absolute after:inset-[2px] after:rounded-full after:bg-background/95 hover:shadow-[0_2px_12px_rgba(59,130,246,0.35)] hover:before:bg-[linear-gradient(90deg,rgba(59,130,246,0.2)_0%,rgba(59,130,246,0.25)_20%,rgba(59,130,246,0.4)_50%,rgba(59,130,246,0.25)_80%,rgba(59,130,246,0.2)_100%)]",
                  isNightSuggestion &&
                    "bg-background/80 shadow-[0_2px_8px_rgba(125,125,235,0.25)] before:absolute before:inset-0 before:animate-border-shimmer before:rounded-full before:bg-[linear-gradient(90deg,rgba(125,125,235,0.15)_0%,rgba(125,125,235,0.2)_20%,rgba(125,125,235,0.35)_50%,rgba(125,125,235,0.2)_80%,rgba(125,125,235,0.15)_100%)] before:bg-[length:200%_100%] after:absolute after:inset-[2px] after:rounded-full after:bg-background/95 hover:shadow-[0_2px_12px_rgba(125,125,235,0.35)] hover:before:bg-[linear-gradient(90deg,rgba(125,125,235,0.2)_0%,rgba(125,125,235,0.25)_20%,rgba(125,125,235,0.4)_50%,rgba(125,125,235,0.25)_80%,rgba(125,125,235,0.2)_100%)]",
                  !isExploration &&
                    !isNightSuggestion &&
                    "border border-border/40 bg-background/75 shadow hover:border-border/60 hover:bg-background/80 hover:shadow-md",
                )}
                aria-label={`Search for ${suggestion.title}`}
                data-personalized={metadata.hasPreferences}
                data-exploration={isExploration}
                data-night-suggestion={isNightSuggestion}
              >
                {isNightSuggestion ? (
                  <Moon
                    className="z-10 mr-1.5 size-3.5 text-indigo-400 drop-shadow-[0_0_3px_rgba(129,140,248,0.5)] sm:size-3.5 md:size-4 lg:size-3.5 xl:size-3.5 2xl:size-4"
                    aria-hidden="true"
                  />
                ) : isExploration && !isRandomExploration ? (
                  <Sparkles
                    className="z-10 mr-1.5 size-3.5 text-blue-400 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)] sm:size-3.5 md:size-4 lg:size-3.5 xl:size-3.5 2xl:size-4"
                    aria-hidden="true"
                  />
                ) : isRandomExploration ? (
                  <Dices
                    className="z-10 mr-1.5 size-3.5 text-blue-400 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)] sm:size-3.5 md:size-4 lg:size-3.5 xl:size-3.5 2xl:size-4"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative z-10">{suggestion.title}</span>
                <ArrowRight className="relative z-10 ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-3.5 md:size-4 lg:size-3.5 xl:size-3.5 2xl:size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mt-2 text-xs">
              {isNightSuggestion
                ? "Popular night activity to explore"
                : getSuggestionTooltipText(isExploration, suggestion, metadata)}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
