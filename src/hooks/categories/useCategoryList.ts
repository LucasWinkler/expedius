import { useQueries } from "@tanstack/react-query";
import { HOME_CATEGORIES, QUERY_KEYS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import type { PlaceSearchResponse } from "@/types";

interface UseCategoryListResponse {
  title: string;
  query: string;
  response: PlaceSearchResponse | null;
  isPending: boolean;
  isError: boolean;
}

export const useCategoryList = (): UseCategoryListResponse[] => {
  const { coords, isLoading: isLoadingLocation } = useLocation();

  const queries = useQueries({
    queries: HOME_CATEGORIES.map(({ query }) => ({
      queryKey: [QUERY_KEYS.CATEGORIES, query, coords],
      queryFn: () => searchPlacesClient(query, 6, coords),
      enabled: !isLoadingLocation,
    })),
  });

  return queries.map(({ data, isPending, isError }, index) => ({
    title: HOME_CATEGORIES[index].title,
    query: HOME_CATEGORIES[index].query,
    response: data ?? null,
    isPending,
    isError,
  }));
};
