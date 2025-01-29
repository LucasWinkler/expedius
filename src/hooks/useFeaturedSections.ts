import { useQueries } from "@tanstack/react-query";
import { FEATURED_SECTIONS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import type { PlaceSearchResponse } from "@/types";

interface FeaturedSectionData {
  title: string;
  query: string;
  response: PlaceSearchResponse | null;
  isPending: boolean;
  isError: boolean;
}

export const useFeaturedSections = (): FeaturedSectionData[] => {
  const { coords, isLoading: isLoadingLocation } = useLocation();

  const queries = useQueries({
    queries: FEATURED_SECTIONS.map(({ query }) => ({
      queryKey: ["featuredSection", query, coords],
      queryFn: () => searchPlacesClient(query, 6, coords),
      enabled: !isLoadingLocation,
    })),
  });

  return queries.map(({ data, isPending, isError }, index) => ({
    title: FEATURED_SECTIONS[index].title,
    query: FEATURED_SECTIONS[index].query,
    response: data ?? null,
    isPending,
    isError,
  }));
};
