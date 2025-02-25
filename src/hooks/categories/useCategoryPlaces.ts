import { useQuery } from "@tanstack/react-query";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import { QUERY_KEYS } from "@/constants";

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
  } = useLocation();

  const useLocationBias =
    !isLoadingLocation &&
    permissionState === "granted" &&
    coords.latitude !== null &&
    coords.longitude !== null;

  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, query, useLocationBias ? coords : null],
    queryFn: () =>
      searchPlacesClient(
        query,
        6,
        useLocationBias ? coords : { latitude: null, longitude: null },
      ),
    enabled: enabled && (!isLoadingLocation || permissionState !== "prompt"),
  });
};
