"use client";

import { PlaceCard } from "../places/PlaceCard";
import { NoPlaceResults } from "../places/NoPlaceResults";
import { SaveToListButton } from "../places/SaveToListButton";
import { LikeButton } from "../places/LikeButton";
import { useSearch } from "@/hooks/useSearch";
import SearchSkeleton from "./SearchSkeleton";

export const SearchResults = () => {
  const { data, isPending } = useSearch();

  if (isPending) {
    return <SearchSkeleton />;
  }

  if (!data?.places.length) {
    return <NoPlaceResults />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.places.map((place) => (
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
