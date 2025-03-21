import { useQueries } from "@tanstack/react-query";
import { HOME_CATEGORIES, QUERY_KEYS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import { useMemo } from "react";
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
    isPermissionPending,
  } = useLocation();

  const useLocationBias = useMemo(() => {
    const result =
      permissionState === "granted" &&
      !isLoadingLocation &&
      !isPermissionPending &&
      coords.latitude !== null &&
      coords.longitude !== null;

    return result;
  }, [coords, isLoadingLocation, permissionState, isPermissionPending]);

  const shouldEnableQueries = useMemo(() => {
    // If location permission is still pending, don't query yet
    if (isPermissionPending) return false;

    // If permission granted but location still loading, don't query yet
    if (permissionState === "granted" && isLoadingLocation) return false;

    // If permission denied/unavailable/timeout, we can search without location
    if (["denied", "unavailable", "timeout"].includes(permissionState))
      return true;

    // If permission granted and we have location data, we can search
    if (
      permissionState === "granted" &&
      !isLoadingLocation &&
      coords.latitude !== null &&
      coords.longitude !== null
    )
      return true;

    return false;
  }, [permissionState, isLoadingLocation, coords, isPermissionPending]);

  const queries = useQueries({
    queries: HOME_CATEGORIES.map(({ query, title }) => ({
      queryKey: [QUERY_KEYS.CATEGORIES, query, useLocationBias ? coords : null],
      queryFn: async () => {
        try {
          const result = await searchPlacesClient(
            query,
            6,
            useLocationBias ? coords : { latitude: null, longitude: null },
          );

          return result;
        } catch (error) {
          console.error(`[CATEGORY_LIST] Error fetching "${title}":`, error);
          throw error;
        }
      },
      enabled: shouldEnableQueries,
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
