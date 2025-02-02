import { useQuery } from "@tanstack/react-query";
import { PLACE_FILTERS, QUERY_KEYS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface SearchFilters {
  minRating?: number;
  openNow?: boolean;
  radius?: number;
}

interface UpdateSearchParamsProps {
  query?: string;
  filters?: SearchFilters;
  size?: number;
}

const defaultSize = 9;

export const useSearch = () => {
  const { coords, isLoading: isLoadingLocation } = useLocation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") ?? "";
  const minRating = searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : undefined;
  const openNow = searchParams.get("open") === "true";
  const radius = searchParams.get("radius")
    ? Number(searchParams.get("radius"))
    : undefined;
  const size = searchParams.get("size")
    ? Number(searchParams.get("size"))
    : defaultSize;

  const filters = {
    minRating,
    openNow,
    radius,
  };

  const updateSearchParams = ({
    query,
    filters,
    size,
  }: UpdateSearchParamsProps) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    if (
      filters?.radius !== undefined &&
      filters.radius !== PLACE_FILTERS.RADIUS.DEFAULT
    ) {
      params.set("radius", filters.radius.toString());
    } else {
      params.delete("radius");
    }

    if (filters?.minRating && filters.minRating !== PLACE_FILTERS.RATING.MIN) {
      params.set("rating", filters.minRating.toString());
    } else {
      params.delete("rating");
    }

    if (filters?.openNow) {
      params.set("open", "true");
    } else {
      params.delete("open");
    }

    if (size && size !== defaultSize) {
      params.set("size", size.toString());
    } else {
      params.delete("size");
    }

    const newParamsString = params.toString();
    const oldParamsString = searchParams.toString();

    if (newParamsString === oldParamsString) {
      return;
    }

    const targetPath = pathname === "/" ? "/discover" : pathname;
    router.push(`${targetPath}?${newParamsString}`, { scroll: false });
  };

  return {
    query,
    filters,
    size,
    updateSearchParams,
    ...useQuery({
      queryKey: [QUERY_KEYS.SEARCH, query, filters, size, coords],
      queryFn: () => searchPlacesClient(query, size, coords, filters),
      enabled: !isLoadingLocation && query.length > 0,
      staleTime: 1000 * 60 * 5,
    }),
  };
};
