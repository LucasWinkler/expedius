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
    isPermissionPending,
    requestLocation,
    hasRequestedLocation,
  } = useLocation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const useLocationBias = useMemo(() => {
    const result =
      permissionState === "granted" &&
      !isLoadingLocation &&
      !isPermissionPending &&
      coords.latitude !== null &&
      coords.longitude !== null;

    return result;
  }, [coords, isLoadingLocation, permissionState, isPermissionPending]);

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

  const shouldEnableSearch = useMemo(() => {
    if (query.length === 0) return false;

    // If location permission is still pending, don't search yet
    if (isPermissionPending) return false;

    // If permission granted but location still loading, don't search yet
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
  }, [query, permissionState, isLoadingLocation, coords, isPermissionPending]);

  // Request location when needed
  useEffect(() => {
    if (query.length > 0 && !hasRequestedLocation) {
      void requestLocation();
    }
  }, [query, hasRequestedLocation, requestLocation]);

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
        // Ensure location has been requested if needed
        if (!hasRequestedLocation) {
          await requestLocation();
        }

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
        console.error("[SEARCH] Error:", error);
        throw error;
      }
    },
    enabled: shouldEnableSearch,
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
        console.warn("[SEARCH] Parameters changing, aborting pagination");
        return null;
      }

      if (!tokenFromKey) {
        return null;
      }

      if (queryFromKey !== currentQuery) {
        console.warn("[SEARCH] Query changed, aborting pagination");
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
        console.error("[SEARCH] Pagination error:", error);
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
      !isChangingSearchParams.current &&
      shouldEnableSearch,
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
        return;
      }

      if (query !== currentQuery) {
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
        console.error("[SEARCH] Load more error:", error);
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
    isPending:
      isPending || (!!searchData && allPlaces.length === 0 && !isError),
    isError,
    loadMore,
    hasMore: !!(pageToken
      ? paginationData?.nextPageToken
      : searchData?.nextPageToken),
    isLoadingMore: isPaginationPending && isLoadingMore,
    paginationError,
    isPermissionPending,
    locationPermissionState: permissionState,
  };
};
