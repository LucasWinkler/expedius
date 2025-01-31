"use client";

import { PlaceCard } from "../places/PlaceCard";
import { useSearch } from "@/hooks/useSearch";
import SearchSkeleton from "@/components/search/SearchSkeleton";
import { NoPlaceResults } from "../places/NoPlaceResults";
import { SaveToListButton } from "../places/SaveToListButton";
import { LikeButton } from "../places/LikeButton";

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
    return <NoPlaceResults />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {searchData.places.map((place) => (
        <PlaceCard
          isListItem
          key={place.id}
          place={place}
          actions={
            <>
              <LikeButton placeId={place.id} />
              <SaveToListButton placeId={place.id} />
            </>
          }
        />
      ))}
    </ul>
  );
};
