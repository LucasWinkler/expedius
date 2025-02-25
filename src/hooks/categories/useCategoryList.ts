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
  const {
    coords,
    isLoading: isLoadingLocation,
    permissionState,
  } = useLocation();

  const useLocationBias =
    !isLoadingLocation &&
    permissionState === "granted" &&
    coords.latitude !== null &&
    coords.longitude !== null;

  const queries = useQueries({
    queries: HOME_CATEGORIES.map(({ query }) => ({
      queryKey: [QUERY_KEYS.CATEGORIES, query, useLocationBias ? coords : null],
      queryFn: () =>
        searchPlacesClient(
          query,
          6,
          useLocationBias ? coords : { latitude: null, longitude: null },
        ),
      enabled: !isLoadingLocation || permissionState !== "prompt",
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
