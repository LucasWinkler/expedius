import { useQuery } from "@tanstack/react-query";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import { QUERY_KEYS } from "@/constants";
import { useMemo, useEffect } from "react";

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
    requestLocation,
    hasRequestedLocation,
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

    if (isPermissionPending) return false;

    if (permissionState === "granted" && isLoadingLocation) return false;

    if (["denied", "unavailable", "timeout"].includes(permissionState))
      return true;

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

  useEffect(() => {
    if (enabled && !hasRequestedLocation) {
      void requestLocation();
    }
  }, [enabled, hasRequestedLocation, requestLocation]);

  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, query, useLocationBias ? coords : null],
    queryFn: async () => {
      try {
        if (!hasRequestedLocation) {
          await requestLocation();
        }

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
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
