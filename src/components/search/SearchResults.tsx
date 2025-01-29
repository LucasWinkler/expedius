"use client";

import { PlaceCard } from "../places/PlaceCard";
import { useSearch } from "@/hooks/useSearch";
import SearchSkeleton from "@/components/search/SearchSkeleton";
import { NoResult } from "../places/NoResult";

interface SearchResultsProps {
  query: string;
}

export const SearchResults = ({ query }: SearchResultsProps) => {
  const { data: searchData, isPending: isSearchPending } = useSearch({
    query,
    size: 12,
  });

  if (isSearchPending) {
    return <SearchSkeleton />;
  }

  if (!searchData?.places.length) {
    return <NoResult />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {searchData.places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </ul>
  );
};
