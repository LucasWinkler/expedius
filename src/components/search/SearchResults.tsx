"use client";

import {
  PlaceCard,
  NoPlaceResults,
  SaveToListButton,
  LikeButton,
} from "@/components/places";
import { useSearch } from "@/hooks/useSearch";
import { SearchSkeleton } from "./SearchSkeleton";

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
