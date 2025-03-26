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
  const currentHour = useMemo(() => new Date().getHours(), []);
  const timeUntilNextHour = useMemo(() => calculateTimeUntilNextHour(), []);

  // Default staleTime to time until next hour or user-provided value
  const defaultStaleTime = Math.min(
    timeUntilNextHour,
    options.staleTime ?? 1000 * 60 * 30, // 30 minutes maximum
  );

  console.log("[DEBUG] Time until next hour:", timeUntilNextHour);
  console.log("[DEBUG] Default staleTime:", defaultStaleTime);
  console.log("[DEBUG] Current hour:", currentHour);
  console.log("[DEBUG] Options:", options);
  console.log("[DEBUG] Query key:", [
    QUERY_KEYS.SUGGESTIONS,
    options.context,
    currentHour,
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.SUGGESTIONS, options.context, currentHour],
    queryFn: () =>
      fetchSuggestionsWithFallback({
        context: options.context,
      }),
    staleTime: options.staleTime ?? defaultStaleTime,
    gcTime: options.cacheTime ?? 1000 * 60 * 60, // 1 hour by default
    refetchOnWindowFocus: false,
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
