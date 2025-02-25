import { useQuery } from "@tanstack/react-query";
import { PLACE_FILTERS, QUERY_KEYS } from "@/constants";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Place } from "@/types";

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
  const {
    coords,
    isLoading: isLoadingLocation,
    permissionState,
  } = useLocation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const useLocationBias =
    !isLoadingLocation &&
    permissionState === "granted" &&
    coords.latitude !== null &&
    coords.longitude !== null;

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

  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string>(query);
  const isChangingSearchParams = useRef(false);

  const filters = useMemo(
    () => ({
      minRating,
      openNow,
      radius,
    }),
    [minRating, openNow, radius],
  );

  useEffect(() => {
    isChangingSearchParams.current = true;

    setCurrentQuery(query);

    setPageToken(null);
    setAllPlaces([]);
    setPaginationError(null);

    const timeoutId = setTimeout(() => {
      isChangingSearchParams.current = false;
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [query, minRating, openNow, radius, size]);

  const updateSearchParams = useCallback(
    ({ query, filters, size }: UpdateSearchParamsProps) => {
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

      if (
        filters?.minRating &&
        filters.minRating !== PLACE_FILTERS.RATING.MIN
      ) {
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
    },
    [searchParams, router, pathname],
  );

  const {
    data: searchData,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.SEARCH,
      query,
      filters,
      size,
      useLocationBias ? coords : null,
    ],
    queryFn: async () => {
      try {
        const result = await searchPlacesClient(
          query,
          size,
          useLocationBias ? coords : { latitude: null, longitude: null },
          filters,
          undefined,
        );

        if (!result) {
          throw new Error("No search results found");
        }

        return result;
      } catch (error) {
        console.error("Search error:", error);
        throw error;
      }
    },
    enabled:
      query.length > 0 && (!isLoadingLocation || permissionState !== "prompt"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: paginationData, isPending: isPaginationPending } = useQuery({
    queryKey: [
      QUERY_KEYS.SEARCH_MORE,
      query,
      filters,
      size,
      useLocationBias ? coords : null,
      pageToken,
    ],
    queryFn: async ({ queryKey }) => {
      const queryFromKey = queryKey[1] as string;
      const tokenFromKey = queryKey[5] as string | null;

      if (isChangingSearchParams.current) {
        console.warn(
          "Search parameters are changing, aborting pagination request",
        );
        return null;
      }

      if (!tokenFromKey) {
        return null;
      }

      if (queryFromKey !== currentQuery) {
        console.warn("Query has changed, aborting pagination request");
        return null;
      }

      try {
        const result = await searchPlacesClient(
          queryFromKey,
          size,
          useLocationBias ? coords : { latitude: null, longitude: null },
          filters,
          tokenFromKey,
        );

        if (!result) {
          throw new Error("Failed to load more results");
        }

        return result;
      } catch (error) {
        console.error("Pagination error:", error);
        setPaginationError("Failed to load more results. Please try again.");
        throw error;
      } finally {
        setIsLoadingMore(false);
      }
    },
    enabled:
      !!pageToken &&
      query.length > 0 &&
      query === currentQuery &&
      !isChangingSearchParams.current,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (searchData?.places && allPlaces.length === 0) {
      setAllPlaces(searchData.places);
    }
  }, [searchData, allPlaces.length]);

  useEffect(() => {
    if (paginationData?.places && pageToken) {
      setAllPlaces((prevPlaces) => {
        const existingIds = new Map(
          prevPlaces.map((place) => [place.id, true]),
        );

        const newPlaces = paginationData.places.filter(
          (place) => !existingIds.has(place.id),
        );

        return [...prevPlaces, ...newPlaces];
      });
    }
  }, [paginationData, pageToken]);

  const loadMore = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isChangingSearchParams.current) {
        console.warn("Search parameters are changing, not loading more");
        return;
      }

      if (query !== currentQuery) {
        console.warn("Query has changed, not loading more");
        return;
      }

      const nextPageToken = pageToken
        ? paginationData?.nextPageToken
        : searchData?.nextPageToken;

      if (!nextPageToken) {
        return;
      }

      try {
        setPaginationError(null);
        setIsLoadingMore(true);
        setPageToken(nextPageToken);
      } catch (error) {
        console.error("Error loading more results:", error);
        setPaginationError("Failed to load more results. Please try again.");
        setIsLoadingMore(false);
      }
    },
    [
      searchData?.nextPageToken,
      paginationData?.nextPageToken,
      pageToken,
      query,
      currentQuery,
    ],
  );

  const mergedData = useMemo(() => {
    if (!searchData && allPlaces.length === 0) {
      return undefined;
    }

    return {
      ...(paginationData || searchData),
      places: allPlaces,
    };
  }, [searchData, paginationData, allPlaces]);

  return {
    query,
    filters,
    size,
    updateSearchParams,
    data: mergedData,
    isPending: isPending && !searchData,
    isError,
    loadMore,
    hasMore: !!(pageToken
      ? paginationData?.nextPageToken
      : searchData?.nextPageToken),
    isLoadingMore: isPaginationPending && isLoadingMore,
    paginationError,
  };
};
