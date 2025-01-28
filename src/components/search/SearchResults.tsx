"use client";

import { PlaceCard } from "../places/PlaceCard";
import { useSearch } from "@/hooks/useSearch";
import SearchSkeleton from "@/components/search/SearchSkeleton";
import { NoResult } from "../places/NoResult";

interface SearchResultsProps {
  query: string;
}

export const SearchResults = ({ query }: SearchResultsProps) => {
  const { data, isPending, isError } = useSearch({
    query,
    size: 12,
  });

  if (isPending) {
    return <SearchSkeleton />;
  }

  if (isError || !data?.places?.length) {
    return <NoResult isError={isError} />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          initialIsLiked={!!data.likeStatuses[place.id]}
          initialLists={data.userLists}
        />
      ))}
    </ul>
  );
};
