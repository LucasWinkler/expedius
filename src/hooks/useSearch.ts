import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";

interface UseSearchProps {
  query: string;
  size?: number;
  coords?: { latitude: number | null; longitude: number | null };
  enabled?: boolean;
}

export const useSearch = ({
  query,
  coords,
  size = 9,
  enabled = true,
}: UseSearchProps) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH, query, coords?.latitude, coords?.longitude],
    queryFn: () => searchPlacesClient(query, size, coords),

    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
