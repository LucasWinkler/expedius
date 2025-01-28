import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";

interface UseSearchProps {
  query: string;
  size?: number;
  enabled?: boolean;
}

export const useSearch = ({ query, size = 9 }: UseSearchProps) => {
  const { coords, isLoading: isLoadingLocation } = useLocation();

  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH, query, coords?.latitude, coords?.longitude],
    queryFn: () => searchPlacesClient(query, size, coords),
    enabled: !isLoadingLocation && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
