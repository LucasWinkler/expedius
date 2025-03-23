import { getPriceLevelDisplayShort } from "@/lib/place";
import { ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPlaceType } from "@/utils/places";
import type { PlaceDetails } from "@/types";

interface PlaceDetailsHeaderProps {
  displayName: PlaceDetails["displayName"];
  rating: PlaceDetails["rating"];
  userRatingCount: PlaceDetails["userRatingCount"];
  priceLevel: PlaceDetails["priceLevel"];
  types: PlaceDetails["types"];
  googleMapsLinks: PlaceDetails["googleMapsLinks"];
}

export const PlaceDetailsHeader = ({
  displayName,
  rating,
  userRatingCount,
  priceLevel,
  types,
  googleMapsLinks,
}: PlaceDetailsHeaderProps) => {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        <a
          className="flex w-fit gap-2 hover:underline hover:underline-offset-4"
          href={googleMapsLinks.placeUri}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${displayName.text} on Google Maps`}
        >
          {displayName.text}
          <ExternalLink className="size-4 shrink-0 md:size-5 xl:size-6" />
        </a>
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="size-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="flex items-center text-muted-foreground">
              (
              <a
                href={googleMapsLinks.reviewsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline hover:underline-offset-4"
              >
                {userRatingCount} reviews
              </a>
              )
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
