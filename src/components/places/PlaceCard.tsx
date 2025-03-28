"use client";

import Image from "next/image";
import Link from "next/link";
import type { Place } from "@/types";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getPriceLevelDisplayShort } from "@/lib/place";
import placeImageFallback from "@/../public/place-image-fallback.webp";
import { useLocation } from "@/contexts/LocationContext";
import { useMemo, useEffect } from "react";
import { calculateDistance } from "@/utils/places";

interface PlaceCardProps {
  place: Place;
  priority?: boolean;
  actions?: React.ReactNode;
  isListItem?: boolean;
}

export const PlaceCard = ({
  place,
  priority,
  actions,
  isListItem,
}: PlaceCardProps) => {
  const Comp = isListItem ? "li" : "div";

  const {
    coords,
    isLoading: isLoadingLocation,
    permissionState,
    requestLocation,
    hasRequestedLocation,
  } = useLocation();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !hasRequestedLocation &&
      permissionState === "prompt"
    ) {
      requestLocation();
    }
  }, [requestLocation, hasRequestedLocation, permissionState]);

  const distance = useMemo(() => {
    if (
      !place.location ||
      permissionState !== "granted" ||
      isLoadingLocation ||
      coords.latitude === null ||
      coords.longitude === null
    ) {
      return null;
    }

    const kmDistance = calculateDistance(
      coords.latitude,
      coords.longitude,
      place.location.latitude,
      place.location.longitude,
      "km",
    );

    const miDistance = calculateDistance(
      coords.latitude,
      coords.longitude,
      place.location.latitude,
      place.location.longitude,
      "mi",
    );

    return { km: kmDistance, mi: miDistance };
  }, [coords, place.location, permissionState, isLoadingLocation]);

  return (
    <Comp className="group list-none">
      <Card className="relative overflow-hidden bg-muted shadow-none">
        <Link href={`/place/${place.id}`} className="block">
          <div className="relative m-4 overflow-hidden rounded-lg">
            {place.image ? (
              <>
                <Image
                  className="aspect-[4/3] h-full w-full rounded-lg object-cover duration-200 ease-in-out group-hover:scale-105"
                  src={place.image.url}
                  width={place.image.width}
                  height={place.image.height}
                  placeholder={place.image.blurDataURL ? "blur" : undefined}
                  blurDataURL={place.image.blurDataURL ?? undefined}
                  alt={place.displayName.text}
                  priority={priority}
                  unoptimized
                />
                {(() => {
                  const photo = place.photos?.[0];
                  const attributions = photo?.authorAttributions;
                  if (!attributions?.length) return null;

                  return (
                    <div className="absolute bottom-2 left-2 right-2 z-20 rounded bg-black/60 px-2 py-1 text-xs text-white/90">
                      <p className="line-clamp-2">
                        Photo by{" "}
                        {attributions.map((author, i) => (
                          <a
                            key={author.uri}
                            href={author.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                author.uri,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                          >
                            {author.displayName}
                            {i < attributions.length - 1 ? ", " : ""}
                          </a>
                        ))}
                      </p>
                    </div>
                  );
                })()}
              </>
            ) : (
              <Image
                className="aspect-[4/3] h-full w-full rounded-lg object-cover duration-200 ease-in-out group-hover:scale-105"
                src={placeImageFallback}
                placeholder="blur"
                alt=""
                unoptimized
                priority={priority}
              />
            )}
          </div>
          <CardHeader className="space-y-2 p-4 pb-2 pt-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 text-lg group-hover:underline group-hover:underline-offset-4">
                {place.displayName.text}
              </CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {getPriceLevelDisplayShort(place.priceLevel)}
              </span>
            </div>
            {place.rating && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{place.rating}</span>
                  <span className="ml-0.5 text-muted-foreground">
                    /<span className="ml-0.5">5</span>
                  </span>
                </div>
                {place.userRatingCount && (
                  <span className="text-sm text-muted-foreground">
                    ({place.userRatingCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="line-clamp-1 text-sm text-muted-foreground">
                    {place.formattedAddress}
                  </span>

                  {place.location && (
                    <div className="mt-0.5 flex items-center text-xs">
                      {distance &&
                      distance.km !== null &&
                      distance.mi !== null ? (
                        <span className="text-muted-foreground">
                          {distance.km} km / {distance.mi} mi
                        </span>
                      ) : isLoadingLocation ? (
                        <span className="animate-pulse text-muted-foreground">
                          Getting distance...
                        </span>
                      ) : permissionState === "denied" ? (
                        <span className="text-muted-foreground/70">
                          Distance unavailable
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
        <div className="absolute right-6 top-6 flex flex-col gap-2">
          {actions}
        </div>
      </Card>
    </Comp>
  );
};
