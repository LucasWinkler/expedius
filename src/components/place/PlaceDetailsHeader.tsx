import { getPriceLevelDisplayShort } from "@/lib/place";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPlaceType } from "@/utils/places";
import type { PlaceDetails } from "@/types";

interface PlaceDetailsHeaderProps {
  displayName: PlaceDetails["displayName"];
  rating: PlaceDetails["rating"];
  userRatingCount: PlaceDetails["userRatingCount"];
  priceLevel: PlaceDetails["priceLevel"];
  types: PlaceDetails["types"];
}

export const PlaceDetailsHeader = ({
  displayName,
  rating,
  userRatingCount,
  priceLevel,
  types,
}: PlaceDetailsHeaderProps) => {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        {displayName.text}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {rating && (
          <div className="flex items-center">
            <Star className="size-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{rating}</span>
            <span className="ml-1 text-muted-foreground">
              ({userRatingCount} reviews)
            </span>
          </div>
        )}
        {priceLevel && rating && (
          <span className="text-muted-foreground">•</span>
        )}
        {priceLevel && (
          <span className="font-medium">
            {getPriceLevelDisplayShort(priceLevel)}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {types.map((type, index) => (
          <Badge key={index} variant="secondary" className="capitalize">
            {formatPlaceType({ type })}
          </Badge>
        ))}
      </div>
    </header>
  );
};
