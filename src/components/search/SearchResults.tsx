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
import { AlertCircle, Clock } from "lucide-react";
import { PlaceCardSkeleton } from "@/components/skeletons/PlaceCardSkeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    error,
  } = useSearch();

  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const isQuotaError = error?.message?.includes("Too Many Requests");

  useEffect(() => {
    if (!isQuotaError) return;

    const calculateTimeToReset = () => {
      const now = new Date();
      const pacificDate = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const tomorrow = new Date(pacificDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - pacificDate.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    setTimeRemaining(calculateTimeToReset());

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeToReset());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [isQuotaError]);

  const skeletonCount = size || 3;

  if (isPending || (data && !data.places)) {
    return <SearchSkeleton className={className} />;
  }

  if (isError) {
    if (isQuotaError) {
      return (
        <div className={cn("space-y-6 py-8", className)}>
          <div className="flex flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">API Quota Exceeded</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              We've reached our daily limit for Google Places API requests. The
              quota will reset at midnight Pacific Time.
            </p>
            {timeRemaining && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-amber-700">
                <Clock className="h-5 w-5" />
                <span>Resets in approximately {timeRemaining}</span>
              </div>
            )}
            <Button variant="outline" asChild className="mt-4">
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      );
    }
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
