"use client";

import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { ExploreEmptyState } from "./ExploreEmptyState";
import { FilterChips } from "./FilterChips";
import { PLACE_FILTERS } from "@/constants";
import { SUGGESTION_CONTEXTS } from "@/lib/suggestions";

export const ExploreContent = () => {
  const { query, filters, updateSearchParams } = useSearch();

  const handleClearFilters = (filterType?: "radius" | "rating" | "openNow") => {
    if (!filterType) {
      updateSearchParams({
        query,
        filters: {
          radius: PLACE_FILTERS.RADIUS.DEFAULT,
          minRating: PLACE_FILTERS.RATING.MIN,
          openNow: false,
        },
      });
    } else {
      const newFilters = { ...filters };
      switch (filterType) {
        case "radius":
          newFilters.radius = PLACE_FILTERS.RADIUS.DEFAULT;
          break;
        case "rating":
          newFilters.minRating = PLACE_FILTERS.RATING.MIN;
          break;
        case "openNow":
          newFilters.openNow = false;
          break;
      }
      updateSearchParams({
        query,
        filters: newFilters,
      });
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SearchBar variant="with-filters" className="w-full" />
        </div>

        <FilterChips filters={filters} onClearFilters={handleClearFilters} />
      </div>

      {query ? (
        <>
          <p className="mb-6 mt-12 text-sm text-muted-foreground">
            Showing results for &quot;{query}&quot;
          </p>
          <SearchResults className="mt-4" />
        </>
      ) : (
        <ExploreEmptyState
          className="mt-12"
          context={SUGGESTION_CONTEXTS.EXPLORE}
        />
      )}
    </>
  );
};
