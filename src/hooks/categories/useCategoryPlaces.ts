import { useQuery } from "@tanstack/react-query";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import { QUERY_KEYS } from "@/constants";
import { useMemo } from "react";

interface UseCategoryPlacesOptions {
  query: string;
  enabled?: boolean;
}

export const useCategoryPlaces = ({
  query,
  enabled = true,
}: UseCategoryPlacesOptions) => {
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

  const shouldEnableQuery = useMemo(() => {
    if (!enabled) return false;

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
  }, [
    enabled,
    permissionState,
    isLoadingLocation,
    coords,
    isPermissionPending,
  ]);

  return useQuery({
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
        console.error(`[CATEGORY] Error fetching "${query}":`, error);
        throw error;
      }
    },
    enabled: shouldEnableQuery,
  });
};
