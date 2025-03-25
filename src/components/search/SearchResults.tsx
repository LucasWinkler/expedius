"use client";

import {
  PlaceCard,
  NoPlaceResults,
  SaveToListButton,
  LikeButton,
} from "@/components/places";
import { useSearch } from "@/hooks/useSearch";
import { SearchSkeleton } from "./SearchSkeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlaceCardSkeleton } from "@/components/skeletons/PlaceCardSkeleton";
import { cn } from "@/lib/utils";
interface SearchResultsProps {
  className?: string;
}

export const SearchResults = ({ className }: SearchResultsProps) => {
  const {
    data,
    isPending,
    loadMore,
    hasMore,
    isLoadingMore,
    paginationError,
    size,
    isError,
  } = useSearch();

  const skeletonCount = size || 3;

  if (isPending || (data && !data.places)) {
    return <SearchSkeleton className={className} />;
  }

  if (isError) {
    return <NoPlaceResults isError={true} className={className} />;
  }

  if (!isPending && data?.places?.length === 0) {
    return <NoPlaceResults className={className} />;
  }

  return (
    <div className={cn("space-y-8", className)}>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.places?.map((place) => (
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

      {isLoadingMore && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(skeletonCount)].map((_, i) => (
            <PlaceCardSkeleton
              key={`loading-skeleton-${i}`}
              showActions={true}
            />
          ))}
        </div>
      )}

      {paginationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{paginationError}</AlertDescription>
        </Alert>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};
