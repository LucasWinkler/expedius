"use client";

import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { PLACE_FILTERS } from "@/constants";

interface FilterChipsProps {
  filters: {
    radius?: number;
    minRating?: number;
    openNow?: boolean;
  };
  onClearFilters: (filterType?: "radius" | "rating" | "openNow") => void;
}

export function FilterChips({ filters, onClearFilters }: FilterChipsProps) {
  const clearFilter = ({
    filterType,
    event,
  }: {
    filterType: "radius" | "rating" | "openNow";
    event: React.MouseEvent<HTMLButtonElement>;
  }) => {
    event.stopPropagation();
    onClearFilters(filterType);
  };

  if (!filters || (!filters.radius && !filters.minRating && !filters.openNow)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {filters.radius && (
        <div className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 pr-2 text-accent-foreground shadow-sm ring-1 ring-accent/50 transition-all hover:bg-accent/90 hover:shadow">
          <span>
            Within {filters.radius / 1000}km /{" "}
            {Math.round(filters.radius / 1609.34)}mi
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full p-0 opacity-70 transition-opacity hover:opacity-100"
            onClick={(e) => {
              clearFilter({ filterType: "radius", event: e });
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear radius filter</span>
          </Button>
        </div>
      )}

      {filters.minRating && filters.minRating > PLACE_FILTERS.RATING.MIN && (
        <div className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 pr-2 text-accent-foreground shadow-sm ring-1 ring-accent/50 transition-all hover:bg-accent/90 hover:shadow">
          <span className="flex items-center gap-1">
            {filters.minRating}
            {filters.minRating < 5 && "+"}
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full p-0 opacity-70 transition-opacity hover:opacity-100"
            onClick={(e) => {
              clearFilter({ filterType: "rating", event: e });
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear rating filter</span>
          </Button>
        </div>
      )}

      {filters.openNow && (
        <div className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 pr-2 text-accent-foreground shadow-sm ring-1 ring-accent/50 transition-all hover:bg-accent/90 hover:shadow">
          <span>Open Now</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full p-0 opacity-70 transition-opacity hover:opacity-100"
            onClick={(e) => {
              clearFilter({ filterType: "openNow", event: e });
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear open now filter</span>
          </Button>
        </div>
      )}

      {(filters.radius !== undefined &&
      filters.radius !== PLACE_FILTERS.RADIUS.DEFAULT
        ? 1
        : 0) +
        (filters.minRating && filters.minRating > PLACE_FILTERS.RATING.MIN
          ? 1
          : 0) +
        (filters.openNow ? 1 : 0) >
        1 && (
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground shadow-sm ring-1 ring-accent/50 transition-all hover:bg-accent/80 hover:text-accent-foreground/90"
          onClick={() => onClearFilters()}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
