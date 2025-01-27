"use client";

import { useEffect, useState, useTransition } from "react";
import { PlaceCard } from "../places/PlaceCard";
import { searchPlacesClient } from "@/lib/search";
import { useLocation } from "@/contexts/LocationContext";
import type { Place } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPinOff } from "lucide-react";
import { useSession } from "@/lib/auth-client";

type SearchResultsProps = {
  query: string;
};

const SearchResultsSkeleton = () => {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </ul>
  );
};

const SearchError = () => {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center text-muted-foreground">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <MapPinOff className="size-8" />

        <p className="max-w-[250px] text-center">No places found</p>
        <p className="max-w-[250px] text-center text-sm">
          Try granting location permissions then refreshing the page or
          adjusting your search term.
        </p>
      </div>
    </Card>
  );
};

export const SearchResults = ({ query }: SearchResultsProps) => {
  const { coords, isLoading: isLoadingLocation } = useLocation();
  const { data: session } = useSession();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const searchData = await searchPlacesClient(query, 15, coords);

        startTransition(() => {
          setPlaces(searchData?.places || []);
          setIsInitialLoad(false);
          setError(false);
        });
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setError(true);
        setIsInitialLoad(false);
      }
    };

    if (!isLoadingLocation) {
      fetchResults();
    }
  }, [query, coords, isLoadingLocation, session?.user.id]);

  if (isInitialLoad || isPending) {
    return <SearchResultsSkeleton />;
  }

  if (error || (places.length === 0 && query)) {
    return <SearchError />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {places.map((place, index) => (
        <PlaceCard key={place.id} place={place} priority={index < 3} />
      ))}
    </ul>
  );
};

export default SearchResults;
