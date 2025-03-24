"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPersonalizedSuggestions } from "@/server/actions/suggestions";
import { Skeleton } from "@/components/ui/skeleton";
import { SEARCH_SUGGESTIONS } from "@/constants";
import { type CategoryGroup } from "@/constants/categoryGroups";

// Helper function to determine if we're in development
const isDev = process.env.NODE_ENV === "development";

export const PersonalizedSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        const personalizedSuggestions = await getPersonalizedSuggestions();

        // Get suggestion source from server action result
        const source = (personalizedSuggestions as any).source || "server";
        const isFromUserPrefs = source === "user_preferences";
        setIsPersonalized(isFromUserPrefs);

        // Log for debugging - only in development
        if (isDev) {
          console.debug("[DEBUG] Personalized suggestions:", {
            suggestions: personalizedSuggestions,
            source: source,
            isPersonalized: isFromUserPrefs,
          });
        } else {
          // In production, just log the basic info
          console.log("[INFO] Loaded suggestions source:", source);
        }

        setSuggestions(personalizedSuggestions);
      } catch (error) {
        console.error("Failed to load personalized suggestions:", error);
        // Fallback to default suggestions from constants
        const fallbackSuggestions = SEARCH_SUGGESTIONS.slice(0, 5).map(
          (suggestion) => ({
            id: suggestion.query,
            title: suggestion.title,
            query: suggestion.query,
            types: [],
          }),
        );

        if (isDev) {
          console.debug("[DEBUG] Using client fallback suggestions:", {
            suggestions: fallbackSuggestions,
            source: "client_fallback",
            isPersonalized: false,
          });
        } else {
          console.log("[INFO] Using client fallback suggestions");
        }

        setSuggestions(fallbackSuggestions);
        setIsPersonalized(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
      {suggestions.map((suggestion) => (
        <Link
          key={suggestion.id}
          href={`/discover?q=${encodeURIComponent(suggestion.query)}`}
          className={`group inline-flex items-center rounded-full border border-border/30 bg-background/50 px-3.5 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur-sm transition-all hover:border-border/50 hover:bg-background/80 hover:text-foreground hover:shadow sm:px-4 sm:py-2 sm:text-base 2xl:px-5 2xl:py-2.5 2xl:text-lg ${isPersonalized ? "personalized-suggestion" : ""}`}
          aria-label={`Search for ${suggestion.title}`}
          data-personalized={isPersonalized}
        >
          {suggestion.title}
          <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-4 2xl:size-5" />
        </Link>
      ))}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-8 w-20 rounded-full sm:h-10 sm:w-28 2xl:h-12 2xl:w-32"
      />
    ))}
  </div>
);
