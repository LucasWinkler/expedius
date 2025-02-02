"use client";

import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { DiscoverEmptyState } from "./DiscoverEmptyState";

export const DiscoverContent = () => {
  const { query } = useSearch();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
      <div className="mb-8 space-y-4">
        <SearchBar variant="advanced" />
        {query && (
          <p className="text-sm text-muted-foreground">
            Showing results for &quot;{query}&quot;
          </p>
        )}
      </div>

      <div className="mt-6">
        {query ? <SearchResults /> : <DiscoverEmptyState />}
      </div>
    </div>
  );
};
