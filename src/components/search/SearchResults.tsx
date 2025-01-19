"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";

type SearchResult = {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  photos?: Array<{ name: string }>;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: number;
};

type SearchResultsProps = {
  query?: string;
};

export const SearchResults = ({ query }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchPlaces = async () => {
      if (!query?.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/places/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to search places");

        setResults(data.places || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchPlaces();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  if (!query?.trim()) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Enter a search term to find places</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>No places found for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((place) => (
        <PlaceCard
          key={place.id}
          // userLists={userLists}
          place={{
            id: place.id,
            name: place.displayName.text,
            address: place.formattedAddress,
            photo: place.photos?.[0]?.name,
            rating: place.rating,
            userRatingCount: place.userRatingCount,
            priceLevel: place.priceLevel,
          }}
        />
      ))}
    </div>
  );
};
