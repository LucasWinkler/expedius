"use client";

import { cn } from "@/lib/utils";
import { CategoryCard } from "./CategoryCard";
import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import { Sparkles, ArrowRight } from "lucide-react";
import { ExploreCategoriesSkeleton } from "./ExploreCategoriesSkeleton";
import type { SuggestionsContext } from "@/lib/suggestions";
import Link from "next/link";

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
    return <ExploreCategoriesSkeleton context={context} />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          {metadata.hasPreferences
            ? "Recommended for You"
            : "Popular Right Now"}
        </h2>
        {metadata.hasPreferences ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-3.5 text-primary/70" />
            Personalized
          </div>
        ) : (
          <Link
            href="/auth/sign-up"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Sparkles className="size-3.5" />
            Get personalized recommendations
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {suggestions.map((suggestion, index) => {
          return (
            <CategoryCard
              key={suggestion.id}
              title={suggestion.title}
              query={suggestion.query}
              imageUrl={suggestion.imageUrl || "/place-image-fallback.webp"}
              index={index}
              isExploration={
                metadata.explorationUsed &&
                metadata.explorationSuggestions?.some(
                  (s) => s.id === suggestion.id,
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
};
