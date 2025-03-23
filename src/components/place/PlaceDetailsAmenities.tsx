"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

interface PlaceDetailsAmenitiesProps {
  features: string[];
}

export const PlaceDetailsAmenities = ({
  features,
}: PlaceDetailsAmenitiesProps) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  if (features.length === 0) return null;

  const displayedFeatures = showAllFeatures ? features : features.slice(0, 6);
  const featuresCount = features.length;

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Amenities
        {featuresCount > 6 && (
          <span className="text-muted-foreground"> ({featuresCount})</span>
        )}
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {displayedFeatures.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {features.length > 6 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full hover:bg-transparent hover:text-primary sm:w-auto"
          onClick={() => setShowAllFeatures(!showAllFeatures)}
        >
          {showAllFeatures ? (
            <>
              Show less <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              See all amenities <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </section>
  );
};
