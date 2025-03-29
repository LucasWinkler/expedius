import { useQuery } from "@tanstack/react-query";
import { SuggestionsContext } from "@/lib/suggestions";
import { fetchSuggestionsWithFallback } from "@/lib/api/suggestions";
import { QUERY_KEYS } from "@/constants";
import { useMemo } from "react";

interface UsePersonalizedSuggestionsOptions {
  context?: SuggestionsContext;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Calculate milliseconds until the next hour change
 */
const calculateTimeUntilNextHour = (): number => {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);

  return nextHour.getTime() - now.getTime();
};

export const usePersonalizedSuggestions = (
  options: UsePersonalizedSuggestionsOptions = {},
) => {
  const timeUntilNextHour = useMemo(() => calculateTimeUntilNextHour(), []);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.SUGGESTIONS, options.context],
    queryFn: () =>
      fetchSuggestionsWithFallback({
        context: options.context,
      }),
    staleTime: options.staleTime ?? timeUntilNextHour,
    gcTime: options.cacheTime ?? timeUntilNextHour + 5 * 60 * 1000, // next hour + 5 minutes
  });

  const suggestions = data?.suggestions || [];
  const metadata = data?.metadata || {
    source: "default",
    hasPreferences: false,
  };

  return {
    suggestions,
    isLoading,
    metadata,
    suggestionsCount: suggestions.length,
    error,
  };
};
