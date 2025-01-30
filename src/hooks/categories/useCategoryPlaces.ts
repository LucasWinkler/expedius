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
  const { coords, isLoading: isLoadingLocation } = useLocation();

  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, query, coords],
    queryFn: () => searchPlacesClient(query, 6, coords),
    enabled: enabled && !isLoadingLocation,
  });
};
